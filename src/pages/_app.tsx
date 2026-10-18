import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

import { store } from "@/store/store";

import "@/styles/_reset.scss";
import "@/styles/global.scss";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Provider store={store}>
        <Toaster
          position="top-right"
          containerStyle={{ top: "4vw" }}
        />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
