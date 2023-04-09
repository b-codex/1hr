import generateID from '@/backend/constants/generateID';
import { DashboardOutlined, UserOutlined } from '@ant-design/icons';

const Menuitems = [
    {
        navlabel: true,
        subheader: 'Home',
    },

    {
        id: generateID(),
        title: 'Dashboard',
        icon: DashboardOutlined,
        href: '/dashboard',
    },
    {
        id: generateID(),
        title: 'Time & Attendance Management',
        icon: DashboardOutlined,
        href: '/time_and_attendance_management',
    },

    {
        id: generateID(),
        title: 'Leave Management',
        icon: DashboardOutlined,
        href: '/leave_management',
    },

    {
        id: generateID(),
        title: 'Performance Evaluation',
        icon: DashboardOutlined,
        href: '/performanceEvaluation/performance_evaluation',
    },

    {
        id: generateID(),
        title: 'Talent Acquisition',
        icon: DashboardOutlined,
        href: '/talent_acquisition',
    },

    {
        id: generateID(),
        title: 'Training & Development',
        icon: DashboardOutlined,
        href: '/training_and_development',
    },

    {
        id: generateID(),
        title: 'HR Settings',
        icon: DashboardOutlined,
        href: '/hr_settings',
    },

    {
        navlabel: true,
        subheader: 'Utilities',
    },

    {
        id: generateID(),
        title: 'Profile',
        icon: UserOutlined,
        href: '/profile',
    },
    //   {
    //     id: generateID(),
    //     title: 'Typography',
    //     icon: IconTypography,
    //     href: '/utilities/typography',
    //   },
    //   {
    //     id: generateID(),
    //     title: 'Shadow',
    //     icon: IconCopy,
    //     href: '/utilities/shadow',
    //   },
    //   {
    //     navlabel: true,
    //     subheader: 'Auth',
    //   },
    //   {
    //     id: generateID(),
    //     title: 'Login',
    //     icon: IconLogin,
    //     href: '/authentication/login',
    //   },
    //   {
    //     id: generateID(),
    //     title: 'Register',
    //     icon: IconUserPlus,
    //     href: '/authentication/register',
    //   },
    //   {
    //     navlabel: true,
    //     subheader: 'Extra',
    //   },
    //   {
    //     id: generateID(),
    //     title: 'Icons',
    //     icon: IconMoodHappy,
    //     href: '/icons',
    //   },
    //   {
    //     id: generateID(),
    //     title: 'Sample Page',
    //     icon: IconAperture,
    //     href: '/sample-page',
    //   },
];

export default Menuitems;
