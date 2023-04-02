import {
    IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const Menuitems = [
    {
        navlabel: true,
        subheader: 'Home',
    },

    {
        id: uniqueId(),
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        href: '/',
    },
    {
        id: uniqueId(),
        title: 'Time & Attendance Management',
        icon: IconLayoutDashboard,
        href: '/time_and_attendance_management',
    },

    {
        id: uniqueId(),
        title: 'Leave Management',
        icon: IconLayoutDashboard,
        href: '/leave_management',
    },

    {
        id: uniqueId(),
        title: 'Performance Management',
        icon: IconLayoutDashboard,
        href: '/performance_management',
    },

    {
        id: uniqueId(),
        title: 'Talent Acquisition',
        icon: IconLayoutDashboard,
        href: '/talent_acquisition',
    },

    {
        id: uniqueId(),
        title: 'Training & Development',
        icon: IconLayoutDashboard,
        href: '/training_and_development',
    },
    //   {
    //     navlabel: true,
    //     subheader: 'Utilities',
    //   },
    //   {
    //     id: uniqueId(),
    //     title: 'Time & Attendance Management',
    //     icon: IconTypography,
    //     href: '/tam',
    //   },
    //   {
    //     id: uniqueId(),
    //     title: 'Typography',
    //     icon: IconTypography,
    //     href: '/utilities/typography',
    //   },
    //   {
    //     id: uniqueId(),
    //     title: 'Shadow',
    //     icon: IconCopy,
    //     href: '/utilities/shadow',
    //   },
    //   {
    //     navlabel: true,
    //     subheader: 'Auth',
    //   },
    //   {
    //     id: uniqueId(),
    //     title: 'Login',
    //     icon: IconLogin,
    //     href: '/authentication/login',
    //   },
    //   {
    //     id: uniqueId(),
    //     title: 'Register',
    //     icon: IconUserPlus,
    //     href: '/authentication/register',
    //   },
    //   {
    //     navlabel: true,
    //     subheader: 'Extra',
    //   },
    //   {
    //     id: uniqueId(),
    //     title: 'Icons',
    //     icon: IconMoodHappy,
    //     href: '/icons',
    //   },
    //   {
    //     id: uniqueId(),
    //     title: 'Sample Page',
    //     icon: IconAperture,
    //     href: '/sample-page',
    //   },
];

export default Menuitems;
