export type Platform = "whatsapp" | "instagram" | "website" | "tiktok" | "custom";
export type LinkDraft = { id: string; platform: Platform; label: string; url: string };
export type QRPayload = { v: 1; t: string; a: boolean; l: Array<[Platform, string, string]> };
export type DisplayLink = { platform: Platform; label: string; url: string };
export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" }, { value: "instagram", label: "Instagram" },
  { value: "website", label: "Website" }, { value: "tiktok", label: "TikTok" }, { value: "custom", label: "Custom" }
];
