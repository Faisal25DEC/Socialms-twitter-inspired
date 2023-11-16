import Layout from "@/components/Layout";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import EditModal from "@/components/modals/EditModal";
import  MessageModal  from "@/components/modals/MessageModal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Toaster />
      <Layout>
        <LoginModal />
        <RegisterModal />
        <EditModal />
        <MessageModal />
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
