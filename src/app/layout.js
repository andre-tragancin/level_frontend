import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client_layout";
import QueryProvider from "./query_provider";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Level",
  description: "level frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ClientLayout>
            {children}
            <Toaster position="top-right" />
          </ClientLayout>
        </QueryProvider>
      </body>
    </html>
  );
}