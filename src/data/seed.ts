/**
 * Seed data set for Campus Eats.
 *
 * Every collection below carries at least ten records so the application has
 * realistic content on a first run (users, vendors, menu, orders, feedback and
 * the security log). Seed identifiers are namespaced with `seed-` so that a
 * live catalogue sync from the Fake Restaurant API never removes them.
 *
 * Passwords listed here are demonstration credentials only. They live in
 * memory, are never persisted to localStorage, and are handed to Firebase
 * Authentication (which stores them salted and hashed) — never written to the
 * Realtime Database.
 */
import type { Feedback, MenuItem, Order, SecurityLog, User, Vendor } from "@/types/campus";

/** Normalises a supplied unique ID to the 16-character campus format. */
const toCampusId = (raw: string): string =>
  raw.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 16).padEnd(16, "0");

export interface SeedUser extends Omit<User, "usercode">
{
  username: string;
  shopName?: string;
  shopInfo?: string;
}

export const SEED_USERS: SeedUser[] = [
  {
    id: toCampusId("ADMN4K7P2Q9XRT5M"),
    name: "Amara Nkosi",
    username: "amara.nkosi",
    email: "amara.nkosi@campuseats.test",
    password: "Adm1n#Amara",
    role: "Admin",
  },
  {
    id: toCampusId("ADMN8B3W6Y1ZPL4N"),
    name: "Pieter van Wyk",
    username: "pieter.vanwyk",
    email: "pieter.vanwyk@campuseats.test",
    password: "Adm1n#Pieter",
    role: "Admin",
  },
  {
    id: toCampusId("VNDR2T5H8J3KQ7L"),
    name: "Thandiwe Mokoena",
    username: "thandiwe.mokoena",
    email: "thandiwe.mokoena@campuseats.test",
    password: "Vend0r#Thandi",
    role: "Vendor",
    vendorId: "seed-v1",
    shopName: "Campus Corner Kitchen",
    shopInfo:
      "Traditional South African meals prepared fresh daily. Pap, chakalaka and grilled chicken are the house specialities.",
  },
  {
    id: toCampusId("VNDR9F4G7N2MXP5Q"),
    name: "Sipho Dlamini",
    username: "sipho.dlamini",
    email: "sipho.dlamini@campuseats.test",
    password: "Vend0r#Sipho",
    role: "Vendor",
    vendorId: "seed-v2",
    shopName: "Braai Brothers",
    shopInfo:
      "Flame-grilled meat, boerewors rolls and vegetarian skewers. Open from breakfast until late afternoon.",
  },
  {
    id: toCampusId("VNDR6C1V9B4LZR8T"),
    name: "Annelie Botha",
    username: "annelie.botha",
    email: "annelie.botha@campuseats.test",
    password: "Vend0r#Annelie",
    role: "Vendor",
    vendorId: "seed-v3",
    shopName: "Coffee and Koeksisters",
    shopInfo:
      "Speciality coffee, freshly baked koeksisters and light breakfast options for early lectures.",
  },
  {
    id: toCampusId("STDN3J7R5H2KXQ9M"),
    name: "Lerato Khumalo",
    username: "lerato.khumalo",
    email: "lerato.khumalo@campuseats.test",
    password: "Stand@rd#Lerato",
    role: "Standard",
  },
  {
    id: toCampusId("STDN7P4W1Y6NBLZ2"),
    name: "Johan Pretorius",
    username: "johan.pretorius",
    email: "johan.pretorius@campuseats.test",
    password: "Stand@rd#Johan",
    role: "Standard",
  },
  {
    id: toCampusId("STDN5T8M3K2LZXR6Q"),
    name: "Zanele Ndlovu",
    username: "zanele.ndlovu",
    email: "zanele.ndlovu@campuseats.test",
    password: "Stand@rd#Zanele",
    role: "Standard",
  },
  {
    id: toCampusId("STDN9R2B7V4MQP1X"),
    name: "Marius Steyn",
    username: "marius.steyn",
    email: "marius.steyn@campuseats.test",
    password: "Stand@rd#Marius",
    role: "Standard",
  },
  {
    id: toCampusId("STDT4K9X2P7MNZR5B"),
    name: "Naledi Mahlangu",
    username: "naledi.mahlangu",
    email: "naledi.mahlangu@campuseats.test",
    password: "Stud3nt#Naledi",
    role: "Student",
  },
];

