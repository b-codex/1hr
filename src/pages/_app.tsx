import '@/styles/globals.css';

import { ReactElement, ReactNode, useEffect, useState } from "react";

import { db } from '@/backend/api/firebase';
import { checkAttendanceStage } from '@/backend/functions/checkAttendanceStage';
import { checkPerformanceEvaluationStage } from '@/backend/functions/checkPerformanceEvaluationStage';
import { EmployeeData } from '@/backend/models/employeeData';
import AppContext from '@/components/context/AppContext';
import createEmotionCache from '@/createEmotionCache';
import { baseLightTheme } from '@/theme/DefaultColors';
import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Row, Spin } from 'antd';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
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

    const [pageLoading, setPageLoading] = useState<boolean>(true);

    const [user, setUser] = useState<EmployeeData | null>();
    const [role, setRole] = useState<string[] | null>();

    const [employeeID, setEmployeeID] = useState<string | null>();

    function logout() {
        setEmployeeID(null);
        setUser(null);
        setRole(null);
    };

    function login(user: EmployeeData) {
        setEmployeeID(user.employeeID);
        setUser(user);
        setRole(user.role);
    }

    useEffect(() => {
        const loggedIn: string = localStorage.getItem('loggedIn') as string;
        // console.log("Logged In: ", loggedIn);

        if (loggedIn !== undefined && loggedIn !== null) {
            const user: EmployeeData = JSON.parse(localStorage.getItem('user') as string);
            setEmployeeID(`${user.employeeID}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const employee: EmployeeData | undefined = data.find((doc) => doc.employeeID === employeeID);

        if (employee) {
            setUser(employee);
            setRole(employee.role);
        }

        setPageLoading(false);

    }), [employeeID]);

    if (pageLoading) {
        return (
            <>
                <Row
                    style={{
                        width: "calc(100vw - 1rem)",
                        height: "calc(100vh - 1rem)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin />
                </Row>
            </>
        );
    }

    else {
        return (
            <>
                {/* {checkAttendanceStage()}
                {checkPerformanceEvaluationStage()} */}

                <AppContext.Provider value={{ user, role, employeeID, logout, login }}>
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
                </AppContext.Provider>

            </>
        );
    }

};

export default MyApp;
