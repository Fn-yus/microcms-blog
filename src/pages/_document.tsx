import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import theme from '../commons/theme';
import { JssProvider } from 'react-jss';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  
  render() {
    return (
      <JssProvider>
        <Html lang="ja">
          <Head>
            {/* PWA primary color */}
            <meta name="theme-color" content={theme.palette.primary.main} />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      </JssProvider>
    );
  }
}

