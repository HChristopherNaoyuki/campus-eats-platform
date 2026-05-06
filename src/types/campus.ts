export type Role = "Student" | "Vendor" | "Admin";
export type OrderStatus = "Pending" | "Preparing" | "Completed";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
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
}