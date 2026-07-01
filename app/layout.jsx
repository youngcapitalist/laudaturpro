import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Poppins, Open_Sans } from "next/font/google";
import SocialProofToast from "./components/SocialProofToast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata = {
  title: "LaudaturPro.fi — yo-valmennus kaikissa aineissa",
  description:
    "Paranna ylioppilaskokeen arvosanoja. Teoria, AI-professori ja harkkakokeet kaikissa aineissa.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fi" className={`${poppins.variable} ${openSans.variable}`}>
      <body>
        {children}
        <SocialProofToast />
        <Analytics />
      </body>
    </html>
  );
}
