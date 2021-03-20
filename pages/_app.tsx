import { AppProps } from "next/dist/next-server/lib/router/router";
import { Layout } from "../lib/Layout";
import "../styles/globals.css";
import "../styles/atom-one-dark.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>XState Catalogue</title>
        <meta
          name="description"
          content="A collection of professionally designed state machines you can drop into your XState projects"
        ></meta>
        {/* <link rel="canonical" href="http://example.com/" /> */}
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="State Machine Catalogue" />
        <meta property="og:image" content="/og-image.png" />
        <meta
          property="og:description"
          content="A collection of professionally designed state machines you can drop into your XState projects"
        />
        <meta property="og:site_name" content="XState Catalogue" />
        <meta name="twitter:title" content="XState Catalogue" />
        <meta
          name="twitter:description"
          content="A collection of professionally designed state machines you can drop into your XState projects"
        />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:creator" content="@mpocock1" />
        <meta name="twitter:site" content="@mpocock1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <script src="/highlight.pack.js"></script>
    </>
  );
}

export default MyApp;
