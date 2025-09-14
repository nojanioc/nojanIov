import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import localFont from "@next/font/local";

const yekans = localFont({
  src: [
    {
      path: "../../public/fonts/IRANYekanXFaNum-Thin.ttf",
      weight: "300",
    },
    {
      path: "../../public/fonts/IRANYekanXFaNum-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/IRANYekanXFaNum-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../public/fonts/IRANYekanXFaNum-DemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../public/fonts/IRANYekanXFaNum-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../public/fonts/IRANYekanXFaNum-ExtraBold.ttf",
      weight: "800",
    },
  ],
  variable: "--font-yekan",
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${yekans.variable} font-yekan`}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="toast-container"
            toastClassName="toast-message max-w-full m-2"
            bodyClassName="toast-body"
          />
          <Component {...pageProps} />
        </SessionProvider>
      </QueryClientProvider>
    </div>
  );
}
