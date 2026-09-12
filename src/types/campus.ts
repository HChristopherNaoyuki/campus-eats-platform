export type Role = "Student" | "Standard" | "Vendor" | "Admin";
export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Preparing"
  | "Ready"
  | "Completed";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  vendorId?: string;
  /** Fake Restaurant API usercode / apikey (UUID). */
  usercode?: string;
  /** Firebase Authentication UID (separate from the 16-char campus id). */
  firebaseUid?: string;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  contact: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  vendorId: string;
  available?: boolean;
  stock?: number;
  description?: string;
  imageUrl?: string;
}

export interface OrderLine {
  itemId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  lines: OrderLine[];
  status: OrderStatus;
  createdAt: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  /** Master order IDs returned by the Fake Restaurant API. */
  masterIds?: number[];
}

export interface Feedback {
  id: string;
  userId: string;
  type: "Compliment" | "Complaint";
  message: string;
  createdAt: string;
}

export interface SecurityLog {
  id: string;
  userId: string | null;
  action: string;
  detail?: string;
  createdAt: string;
}