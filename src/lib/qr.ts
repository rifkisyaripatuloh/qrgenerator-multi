import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { DisplayLink, LinkDraft, Platform, QRPayload } from "../types";

const hosts: Record<Platform, string[]> = {
  whatsapp: ["wa.me", "api.whatsapp.com", "www.whatsapp.com"], instagram: ["instagram.com", "www.instagram.com", "m.instagram.com"],
  tiktok: ["tiktok.com", "www.tiktok.com", "vm.tiktok.com"], website: [], custom: []
};
const validPlatforms = new Set<Platform>(["whatsapp", "instagram", "website", "tiktok", "custom"]);
export const platformLabel = (platform: Platform) => ({ whatsapp: "WhatsApp", instagram: "Instagram", website: "Website", tiktok: "TikTok", custom: "Custom" }[platform]);
export function validateUrl(value: string, platform: Platform): string | null {
  if (!value.trim()) return "URL wajib diisi.";
  if (value.length > 300) return "URL maksimal 300 karakter.";
  let parsed: URL;
  try { parsed = new URL(value.trim()); } catch { return "Masukkan URL yang valid."; }
  if (parsed.protocol !== "https:") return "URL harus memakai HTTPS.";
  if (parsed.username || parsed.password) return "URL tidak boleh memiliki username/password.";
  if (parsed.port) return "Port khusus tidak diperbolehkan.";
  const host = parsed.hostname.toLowerCase();
  if (hosts[platform].length && !hosts[platform].includes(host)) return `Hostname bukan domain ${platformLabel(platform)} yang diizinkan.`;
  return null;
}
export function validateDraft(draft: LinkDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!draft.label.trim()) errors.label = "Nama tombol wajib diisi."; else if (draft.label.trim().length > 40) errors.label = "Maksimal 40 karakter.";
  const urlError = validateUrl(draft.url, draft.platform); if (urlError) errors.url = urlError;
  return errors;
}
export function buildPayload(title: string, auto: boolean, drafts: LinkDraft[]): QRPayload { return { v: 1, t: title.trim(), a: auto, l: drafts.map(d => [d.platform, d.label.trim(), d.url.trim()]) }; }
export function encodePayload(payload: QRPayload): string { return compressToEncodedURIComponent(JSON.stringify(payload)); }
export function makeQrUrl(encoded: string): string { const url = new URL(import.meta.env.BASE_URL, window.location.origin); url.searchParams.set("d", encoded); return url.toString(); }
function isPayload(value: unknown): value is QRPayload {
  if (!value || typeof value !== "object") return false; const p = value as QRPayload;
  return p.v === 1 && typeof p.t === "string" && p.t.length >= 1 && p.t.length <= 60 && typeof p.a === "boolean" && Array.isArray(p.l) && p.l.length >= 1 && p.l.length <= 10 && p.l.every((x) => Array.isArray(x) && x.length === 3 && validPlatforms.has(x[0]) && typeof x[1] === "string" && x[1].length >= 1 && x[1].length <= 40 && typeof x[2] === "string" && !validateUrl(x[2], x[0]));
}
export function decodePayload(encoded: string): QRPayload | null { try { const raw = decompressFromEncodedURIComponent(encoded); if (!raw || raw.length > 12000) return null; const value: unknown = JSON.parse(raw); return isPayload(value) ? value : null; } catch { return null; } }
export function toDisplayLinks(payload: QRPayload): DisplayLink[] { return payload.l.map(([platform, label, url]) => ({ platform, label, url })); }
