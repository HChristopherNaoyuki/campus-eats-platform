/**
 * Fake Restaurant API client.
 * Upstream: https://fakerestaurantapi.runasp.net
 * The upstream sends no CORS headers, so every call is routed through the
 * `restaurant-api` backend function which proxies the request verbatim.
 * Auth: "usercode" (UUID) passed as the `apikey` query parameter.
 */
const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/restaurant-api`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const API_BASE = FUNCTIONS_URL;

export interface ApiRestaurant {
  restaurantID: number;
  restaurantName: string;
  address: string;
  type: string;
  parkingLot: boolean;
}

export interface ApiMenuItem {
  itemID: number;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  restaurantName: string;
  restaurantID: number;
  imageUrl: string;
}

export interface ApiUser {
  userEmail: string;
  password: string;
  usercode: string;
}

export interface ApiMasterOrder {
  masterID: number;
  userID: string;
  usercode: string;
  restaurantID: number;
  grandtotal: number;
}

export interface ApiOrderLine {
  orderID: number;
  userID: string;
  itemName: string;
  quantity: number;
  itemPrice: number;
  totalPrice: number;
  masterID: number;
}

async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  return (text ? JSON.parse(text) : null) as T;
}

/* ---------------- Restaurants ---------------- */

export const getRestaurants = (filters?: { category?: string; address?: string; name?: string }) => {
  const qs = new URLSearchParams();
  if (filters?.category) qs.set("category", filters.category);
  if (filters?.address) qs.set("address", filters.address);
  if (filters?.name) qs.set("name", filters.name);
  const q = qs.toString();
  return request<ApiRestaurant[]>(`/api/Restaurant${q ? `?${q}` : ""}`);
};

export const getRestaurantById = (id: number | string) =>
  request<ApiRestaurant[]>(`/api/Restaurant/${id}`);

export const getRestaurantMenu = (id: number | string, sortByPrice?: "asc" | "desc") =>
  request<ApiMenuItem[]>(
    `/api/Restaurant/${id}/menu${sortByPrice ? `?sortbyprice=${sortByPrice}` : ""}`
  );

export const getAllItems = () => request<ApiMenuItem[]>(`/api/Restaurant/items`);

/* ---------------- Users ---------------- */

export const getUsers = () => request<ApiUser[]>(`/api/User`);

export const registerUser = (userEmail: string, password: string) =>
  request<ApiUser>(`/api/User/register`, "POST", { userEmail, password });

export async function getUserCode(userEmail: string, password: string): Promise<string | null> {
  const qs = new URLSearchParams({ UserEmail: userEmail, Password: password });
  try {
    const data = await request<{ usercode?: string }>(`/api/User/getusercode?${qs}`);
    return data?.usercode ?? null;
  } catch {
    return null;
  }
}

export const updateUserPassword = (apikey: string, newPassword: string) =>
  request<ApiUser>(`/api/User/${apikey}`, "PUT", newPassword);

export const deleteUser = (apikey: string) =>
  request<{ message: string }>(`/api/User/${apikey}`, "DELETE");

/* ---------------- Orders ---------------- */

export const getOrders = (apikey: string) =>
  request<ApiMasterOrder[]>(`/api/Order?apikey=${encodeURIComponent(apikey)}`);

export const getOrderByMasterId = (masterId: number, apikey: string) =>
  request<ApiOrderLine[]>(`/api/Order/${masterId}?apikey=${encodeURIComponent(apikey)}`);

export const makeOrder = (
  restaurantId: number | string,
  apikey: string,
  items: { itemName: string; quantity: number }[]
) =>
  request<{ fullorder: ApiOrderLine[]; grandTotal: number }>(
    `/api/Order/${restaurantId}/makeorder?apikey=${encodeURIComponent(apikey)}`,
    "POST",
    { menuDTO: items }
  );

export const deleteMasterOrder = (masterId: number, apikey: string) =>
  request<{ message: string }>(
    `/api/Order/master/${masterId}?apikey=${encodeURIComponent(apikey)}`,
    "DELETE"
  );

export const deleteSingleOrder = (orderId: number, apikey: string) =>
  request<{ message: string }>(
    `/api/Order/${orderId}?apikey=${encodeURIComponent(apikey)}`,
    "DELETE"
  );
