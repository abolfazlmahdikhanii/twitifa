import connectToDB from "@/config/db";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

const vazir = Vazirmatn({
  // weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata = {
  title: "twitifa",
  siteName: "Twitifa",
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
      <body className="bg-zinc-50 dark:bg-body ">
        <Toaster
          richColors
          position="bottom-center"
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
