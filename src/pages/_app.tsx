import '@/styles/globals.css';

import type { ReactElement, ReactNode } from "react";

import { checkAttendanceStage } from '@/backend/functions/checkAttendanceStage';
import { checkPerformanceEvaluationStage } from '@/backend/functions/checkPerformanceEvaluationStage';
import createEmotionCache from '@/createEmotionCache';
import { baseLightTheme } from '@/theme/DefaultColors';
import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
    Component: NextPageWithLayout;
}

const MyApp = (props: MyAppProps) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    const theme = baseLightTheme;

    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            {checkAttendanceStage()}
            {checkPerformanceEvaluationStage()}

            <CacheProvider value={emotionCache}>
                <Head>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <title>oneHR</title>
                    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
                </Head>

                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />

                    {getLayout(<Component {...pageProps} />)}

                </ThemeProvider>

            </CacheProvider>
        </>
    );
};

export default MyApp;
