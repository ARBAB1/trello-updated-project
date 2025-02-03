"use client";
import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "./providers/ReduxProvider";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    <SnackbarProvider autoHideDuration={1000}>

   
              <ReduxProvider>
              {children}
              </ReduxProvider>
              </SnackbarProvider>
      </body>
    </html>
  );
}
