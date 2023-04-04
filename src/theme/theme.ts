import { Montserrat } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const montserrat = Montserrat({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#3f3d56',
        },
        secondary: {
            main: '#3f3d56',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: montserrat.style.fontFamily,
    },
});

export default theme;
