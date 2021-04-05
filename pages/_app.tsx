import { AppProps } from 'next/dist/next-server/lib/router/router';
import { Layout } from '../lib/Layout';
import '../styles/globals.css';
import '../styles/atom-one-dark.css';
import Head from 'next/head';
import { OverlayProvider } from '@react-aria/overlays';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>XState Catalogue</title>
        <meta
          name="description"
          content="A collection of professionally designed state machines you can drop into your XState projects"
        ></meta>
        <link rel="canonical" href="https://xstate-catalogue.com" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content="XState Catalogue - Beautiful State Machines"
        />
        <meta
          property="og:image"
          content="https://xstate-catalogue.com/og-image.png"
        />
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
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            ></script>
            <script>
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
            `}
            </script>
          </>
        )}
      </Head>
      <OverlayProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </OverlayProvider>
      <script src="/highlight.pack.js"></script>
    </>
  );
}

export default MyApp;
