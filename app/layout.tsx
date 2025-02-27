import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import axios from "axios";
import Error from "@/components/ui/error";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverUrl = process.env.NEXT_PUBLIC_BASE_URL;

  let serverIsOnline = false;
  const checkServer = async () => {
    try {
      await axios.get(serverUrl as string).then((response: any) => {
        if (response.status === 200) {
          serverIsOnline = true;
        }
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  await checkServer();

  return (
    <html lang="en" suppressHydrationWarning>
      <title>ENEC 360</title>
      <body className={inter.className}>
        <Providers>
          <Toaster />
          {serverIsOnline ? (
            <main>{children}</main>
          ) : (
            <Error message="Server is offline" icon={true} />
          )}
        </Providers>
      </body>
    </html>
  );
}
