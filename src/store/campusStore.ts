import { create } from "zustand";
import { persist } from "zustand/middleware";
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

interface State {
  users: User[];
  vendors: Vendor[];
  menu: MenuItem[];
  orders: Order[];
  feedback: Feedback[];
  logs: SecurityLog[];
  currentUserId: string | null;

  registerUser: (u: Omit<User, "id">) => User;
  login: (identifier: string, password: string) => User | null;
  logout: () => void;
  resetPassword: (userIdOrEmail: string, newPassword: string) => boolean;

  addVendor: (v: Omit<Vendor, "id">) => void;
  updateVendor: (id: string, patch: Partial<Omit<Vendor, "id">>) => void;

  addMenuItem: (m: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, patch: Partial<Omit<MenuItem, "id">>) => void;
  removeMenuItem: (id: string) => void;

  placeOrder: (userId: string, lines: { itemId: string; quantity: number }[]) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  addFeedback: (f: Omit<Feedback, "id" | "createdAt">) => void;
  log: (action: string, detail?: string, userId?: string | null) => void;
}

export const useCampus = create<State>()(
  persist(
    (set, get) => ({
      // 8 demo accounts (process document section 12). Seed users are
      // in-memory only — partialize strips them from localStorage so no
      // plaintext credentials are written to disk.
      users: [
        { id: "STUDENT000000001", name: "Student_01", email: "student01@campus.edu", password: "student", role: "Student" },
        { id: "STUDENT000000002", name: "Student_02", email: "student02@campus.edu", password: "student", role: "Student" },
        { id: "STANDARD00000001", name: "Standard_01", email: "standard01@campus.edu", password: "standard", role: "Standard" },
        { id: "STANDARD00000002", name: "Standard_02", email: "standard02@campus.edu", password: "standard", role: "Standard" },
        { id: "VENDOR0000000001", name: "Vendor_01", email: "vendor01@campus.edu", password: "vendor", role: "Vendor", vendorId: "v-1" },
        { id: "VENDOR0000000002", name: "Vendor_02", email: "vendor02@campus.edu", password: "vendor", role: "Vendor", vendorId: "v-2" },
        { id: "ADMIN00000000001", name: "Admin_01", email: "admin01@campus.edu", password: "admin", role: "Admin" },
        { id: "ADMIN00000000002", name: "Admin_02", email: "admin02@campus.edu", password: "admin", role: "Admin" },
      ],
      vendors: [
        { id: "v-1", name: "Pizza Corner", location: "Block A", contact: "555-0101" },
        { id: "v-2", name: "Sushi Express", location: "Block B", contact: "555-0202" },
      ],
      menu: [
        { id: "m-1", name: "Margherita Pizza", price: 65, vendorId: "v-1", available: true, stock: 20 },
        { id: "m-2", name: "Pepperoni Slice", price: 25, vendorId: "v-1", available: true, stock: 40 },
        { id: "m-3", name: "Salmon Roll", price: 95, vendorId: "v-2", available: true, stock: 15 },
      ],
      orders: [],
      feedback: [],
      logs: [],
      currentUserId: null,

      registerUser: (u) => {
        const user: User = { ...u, id: genUserId() };
        set({ users: [...get().users, user] });
        get().log("USER_REGISTERED", `${user.role}:${user.email}`, user.id);
        return user;
      },
      login: (identifier, password) => {
        const key = identifier.trim();
        const user = get().users.find(
          (u) => (u.email === key || u.id === key.toUpperCase()) && u.password === password
        );
        if (user) {
          set({ currentUserId: user.id });
          get().log("LOGIN_SUCCESS", user.email, user.id);
        } else {
          get().log("LOGIN_FAILED", key, null);
        }
        return user ?? null;
      },
      logout: () => {
        const id = get().currentUserId;
        get().log("LOGOUT", undefined, id);
        set({ currentUserId: null });
      },
      resetPassword: (userIdOrEmail, newPassword) => {
        const key = userIdOrEmail.trim();
        const exists = get().users.find((u) => u.email === key || u.id === key.toUpperCase());
        if (!exists) return false;
        set({
          users: get().users.map((u) =>
            u.id === exists.id ? { ...u, password: newPassword } : u
          ),
        });
        get().log("PASSWORD_RESET", exists.email, exists.id);
        return true;
      },

      addVendor: (v) => set({ vendors: [...get().vendors, { ...v, id: uid() }] }),
      updateVendor: (id, patch) =>
        set({ vendors: get().vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)) }),

      addMenuItem: (m) =>
        set({ menu: [...get().menu, { available: true, stock: 0, ...m, id: uid() }] }),
      updateMenuItem: (id, patch) =>
        set({ menu: get().menu.map((m) => (m.id === id ? { ...m, ...patch } : m)) }),
      removeMenuItem: (id) => set({ menu: get().menu.filter((m) => m.id !== id) }),

      placeOrder: (userId, lines) => {
        const { menu, users } = get();
        const user = users.find((u) => u.id === userId);
        const pricing = priceOrder(lines, menu, user?.role ?? "Standard");
        const order: Order = {
          id: genOrderId(),
          userId,
          lines,
          status: "Pending",
          createdAt: new Date().toISOString(),
          ...pricing,
        };
        // Decrement local inventory.
        const nextMenu = menu.map((m) => {
          const line = lines.find((l) => l.itemId === m.id);
          if (!line || m.stock === undefined) return m;
          return { ...m, stock: Math.max(0, m.stock - line.quantity) };
        });
        set({ orders: [...get().orders, order], menu: nextMenu });
        get().log("ORDER_PLACED", order.id, userId);
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
      version: 5,
      // Never persist users (passwords) or the active session id.
      partialize: (state) =>
        ({
          vendors: state.vendors,
          menu: state.menu,
          orders: [
            ...state.orders.map((o) => ({ ...o })),
          ],
          feedback: state.feedback,
          logs: state.logs,
        }) as unknown as State,
    }
  )
);