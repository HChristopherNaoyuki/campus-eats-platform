import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as api from "@/lib/restaurantApi";
import { firebaseSignOut, signInOrCreate, syncOwnProfile } from "@/lib/firebaseUsers";
import type {
  Feedback,
  MenuItem,
  Order,
  OrderStatus,
  Role,
  SecurityLog,
  User,
  Vendor,
} from "@/types/campus";

const uid = () => Math.random().toString(36).slice(2, 9);

// 16-character global user identifier (alphanumeric, uppercase).
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const genUserId = () =>
  Array.from({ length: 16 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join("");

// Deterministic 16-char User ID derived from the API usercode (UUID).
const idFromUsercode = (usercode: string) =>
  usercode.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 16).padEnd(16, "0");

// Order ID format: ORD-YYYYMMDD-XXXXXXXX
const genOrderId = () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const suffix = Array.from({ length: 8 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join("");
  return `ORD-${ymd}-${suffix}`;
};

// Pricing helper per process document section 10.1:
// subtotal -> +20% tax -> round up to next R5 -> 2.5% student discount.
export const priceOrder = (
  lines: { itemId: string; quantity: number }[],
  menu: MenuItem[],
  role: Role
) => {
  const subtotal = lines.reduce((s, l) => {
    const it = menu.find((m) => m.id === l.itemId);
    return s + (it?.price ?? 0) * l.quantity;
  }, 0);
  const taxed = subtotal * 1.2;
  const rounded = Math.ceil(taxed / 5) * 5;
  const discount = role === "Student" ? rounded * 0.025 : 0;
  const total = rounded - discount;
  return {
    subtotal: +subtotal.toFixed(2),
    tax: +(taxed - subtotal).toFixed(2),
    discount: +discount.toFixed(2),
    total: +total.toFixed(2),
  };
};

// 8 demo accounts (process document section 12). They are provisioned on the
// Fake Restaurant API on first sign-in so their usercode/apikey is real.
const DEMO_ACCOUNTS: Omit<User, "usercode">[] = [
  { id: "STUDENT000000001", name: "Student_01", email: "student01@campus.edu", password: "student", role: "Student" },
  { id: "STUDENT000000002", name: "Student_02", email: "student02@campus.edu", password: "student", role: "Student" },
  { id: "STANDARD00000001", name: "Standard_01", email: "standard01@campus.edu", password: "standard", role: "Standard" },
  { id: "STANDARD00000002", name: "Standard_02", email: "standard02@campus.edu", password: "standard", role: "Standard" },
  { id: "VENDOR0000000001", name: "Vendor_01", email: "vendor01@campus.edu", password: "vendor", role: "Vendor" },
  { id: "VENDOR0000000002", name: "Vendor_02", email: "vendor02@campus.edu", password: "vendor", role: "Vendor" },
  { id: "ADMIN00000000001", name: "Admin_01", email: "admin01@campus.edu", password: "admin", role: "Admin" },
  { id: "ADMIN00000000002", name: "Admin_02", email: "admin02@campus.edu", password: "admin", role: "Admin" },
];

interface State {
  users: User[];
  vendors: Vendor[];
  menu: MenuItem[];
  orders: Order[];
  feedback: Feedback[];
  logs: SecurityLog[];
  currentUserId: string | null;
  apiKey: string | null;
  catalogLoading: boolean;
  catalogLoaded: boolean;
  catalogError: string | null;
  /** Firebase Authentication UID of the signed-in user (null when signed out). */
  firebaseUid: string | null;
  /** Last Firebase auth/database error, surfaced instead of being swallowed. */
  firebaseError: string | null;

  loadCatalog: (force?: boolean) => Promise<void>;
  registerUser: (u: Omit<User, "id">) => Promise<User>;
  login: (identifier: string, password: string) => Promise<User | null>;
  /** Google single sign-on through Firebase Authentication. */
  loginWithGoogle: () => Promise<User | null>;
  /** Updates the signed-in user's own display name (local + Firebase). */
  updateProfile: (patch: { name?: string }) => Promise<void>;
  logout: () => void;
  resetPassword: (userIdOrEmail: string, newPassword: string) => Promise<boolean>;

  addVendor: (v: Omit<Vendor, "id">) => void;
  updateVendor: (id: string, patch: Partial<Omit<Vendor, "id">>) => void;

  addMenuItem: (m: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, patch: Partial<Omit<MenuItem, "id">>) => void;
  removeMenuItem: (id: string) => void;

  placeOrder: (userId: string, lines: { itemId: string; quantity: number }[]) => Promise<void>;
  syncOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  addFeedback: (f: Omit<Feedback, "id" | "createdAt">) => void;
  log: (action: string, detail?: string, userId?: string | null) => void;
}

/**
 * Signs the campus user in to Firebase Authentication and makes sure their
 * `users/<19-char id>` record exists.
 *
 * The campus account (Fake Restaurant API usercode) stays the primary
 * identity; Firebase is a parallel identity used purely as the security
 * context for the Realtime Database. The plaintext password is passed to
 * Firebase Authentication only — it is never written to the database.
 *
 * Failures are recorded on `firebaseError` and in the security log rather
 * than being swallowed, and they never turn into a "successful" write.
 */
async function linkFirebaseIdentity(user: User, password: string): Promise<void>
{
  const store = useCampus.getState();

  if (!password)
  {
    // No password in hand (e.g. a restored session) — cannot sign in.
    useCampus.setState({ firebaseError: "Firebase sign-in skipped: no password available." });
    return;
  }

  try
  {
    const fbUser = await signInOrCreate(user.email, password);
    useCampus.setState({ firebaseUid: fbUser.uid, firebaseError: null });
    store.log("FIREBASE_AUTH_OK", user.email, user.id);

    try
    {
      const key = await syncOwnProfile({
        campusId: user.id,
        fullName: user.name,
        email: user.email,
        role: user.role,
        firebaseUid: fbUser.uid,
      });
      store.log("FIREBASE_PROFILE_SYNCED", key, user.id);
    }
    catch (dbErr)
    {
      // Typically PERMISSION_DENIED — for example an ADMIN role write from a
      // client that does not hold the admin custom claim.
      const message = dbErr instanceof Error ? dbErr.message : String(dbErr);
      useCampus.setState({ firebaseError: message });
      store.log("FIREBASE_PROFILE_FAILED", message, user.id);
      console.error("[firebase] profile sync failed:", dbErr);
    }
  }
  catch (authErr)
  {
    const message = authErr instanceof Error ? authErr.message : String(authErr);
    useCampus.setState({ firebaseUid: null, firebaseError: message });
    store.log("FIREBASE_AUTH_FAILED", message, user.id);
    console.error("[firebase] authentication failed:", authErr);
  }
}

export const useCampus = create<State>()(
  persist(
    (set, get) => ({
      // Seed users are in-memory only — partialize strips them from
      // localStorage so no plaintext credentials are written to disk.
      users: DEMO_ACCOUNTS.map((u) => ({ ...u })),
      vendors: [],
      menu: [],
      orders: [],
      feedback: [],
      logs: [],
      currentUserId: null,
      apiKey: null,
      catalogLoading: false,
      catalogLoaded: false,
      catalogError: null,
      firebaseUid: null,
      firebaseError: null,

      // Pull restaurants + menu items from the Fake Restaurant API.
      loadCatalog: async (force = false) => {
        if (get().catalogLoading) return;
        if (get().catalogLoaded && !force) return;
        set({ catalogLoading: true, catalogError: null });
        try {
          const [restaurants, items] = await Promise.all([
            api.getRestaurants(),
            api.getAllItems(),
          ]);
          const vendors: Vendor[] = restaurants
            .map((r) => ({
              id: String(r.restaurantID),
              name: r.restaurantName,
              location: r.address,
              contact: r.type,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          const existing = get().menu;
          const menu: MenuItem[] = items.map((i) => {
            const prev = existing.find((m) => m.id === String(i.itemID));
            return {
              id: String(i.itemID),
              name: i.itemName,
              price: i.itemPrice,
              vendorId: String(i.restaurantID),
              description: i.itemDescription,
              imageUrl: i.imageUrl,
              available: prev?.available ?? true,
              stock: prev?.stock ?? 25,
            };
          });
          // Keep locally created items that the API does not know about.
          const localOnly = existing.filter((m) => m.id.startsWith("local-"));

          // Bind the two demo vendor accounts to real restaurants.
          const users = get().users.map((u) => {
            if (u.role !== "Vendor" || u.vendorId) return u;
            const idx = u.email === "vendor01@campus.edu" ? 0 : u.email === "vendor02@campus.edu" ? 1 : -1;
            return idx >= 0 && vendors[idx] ? { ...u, vendorId: vendors[idx].id } : u;
          });

          set({
            vendors,
            menu: [...menu, ...localOnly],
            users,
            catalogLoaded: true,
            catalogLoading: false,
          });
          get().log("CATALOG_SYNCED", `${vendors.length} vendors / ${menu.length} items`);
        } catch (e) {
          set({
            catalogLoading: false,
            catalogError: e instanceof Error ? e.message : "Failed to load catalog",
          });
        }
      },

      registerUser: async (u) => {
        const email = u.email.trim();
        let usercode: string | undefined;
        try {
          const created = await api.registerUser(email, u.password);
          usercode = created.usercode;
        } catch {
          // Email may already exist on the API — fall back to fetching its code.
          usercode = (await api.getUserCode(email, u.password)) ?? undefined;
        }
        if (!usercode) throw new Error("Registration failed — that email may already be taken.");
        const user: User = { ...u, email, id: idFromUsercode(usercode) || genUserId(), usercode };
        set({ users: [...get().users.filter((x) => x.email !== email), user] });
        get().log("USER_REGISTERED", `${user.role}:${user.email}`, user.id);
        // Mirror the account into Firebase Auth + the users/ path.
        await linkFirebaseIdentity(user, u.password);
        return user;
      },

      login: async (identifier, password) => {
        const key = identifier.trim();
        const local = get().users.find(
          (u) => u.email.toLowerCase() === key.toLowerCase() || u.id === key.toUpperCase()
        );
        const email = local?.email ?? key;

        let usercode = await api.getUserCode(email, password);
        if (!usercode) {
          // Demo accounts are provisioned on the API on first use.
          const demo = DEMO_ACCOUNTS.find((d) => d.email === email && d.password === password);
          if (demo) {
            try {
              usercode = (await api.registerUser(email, password)).usercode;
            } catch {
              usercode = await api.getUserCode(email, password);
            }
          }
        }
        if (!usercode) {
          get().log("LOGIN_FAILED", key, null);
          return null;
        }

        let user = local
          ? { ...local, usercode }
          : {
              id: idFromUsercode(usercode),
              name: email.split("@")[0],
              email,
              password: "",
              role: "Standard" as Role,
              usercode,
            };
        // Newly created vendor bindings survive catalog reloads.
        if (user.role === "Vendor" && !user.vendorId) {
          const idx = email === "vendor02@campus.edu" ? 1 : 0;
          user = { ...user, vendorId: get().vendors[idx]?.id };
        }
        set({
          users: [...get().users.filter((u) => u.id !== user.id), user],
          currentUserId: user.id,
          apiKey: usercode,
        });
        get().log("LOGIN_SUCCESS", user.email, user.id);
        void get().syncOrders();
        // Establish the Firebase security context for this session. Awaited so
        // that protected database calls made straight after login have an
        // authenticated Firebase user (or a recorded error).
        await linkFirebaseIdentity(user, password);
        return user;
      },

      // Google SSO. Firebase owns the credential exchange; the campus record
      // is derived from the verified Google e-mail. No Fake Restaurant API
      // usercode exists for such a session, so ordering through the upstream
      // API stays disabled until the user links a password account.
      loginWithGoogle: async () => {
        let fbUser;
        try {
          fbUser = await signInWithGoogle();
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          set({ firebaseError: message });
          get().log("FIREBASE_AUTH_FAILED", message, null);
          return null;
        }

        const email = (fbUser.email ?? "").toLowerCase();
        if (!email) {
          set({ firebaseError: "Google account has no e-mail address." });
          return null;
        }

        const existing = get().users.find((u) => u.email.toLowerCase() === email);
        const user: User = existing
          ? { ...existing, firebaseUid: fbUser.uid }
          : {
              id: idFromUsercode(fbUser.uid),
              name: fbUser.displayName ?? email.split("@")[0],
              email,
              password: "",
              role: "Standard" as Role,
              firebaseUid: fbUser.uid,
            };

        set({
          users: [...get().users.filter((u) => u.id !== user.id), user],
          currentUserId: user.id,
          firebaseUid: fbUser.uid,
          firebaseError: null,
        });
        get().log("LOGIN_SUCCESS_SSO", user.email, user.id);

        try {
          await syncOwnProfile({
            campusId: user.id,
            fullName: user.name,
            email: user.email,
            role: user.role,
            firebaseUid: fbUser.uid,
          });
        } catch (dbErr) {
          const message = dbErr instanceof Error ? dbErr.message : String(dbErr);
          set({ firebaseError: message });
          get().log("FIREBASE_PROFILE_FAILED", message, user.id);
          console.error("[firebase] profile sync failed:", dbErr);
        }
        return user;
      },

      // Users may edit their own display name. The e-mail and role are
      // deliberately immutable client-side — the database rules reject those
      // changes for anyone without the admin claim.
      updateProfile: async (patch) => {
        const id = get().currentUserId;
        const user = get().users.find((u) => u.id === id);
        if (!user) throw new Error("Not signed in.");
        const name = patch.name?.trim();
        if (name !== undefined && name.length === 0) throw new Error("Name cannot be empty.");
        const next = { ...user, ...(name ? { name } : {}) };
        set({ users: get().users.map((u) => (u.id === user.id ? next : u)) });
        get().log("PROFILE_UPDATED", next.name, next.id);

        if (get().firebaseUid) {
          await syncOwnProfile({
            campusId: next.id,
            fullName: next.name,
            email: next.email,
            role: next.role,
            firebaseUid: get().firebaseUid as string,
          });
        }
      },

      logout: () => {
        const id = get().currentUserId;
        get().log("LOGOUT", undefined, id);
        set({ currentUserId: null, apiKey: null, firebaseUid: null, firebaseError: null });
        // Drop the Firebase session too, otherwise the next user would inherit it.
        void firebaseSignOut().catch((err) => console.error("[firebase] sign-out failed:", err));
      },

      resetPassword: async (userIdOrEmail, newPassword) => {
        const key = userIdOrEmail.trim();
        const exists = get().users.find(
          (u) => u.email.toLowerCase() === key.toLowerCase() || u.id === key.toUpperCase()
        );
        if (!exists) return false;
        const usercode =
          exists.usercode ?? (exists.password ? await api.getUserCode(exists.email, exists.password) : null);
        if (!usercode) return false;
        try {
          await api.updateUserPassword(usercode, newPassword);
        } catch {
          return false;
        }
        set({
          users: get().users.map((u) =>
            u.id === exists.id ? { ...u, password: newPassword } : u
          ),
        });
        get().log("PASSWORD_RESET", exists.email, exists.id);
        return true;
      },

      addVendor: (v) => set({ vendors: [...get().vendors, { ...v, id: `local-${uid()}` }] }),
      updateVendor: (id, patch) =>
        set({ vendors: get().vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)) }),

      addMenuItem: (m) =>
        set({ menu: [...get().menu, { available: true, stock: 0, ...m, id: `local-${uid()}` }] }),
      updateMenuItem: (id, patch) =>
        set({ menu: get().menu.map((m) => (m.id === id ? { ...m, ...patch } : m)) }),
      removeMenuItem: (id) => set({ menu: get().menu.filter((m) => m.id !== id) }),

      placeOrder: async (userId, lines) => {
        const { menu, users, apiKey } = get();
        const user = users.find((u) => u.id === userId);
        const pricing = priceOrder(lines, menu, user?.role ?? "Standard");

        // Send one API master order per restaurant (vendor).
        const byVendor = new Map<string, { itemName: string; quantity: number }[]>();
        for (const l of lines) {
          const item = menu.find((m) => m.id === l.itemId);
          if (!item) continue;
          const list = byVendor.get(item.vendorId) ?? [];
          list.push({ itemName: item.name, quantity: l.quantity });
          byVendor.set(item.vendorId, list);
        }
        const masterIds: number[] = [];
        if (apiKey) {
          for (const [vendorId, items] of byVendor) {
            if (vendorId.startsWith("local-")) continue;
            try {
              const res = await api.makeOrder(vendorId, apiKey, items);
              const masterId = res.fullorder?.[0]?.masterID;
              if (typeof masterId === "number") masterIds.push(masterId);
            } catch (e) {
              get().log("ORDER_API_FAILED", e instanceof Error ? e.message : "unknown", userId);
            }
          }
        }

        const order: Order = {
          id: genOrderId(),
          userId,
          lines,
          status: "Pending",
          createdAt: new Date().toISOString(),
          masterIds,
          ...pricing,
        };
        const nextMenu = menu.map((m) => {
          const line = lines.find((l) => l.itemId === m.id);
          if (!line || m.stock === undefined) return m;
          return { ...m, stock: Math.max(0, m.stock - line.quantity) };
        });
        set({ orders: [...get().orders, order], menu: nextMenu });
        get().log("ORDER_PLACED", `${order.id}${masterIds.length ? ` (API #${masterIds.join(",")})` : ""}`, userId);
      },

      // Pull the signed-in user's master orders back from the API and add any
      // that this device does not have a local record for.
      syncOrders: async () => {
        const { apiKey, currentUserId, orders, menu } = get();
        if (!apiKey || !currentUserId) return;
        try {
          const masters = await api.getOrders(apiKey);
          const known = new Set(orders.flatMap((o) => o.masterIds ?? []));
          const missing = masters.filter((m) => !known.has(m.masterID));
          if (missing.length === 0) return;
          const imported: Order[] = [];
          for (const m of missing) {
            const detail = await api.getOrderByMasterId(m.masterID, apiKey);
            const lines = detail.map((d) => ({
              itemId:
                menu.find((mi) => mi.name === d.itemName && mi.vendorId === String(m.restaurantID))?.id ??
                d.itemName,
              quantity: d.quantity,
            }));
            const subtotal = detail.reduce((s, d) => s + d.totalPrice, 0);
            const taxed = subtotal * 1.2;
            const rounded = Math.ceil(taxed / 5) * 5;
            imported.push({
              id: genOrderId(),
              userId: currentUserId,
              lines,
              status: "Pending",
              createdAt: new Date().toISOString(),
              masterIds: [m.masterID],
              subtotal: +subtotal.toFixed(2),
              tax: +(taxed - subtotal).toFixed(2),
              discount: 0,
              total: +rounded.toFixed(2),
            });
          }
          set({ orders: [...get().orders, ...imported] });
        } catch {
          /* offline / API unavailable — local orders still work */
        }
      },

      updateOrderStatus: (id, status) => {
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) });
        get().log("ORDER_STATUS", `${id} -> ${status}`, get().currentUserId);
      },

      addFeedback: (f) =>
        set({
          feedback: [
            ...get().feedback,
            { ...f, id: uid(), createdAt: new Date().toISOString() },
          ],
        }),
      log: (action, detail, userId) =>
        set({
          logs: [
            ...get().logs,
            {
              id: uid(),
              userId: userId === undefined ? get().currentUserId : userId,
              action,
              detail,
              createdAt: new Date().toISOString(),
            },
          ],
        }),
    }),
    {
      name: "campus-eats-store",
      version: 6,
      // Never persist users (passwords), the active session id, or the API key.
      partialize: (state) =>
        ({
          vendors: state.vendors,
          menu: state.menu,
          orders: state.orders,
          feedback: state.feedback,
          logs: state.logs,
          catalogLoaded: state.catalogLoaded,
        }) as unknown as State,
    }
  )
);
