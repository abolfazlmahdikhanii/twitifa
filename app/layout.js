import connectToDB from "@/config/db";
import localFont from "next/font/local";
import { Vazirmatn } from "next/font/google";


import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

const vazir = Vazirmatn({
  // weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["arabic", "latin"],
  display: "swap",

});
// const vazir = localFont({
//   src: "./fonts/Vazirmatn-FD-Regular.woff2", 
//   display: "swap",
// });
export const metadata = {
  title: "twitifa",
  siteName: "Twitifa",
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  ),
  openGraph: {
    siteName: "Twitifa",
    images: [
      {
        url: "/images/ogimage.png",
        width: 500,
        height: 300,
      },
    ],

    type: "article",
  },
};

export default async function RootLayout({ children }) {
  await connectToDB();
  const clientId = process.env.GOOGLE_CLIENT_ID;

  return (
    <html lang="fa" dir="rtl" className={`dark ${vazir.className}`}>
      <body className="bg-zinc-50 dark:bg-body tabular-nums features-['ss03']">
        <Toaster
          richColors
          position="bottom-center"
          className="w-fit sm:w-full"
          toastOptions={{
            style: {
              minHeight: "60px",
              borderRadius: "16px",
              paddingTop: "15px",
              paddingBottom: "15px",
            },
          }}
        />
        <Providers clientId={clientId}> {children}</Providers>
      </body>
    </html>
  );
}
