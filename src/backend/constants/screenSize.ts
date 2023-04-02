import { baseLightTheme as theme } from '@/theme/DefaultColors';

const screenSize = theme.breakpoints.up('sm') === "@media (min-width:600px)";

export default screenSize;