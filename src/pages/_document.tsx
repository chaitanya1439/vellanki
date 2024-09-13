import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add the Google Maps script here */}
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC-ax1I97TVpadyeUYn8CUtYQvg2mH636g`}
            strategy="beforeInteractive"
          />
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
