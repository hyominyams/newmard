import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "Newmard",
  description: "Curated cities for digital nomads",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

