import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add the Google Maps script here */}
          <script
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAGcacS_lMskC1we2aAiv6-9hX962_IGNs&libraries=places"
            async
            defer
          />
          {/* Remove <title> from here.
              Instead, add a title in each page using next/head, for example:
              import Head from 'next/head';
              ...
              <Head>
                <title>Shelteric</title>
              </Head>
          */}
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

