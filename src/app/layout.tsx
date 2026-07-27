import type { Metadata } from "next";
import "./globals.css";
import Logo from "../components/Logo";

export const metadata: Metadata = {
  title: "Քննություն",
  description: "Առցանց տեսական քննություն",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-800">
        <div className="container mx-auto text-slate-300 w-full p-4 bg-neutral-800">
          <div className="md:pt-8">
            <Logo />
          </div>
          <div className="mx-auto max-w-2xl md:py-32 ">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
