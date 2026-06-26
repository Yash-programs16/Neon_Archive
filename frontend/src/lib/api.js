import axios from "axios";

// Points to your Go backend (main.go)
export const API_BASE =
  process.env.REACT_APP_GO_API_URL || "https://neon-archive-1.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

// === DVDs ===
export const getDVDs = () =>
  api.get("/dvds").then((r) => r.data);

export const getDVD = (id) =>
  api.get(`/dvd/${id}`).then((r) => r.data);

export const addDVD = (payload) =>
  api.post("/dvd", payload).then((r) => r.data);

export const updateDVD = (id, payload) =>
  api.put(`/dvd/${id}`, payload).then((r) => r.data);

export const deleteDVD = (id) =>
  api.delete(`/dvd/${id}`).then((r) => r.data);

// === Search ===
export const searchName = (name) =>
  api.get(`/search/name/${encodeURIComponent(name)}`).then((r) => r.data);

export const searchDirector = (d) =>
  api.get(`/search/director/${encodeURIComponent(d)}`).then((r) => r.data);

export const searchGenre = (g) =>
  api.get(`/search/genre/${encodeURIComponent(g)}`).then((r) => r.data);

// === Borrow / Return ===
export const borrowDVD = (payload) =>
  api.post("/borrow", payload).then((r) => r.data);

export const returnDVD = (id) =>
  api.put(`/return/${id}`).then((r) => r.data);

// === Reports ===
export const availableDVDs = () =>
  api.get("/available").then((r) => r.data);

export const borrowedDVDs = () =>
  api.get("/borrowed").then((r) => r.data);

export const generateFine = () =>
  api.put("/generatefine").then((r) => r.data);