export const SEED_VENDORS: Vendor[] = [
  { id: "seed-v1", name: "Campus Corner Kitchen", location: "Student Centre, Ground Floor", contact: "011 555 0101" },
  { id: "seed-v2", name: "Braai Brothers", location: "East Lawn Courtyard", contact: "011 555 0102" },
  { id: "seed-v3", name: "Coffee and Koeksisters", location: "Library Foyer", contact: "011 555 0103" },
  { id: "seed-v4", name: "Bunny Chow Bar", location: "Engineering Block B", contact: "011 555 0104" },
  { id: "seed-v5", name: "Green Leaf Salads", location: "Health Sciences Atrium", contact: "011 555 0105" },
  { id: "seed-v6", name: "Pap and Vleis", location: "Residence Quad", contact: "011 555 0106" },
  { id: "seed-v7", name: "Gatsby Garage", location: "Sports Complex", contact: "011 555 0107" },
  { id: "seed-v8", name: "Samoosa Station", location: "Commerce Building", contact: "011 555 0108" },
  { id: "seed-v9", name: "Milk Tart Cafe", location: "Arts Faculty Walkway", contact: "011 555 0109" },
  { id: "seed-v10", name: "Vetkoek Village", location: "North Gate Plaza", contact: "011 555 0110" },
];

const item = (
  id: string,
  vendorId: string,
  name: string,
  price: number,
  description: string,
  stock: number
): MenuItem => ({ id, vendorId, name, price, description, stock, available: true });

export const SEED_MENU: MenuItem[] = [
  item("seed-i1", "seed-v1", "Pap and Chakalaka", 48, "Maize pap with spicy vegetable relish.", 40),
  item("seed-i2", "seed-v1", "Grilled Chicken Quarter", 72, "Flame-grilled chicken with a side salad.", 30),
  item("seed-i3", "seed-v1", "Morogo and Rice", 45, "Wild spinach stew served with steamed rice.", 25),
  item("seed-i4", "seed-v2", "Boerewors Roll", 55, "Farm-style sausage on a fresh roll with onion relish.", 50),
  item("seed-i5", "seed-v2", "Vegetarian Skewers", 60, "Char-grilled peppers, mushroom and halloumi.", 20),
  item("seed-i6", "seed-v2", "Lamb Sosatie", 95, "Marinated lamb skewers with apricot glaze.", 18),
  item("seed-i7", "seed-v3", "Flat White", 32, "Double shot with silky steamed milk.", 60),
  item("seed-i8", "seed-v3", "Koeksister", 18, "Plaited syrup pastry, baked each morning.", 80),
  item("seed-i9", "seed-v3", "Rusk and Coffee Combo", 40, "Buttermilk rusk with a filter coffee.", 45),
  item("seed-i10", "seed-v4", "Quarter Bunny Chow", 65, "Durban curry served in a hollowed loaf.", 22),
  item("seed-i11", "seed-v5", "Harvest Salad Bowl", 58, "Seasonal greens, feta, seeds and citrus dressing.", 26),
  item("seed-i12", "seed-v6", "Pap and Steak", 89, "Grilled rump with pap and gravy.", 15),
  item("seed-i13", "seed-v7", "Full House Gatsby", 110, "Shared roll with chips, steak and masala.", 12),
  item("seed-i14", "seed-v8", "Beef Samoosa (4)", 36, "Hand-folded pastry with spiced beef.", 70),
  item("seed-i15", "seed-v9", "Milk Tart Slice", 28, "Cinnamon-dusted classic melktert.", 35),
  item("seed-i16", "seed-v10", "Vetkoek with Mince", 52, "Fried dough filled with savoury mince.", 40),
];

