import type { ReactElement } from 'react';
import { Box, Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import BlankLayout from '@/layouts/blank/BlankLayout';
import Image from 'next/image';

const Error = () => (
    <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        textAlign="center"
        justifyContent="center"
    >
        <Container maxWidth="md">
            <Image
                src={"/images/backgrounds/404-error-idea.gif"}
                alt="404"
                style={{ width: "100%", maxWidth: "500px" }}
                priority
            />
            <Typography align="center" variant="h1" mb={4}>
                Oops!!!
            </Typography>
            <Typography align="center" variant="h4" mb={4}>
                This page you are looking for could not be found.
            </Typography>
            <Button
                color="primary"
                variant="contained"
                component={Link}
                href="/"
                disableElevation
            >
                Go Back to Home
            </Button>
        </Container>
    </Box>
);

export default Error;

Error.getLayout = function getLayout(page: ReactElement) {
    return <BlankLayout>{page}</BlankLayout>;
};
