import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem, Order, OrderStatus, Role, User, Vendor } from "@/types/campus";

const uid = () => Math.random().toString(36).slice(2, 9);

interface State {
  users: User[];
  vendors: Vendor[];
  menu: MenuItem[];
  orders: Order[];
  currentUserId: string | null;

  registerUser: (u: Omit<User, "id">) => User;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => boolean;

  addVendor: (v: Omit<Vendor, "id">) => void;
  updateVendor: (id: string, patch: Partial<Omit<Vendor, "id">>) => void;

  addMenuItem: (m: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, patch: Partial<Omit<MenuItem, "id">>) => void;
  removeMenuItem: (id: string) => void;

  placeOrder: (userId: string, lines: { itemId: string; quantity: number }[]) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useCampus = create<State>()(
  persist(
    (set, get) => ({
      // NOTE: Seed users exist in-memory only and are NOT persisted. The
      // partialize config below strips the users array (and therefore all
      // passwords) from localStorage so plaintext credentials are never
      // written to disk. Accounts registered at runtime are session-scoped.
      users: [
        { id: "u-stud", name: "Sam Student", email: "student@campus.edu", password: "student", role: "Student" as Role },
        { id: "u-vend", name: "Pizza Owner", email: "vendor@campus.edu", password: "vendor", role: "Vendor" as Role, vendorId: "v-1" },
      ],
      vendors: [
        { id: "v-1", name: "Pizza Corner", location: "Block A", contact: "555-0101" },
        { id: "v-2", name: "Sushi Express", location: "Block B", contact: "555-0202" },
      ],
      menu: [
        { id: "m-1", name: "Margherita Pizza", price: 8.5, vendorId: "v-1" },
        { id: "m-2", name: "Pepperoni Slice", price: 3.5, vendorId: "v-1" },
        { id: "m-3", name: "Salmon Roll", price: 12, vendorId: "v-2" },
      ],
      orders: [],
      currentUserId: null,

      registerUser: (u) => {
        const user: User = { ...u, id: uid() };
        set({ users: [...get().users, user] });
        return user;
      },
      login: (email, password) => {
        const user = get().users.find((u) => u.email === email && u.password === password);
        if (user) set({ currentUserId: user.id });
        return user ?? null;
      },
      logout: () => set({ currentUserId: null }),
      resetPassword: (email, newPassword) => {
        const exists = get().users.find((u) => u.email === email);
        if (!exists) return false;
        set({ users: get().users.map((u) => (u.email === email ? { ...u, password: newPassword } : u)) });
        return true;
      },

      addVendor: (v) => set({ vendors: [...get().vendors, { ...v, id: uid() }] }),
      updateVendor: (id, patch) =>
        set({ vendors: get().vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)) }),

      addMenuItem: (m) => set({ menu: [...get().menu, { ...m, id: uid() }] }),
      updateMenuItem: (id, patch) =>
        set({ menu: get().menu.map((m) => (m.id === id ? { ...m, ...patch } : m)) }),
      removeMenuItem: (id) => set({ menu: get().menu.filter((m) => m.id !== id) }),

      placeOrder: (userId, lines) =>
        set({
          orders: [
            ...get().orders,
            { id: uid(), userId, lines, status: "Pending", createdAt: new Date().toISOString() },
          ],
        }),
      updateOrderStatus: (id, status) =>
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) }),
    }),
    {
      name: "campus-eats-store",
      // Never persist users (passwords) or the active session id to storage.
      partialize: (state) => ({
        vendors: state.vendors,
        menu: state.menu,
        orders: state.orders,
      }) as unknown as State,
    }
  )
);