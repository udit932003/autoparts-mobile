# 📱 AutoParts Hub — Mobile App

A **React Native (Expo)** mobile app for the [AutoParts Hub](https://github.com/udit932003/autoparts-hub) car-parts store. Browse the catalog, search & filter by category, and view product details — all powered by the same backend & database as the website (via a REST API).

![Tech](https://img.shields.io/badge/React_Native-Expo_SDK_56-000020) ![Tech](https://img.shields.io/badge/React_Navigation-7-6b52ae) ![Tech](https://img.shields.io/badge/TypeScript-5-3178C6)

---

## ✨ Features
- **Home** — hero banner, shop-by-category, featured parts (pull-to-refresh)
- **Products** — live search + category filter chips, 2-column grid
- **Product detail** — large artwork, price, stock, description, related parts, sticky add-to-cart bar
- Loading / error / empty states throughout
- Talks to the website's **REST API** — same products, prices & images
- Renders the store's SVG product artwork natively (`react-native-svg`)

## 🧱 Tech stack
- **Expo** (React Native) + **TypeScript**
- **React Navigation** (native stack)
- **react-native-svg** for product images
- **react-native-safe-area-context** for notch-safe layouts

---

## 🚀 Run it

### 1. Start the backend (the website API)
The app needs the AutoParts Hub website running so it can fetch data:
```bash
cd ../autoparts-hub
npm install && npm run setup   # first time only
npm run dev                    # runs the API on http://localhost:3000
```

### 2. Point the app at your computer's IP
A real phone can't reach `localhost` — open **`src/config.ts`** and set `LAN_IP` to your computer's local IP:
```bash
# macOS / Linux
ipconfig getifaddr en0
# Windows: run `ipconfig` and copy the IPv4 Address
```
```ts
const LAN_IP = "192.168.1.5"; // 👈 your computer's IP here
```
> Phone and computer must be on the **same Wi-Fi**.
> (iOS Simulator / Android emulator can use `localhost` / `10.0.2.2` respectively.)

### 3. Start the app
```bash
npm install        # first time only
npm start
```
- Install **Expo Go** from the App Store / Play Store on your phone
- Scan the QR code shown in the terminal → the app opens on your phone 🎉

| Command | Runs on |
|---------|---------|
| `npm start` | Expo dev server (scan QR with Expo Go) |
| `npm run ios` | iOS Simulator (Mac) |
| `npm run android` | Android emulator |

---

## 📂 Structure
```
App.tsx                 # Navigation stack (Home → Products → Detail)
src/
├── config.ts           # API base URL (set your LAN IP here)
├── api.ts              # REST API calls
├── theme.ts            # colors + price formatting
├── types.ts            # Product / Category / nav types
├── components/
│   ├── SvgImage.tsx    # renders remote SVG artwork
│   └── ProductCard.tsx
└── screens/
    ├── HomeScreen.tsx
    ├── ProductsScreen.tsx
    └── ProductDetailScreen.tsx
```

## 🔌 API used (from autoparts-hub)
| Endpoint | Purpose |
|----------|---------|
| `GET /api/categories` | list categories |
| `GET /api/products?q=&category=&featured=` | list / search products |
| `GET /api/products/:slug` | product detail + related |

---

Companion to the AutoParts Hub website — built as a portfolio project. ⭐
