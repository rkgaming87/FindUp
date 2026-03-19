import api from "./api";

export async function getFoundItems() {
  const res = await api.get("/found-items");
  return res.data;
}

export async function getAllItems(page = 1, limit = 12, search = "", category = "") {
  const res = await api.get(`/users/all-items?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
  return res.data;
}

export async function getFoundItemBySlug(slug: string) {
  const res = await api.get(`/found-items/${slug}`);
  return res.data;
}

export async function getLostItemBySlug(slug: string) {
  const res = await api.get(`/lost-items/${slug}`);
  return res.data;
}

export async function postLostItem(item: any) {
  const res = await api.post("/lost-items", item);
  return res.data;
}

export async function postFoundItem(item: any) {
  const res = await api.post("/found-items", item);
  return res.data;
}
