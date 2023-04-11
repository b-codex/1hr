/* eslint-disable @next/next/no-img-element */

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

const Error = () => (
    <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        textAlign="center"
        justifyContent="center"
    >
        <Container maxWidth="md">
            <img
                src={"/images/backgrounds/404-error-idea.gif"}
                alt="404"
                // width={100}
                // height={100}
                style={{ width: "100%", maxWidth: "500px" }}
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