import { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Forces the app canvas behind iOS/Android notch regions
  themeColor: "#FDFBF7", // Sets browser address bar matching our Cream base
};