const day = (offset: number, hour: number): string =>
{
  const d = new Date();
  d.setDate(d.getDate() - offset);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

const U = (i: number): string => SEED_USERS[i].id;

const seedOrder = (
  n: number,
  userIndex: number,
  lines: { itemId: string; quantity: number }[],
  status: Order["status"],
  offset: number,
  hour: number
): Order =>
{
  const subtotal = lines.reduce((sum, l) =>
  {
    const found = SEED_MENU.find((m) => m.id === l.itemId);
    return sum + (found ? found.price * l.quantity : 0);
  }, 0);
  const taxed = subtotal * 1.2;
  const rounded = Math.ceil(taxed / 5) * 5;
  const discount = SEED_USERS[userIndex].role === "Student" ? rounded * 0.025 : 0;
  const stamp = day(offset, hour);

  return {
    id: `ORD-${stamp.slice(0, 10).replace(/-/g, "")}-SEED${String(n).padStart(4, "0")}`,
    userId: U(userIndex),
    lines,
    status,
    createdAt: stamp,
    subtotal: +subtotal.toFixed(2),
    tax: +(taxed - subtotal).toFixed(2),
    discount: +discount.toFixed(2),
    total: +(rounded - discount).toFixed(2),
  };
};

export const SEED_ORDERS: Order[] = [
  seedOrder(1, 9, [{ itemId: "seed-i1", quantity: 1 }, { itemId: "seed-i7", quantity: 1 }], "Completed", 9, 12),
  seedOrder(2, 5, [{ itemId: "seed-i4", quantity: 2 }], "Completed", 8, 13),
  seedOrder(3, 6, [{ itemId: "seed-i10", quantity: 1 }], "Completed", 7, 12),
  seedOrder(4, 7, [{ itemId: "seed-i11", quantity: 1 }, { itemId: "seed-i15", quantity: 2 }], "Completed", 6, 11),
  seedOrder(5, 8, [{ itemId: "seed-i13", quantity: 1 }], "Rejected", 5, 14),
  seedOrder(6, 9, [{ itemId: "seed-i8", quantity: 3 }], "Completed", 4, 8),
  seedOrder(7, 5, [{ itemId: "seed-i12", quantity: 1 }, { itemId: "seed-i16", quantity: 1 }], "Ready", 3, 13),
  seedOrder(8, 6, [{ itemId: "seed-i6", quantity: 2 }], "Preparing", 2, 12),
  seedOrder(9, 7, [{ itemId: "seed-i14", quantity: 2 }, { itemId: "seed-i9", quantity: 1 }], "Accepted", 1, 10),
  seedOrder(10, 8, [{ itemId: "seed-i2", quantity: 1 }], "Pending", 0, 9),
  seedOrder(11, 9, [{ itemId: "seed-i5", quantity: 1 }, { itemId: "seed-i7", quantity: 2 }], "Pending", 0, 11),
  seedOrder(12, 5, [{ itemId: "seed-i3", quantity: 1 }], "Completed", 10, 12),
];

const fb = (
  n: number,
  userIndex: number,
  type: Feedback["type"],
  subject: string,
  message: string,
  offset: number
): Feedback => ({
  id: `seed-f${n}`,
  userId: U(userIndex),
  type,
  subject,
  message,
  createdAt: day(offset, 16),
});

export const SEED_FEEDBACK: Feedback[] = [
  fb(1, 9, "Compliment", "Fast pickup", "My order was ready before I reached the counter.", 9),
  fb(2, 5, "Compliment", "Great boerewors", "Braai Brothers make the best roll on campus.", 8),
  fb(3, 6, "Complaint", "Long queue", "The lunchtime queue at the library kiosk was very slow.", 7),
  fb(4, 7, "Compliment", "Fresh salads", "Green Leaf portions are generous and always fresh.", 6),
  fb(5, 8, "Complaint", "Missing item", "My gatsby order arrived without the extra chips.", 5),
  fb(6, 9, "Compliment", "Friendly staff", "The team at Coffee and Koeksisters is always welcoming.", 4),
  fb(7, 5, "Complaint", "Cold food", "Pap and Vleis order was lukewarm at pickup.", 3),
  fb(8, 6, "Compliment", "Good value", "Samoosa Station offers the best value for money.", 2),
  fb(9, 7, "Complaint", "App notification", "I was not notified when my order was ready.", 1),
  fb(10, 8, "Compliment", "Easy ordering", "Placing an order takes under a minute now.", 0),
];

export const SEED_LOGS: SecurityLog[] = [
  { id: "seed-l1", userId: U(0), action: "LOGIN_SUCCESS", detail: SEED_USERS[0].email, createdAt: day(9, 8) },
  { id: "seed-l2", userId: U(2), action: "MENU_ITEM_ADDED", detail: "Pap and Chakalaka", createdAt: day(9, 9) },
  { id: "seed-l3", userId: U(9), action: "ORDER_PLACED", detail: SEED_ORDERS[0].id, createdAt: day(9, 12) },
  { id: "seed-l4", userId: U(3), action: "ORDER_STATUS", detail: `${SEED_ORDERS[1].id} -> Completed`, createdAt: day(8, 13) },
  { id: "seed-l5", userId: null, action: "LOGIN_FAILED", detail: "unknown@campuseats.test", createdAt: day(7, 7) },
  { id: "seed-l6", userId: U(1), action: "USER_REGISTERED", detail: "Standard:marius.steyn@campuseats.test", createdAt: day(6, 10) },
  { id: "seed-l7", userId: U(4), action: "MENU_ITEM_UPDATED", detail: "Koeksister stock 80", createdAt: day(5, 9) },
  { id: "seed-l8", userId: U(6), action: "PASSWORD_RESET", detail: SEED_USERS[6].email, createdAt: day(4, 15) },
  { id: "seed-l9", userId: U(7), action: "FEEDBACK_SUBMITTED", detail: "Fresh salads", createdAt: day(3, 16) },
  { id: "seed-l10", userId: U(8), action: "LOGOUT", detail: undefined, createdAt: day(2, 17) },
  { id: "seed-l11", userId: U(9), action: "ORDER_PLACED", detail: SEED_ORDERS[10].id, createdAt: day(0, 11) },
  { id: "seed-l12", userId: U(0), action: "CATALOG_SYNCED", detail: "10 vendors / 16 items", createdAt: day(0, 7) },
];
