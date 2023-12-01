import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../commons/theme';
import styles from "../styles/Home.module.scss"
import Copyright from '../components/Copyright';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';


declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Jikba</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content="日常のことを書くだけ" />
      </Head>
       <StyledEngineProvider injectFirst>
         <ThemeProvider theme={theme}>
           {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
           <CssBaseline />
           <main className={styles.main}> 
             <Link href={"/"} passHref>
               <h1 className={styles.mainTitle}>Jikba</h1>
             </Link>
             <Component {...pageProps} />
             <Analytics />
             <Copyright />
           </main>
         </ThemeProvider>
       </StyledEngineProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
