import type { Metadata } from "next";
import NavLinks from "./ui/navegacion/NavLinks";
import Image from "next/image";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LetsMove",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>

      <body className={`${inter.className} bg-gray-100 text-gray-800`}>
        
        <header className="flex items-center justify-between p-5 bg-white shadow-md">
          <Image src="/images/logo-white-transp.png" alt="logo" width={100} height={100} className="w-auto h-auto" />
          <NavLinks />
        </header>

        {children}

        <footer className="p-5 bg-gray-800 text-white">
          <div className="flex items-center justify-between">
            <Image src="/images/logo-white-transp.png" alt="LetsMove" width={100} height={100} className="w-auto h-auto" />
            <div className="flex space-x-4">
              <img src="/icons/facebook.svg" alt="Facebook" width={40} height={40} />
              <img src="/icons/instagram.svg" alt="Instagram" width={40} height={40} />
              <img src="/icons/twitter.svg" alt="twitter" width={40} height={40} />
              <img src="/icons/tiktok.svg" alt="tiktok" width={40} height={40} />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
