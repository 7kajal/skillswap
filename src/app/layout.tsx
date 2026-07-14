import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AuthProvider } from "../component/AuthProvider";
import { Header } from "../component/header";
import { Footer } from "../component/footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillSwap — Exchange skills and grow together",
  description:
    "A trusted community where people exchange skills and knowledge without exchanging money.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <AuthProvider>
          <Header />
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
