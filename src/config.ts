import { Platform } from "react-native";

/**
 * Base URL of the AutoParts Hub website/API.
 *
 * ⚠️ IMPORTANT — set this to YOUR computer's local network IP so a real
 * phone (Expo Go) can reach the API. `localhost` only works in a simulator.
 *
 * 1. Start the website:   cd ../autoparts-hub && npm run dev   (runs on :3000)
 * 2. Find your computer's IP:
 *      macOS / Linux:  ipconfig getifaddr en0   (or `ifconfig`)
 *      Windows:        ipconfig  → IPv4 Address
 * 3. Put it below, e.g.  http://192.168.1.5:3000
 *
 * Phone and computer must be on the SAME Wi-Fi.
 */
const LAN_IP = "172.64.0.215"; // 👈 change to your computer's IP (only needed for a real phone)

export const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:3000" // running in the browser on the same laptop → localhost just works
    : `http://${LAN_IP}:3000`; // real phone via Expo Go → must be your computer's LAN IP

/** Turns a relative image path ("/products/x.svg") into a full URL. */
export function imageUrl(path: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}
