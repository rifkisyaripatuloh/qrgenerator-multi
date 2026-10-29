import type { DisplayLink, Platform } from "../types";
export function detectScannerApp(ua: string): "whatsapp" | "instagram" | null { if (/instagram/i.test(ua)) return "instagram"; if (/whatsapp/i.test(ua)) return "whatsapp"; return null; }
export function getAutoTarget(links: DisplayLink[], detected: Platform | null, enabled: boolean): string | null { if (!enabled || !detected) return null; const matches = links.filter(link => link.platform === detected); return matches.length === 1 ? matches[0].url : null; }
