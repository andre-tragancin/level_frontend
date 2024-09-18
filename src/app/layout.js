import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client_layout";
import QueryProvider from "./query_provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Think Play",
  description: "think play front end",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </QueryProvider>
      </body>
    </html>
  );
}