/* eslint-disable @next/next/no-img-element */
import router, { useRouter } from "next/router";
import { DesktopOutlined, UserOutlined } from '@ant-design/icons';
import { Divider, Layout, Menu, Row, Spin } from "antd";
import { useContext, useEffect, useState } from "react";

import type { MenuProps } from 'antd';
import AppContext from "@/components/context/AppContext";
import { Typography } from "@mui/material";
import Logo from "@/layouts/full/shared/logo/Logo";
import Header from "@/layouts/full/header/Header";
import LeaveManagement from "@/components/routes/Employee/LM";
import PECompetency from "@/components/routes/Employee/PE/competency";
import PerformanceEvaluation from "@/components/routes/Employee/PE/evaluation";
import PEObjectives from "@/components/routes/Employee/PE/objectives";
import TimeAndAttendanceManagement from "@/components/routes/Employee/TAM";
import UserProfile from "@/components/routes/Employee/UserProfile";
import AttendanceValidation from "@/components/routes/Manager/attendanceValidation";
import EmployeeManagement from "@/components/routes/HR/employeeManagement";
import HRSettings from "@/components/routes/HR/hrSettings";
import AttendanceApproval from "@/components/routes/HR/attendanceApproval";
import RequestModification from "@/components/routes/HR/requestModification";

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Time & Attendance Management', 'tam', <DesktopOutlined />),
    getItem('Leave Management', 'lm', <DesktopOutlined />),
    getItem('Performance Evaluation', 'pe', <DesktopOutlined />),
    getItem('Talent Acquisition', 'ta', <DesktopOutlined />),
    getItem('Training & Development', 'trd', <DesktopOutlined />),
];

const utilities: MenuItem[] = [
    getItem('Profile', 'profile', <UserOutlined />),
];

const hrManagerMonitor: MenuItem[] = [
    getItem('Attendance Approval', 'ata', <DesktopOutlined />),
    getItem('Leave Approval', 'la', <DesktopOutlined />),
    getItem('Request Modification', 'rm', <DesktopOutlined />),
    getItem('Escalated Issue', 'ei', <DesktopOutlined />),
    getItem('HR Settings', 'hrs', <DesktopOutlined />),
    getItem('Employee Management', 'em', <DesktopOutlined />),
];

const managerMonitor: MenuItem[] = [
    getItem('Attendance Validation', 'atv', <DesktopOutlined />),
    getItem('Leave Validation', 'lv', <DesktopOutlined />),
    getItem('Objective Setting', 'os', <DesktopOutlined />),
    getItem('Hiring Need', 'hn', <DesktopOutlined />),
    getItem('My Reportees', 'mr', <DesktopOutlined />),
    getItem('Issue Escalation', 'ie', <DesktopOutlined />),
];

/**
 * If the current route is not the route we want to go to, then go to the route we want to go to.
 * @param {string} route - string - the route you want to push to
 */
const pushWithCheck = (route: string) => {
    if (router.pathname !== route) router.push(route);
};

/**
 * If the key is equal to 'logo', then pushWithCheck('/')
 * @param {any} e - any -&gt; the event that is triggered when the menu item is clicked
 */
function handleMenuClick(e: any) {

    if (e.key == "tam") {
        pushWithCheck("/tam");
    }

    if (e.key == "lm") {
        pushWithCheck("/lm");
    }

    if (e.key == "pe") {
        pushWithCheck("/pe");
    }

    if (e.key == "profile") {
        pushWithCheck("/profile");
    }

    if (e.key == "atv") {
        pushWithCheck("/atv");
    }

    if (e.key == "em") {
        pushWithCheck("/em");
    }

    if (e.key == "hrs") {
        pushWithCheck("/hrs");
    }

    if (e.key == "ata") {
        pushWithCheck("/ata");
    }

    if (e.key == "rm") {
        pushWithCheck("/rm");
    }
}

export default function Home() {
    /* A hook that gives you access to the router. */
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const context = useContext(AppContext);
    // console.log(context);

    const { pid, query } = router.query;

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    useEffect(() => {
        if (context.user) {
            setPageLoading(false);
        }
        else {
            router.push('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.user]);

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
                <Layout
                    style={{
                        minHeight: '100vh',
                        backgroundColor: 'white',
                    }}
                >
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        collapsedWidth={70}
                        width={280}
                        onCollapse={(value) => setCollapsed(value)}
                        breakpoint={"lg"}
                        style={{
                            backgroundColor: 'white',
                            // position: 'fixed',
                        }}
                    >
                        <Logo />

                        {/* Home */}
                        <>
                            <Divider orientation="left">
                                <Typography variant="body1">
                                    {collapsed ? "" : "Home"}
                                </Typography>
                            </Divider>

                            <Menu
                                theme="light"
                                mode="inline"
                                items={items}
                                selectedKeys={[`${router.query['pid']}`]}
                                onClick={(menu) => {
                                    handleMenuClick(menu);
                                }}
                            />
                        </>

                        {/* HR Monitor */}
                        {
                            context.role?.includes("HR Manager") &&
                            <>
                                <>
                                    <Divider orientation="left">
                                        <Typography variant="body1">
                                            {collapsed ? "" : "HR Monitor"}
                                        </Typography>
                                    </Divider>

                                    <Menu
                                        theme="light"
                                        mode="inline"
                                        items={hrManagerMonitor}
                                        selectedKeys={[`${router.query['pid']}`]}
                                        onClick={(menu) => {
                                            handleMenuClick(menu);
                                        }}
                                    />
                                </>
                            </>
                        }


                        {/* Manager */}
                        {
                            context.role?.includes("Manager") &&
                            <>
                                <>
                                    <Divider orientation="left">
                                        <Typography variant="body1">
                                            {collapsed ? "" : "Manager Monitor"}
                                        </Typography>
                                    </Divider>

                                    <Menu
                                        theme="light"
                                        mode="inline"
                                        items={managerMonitor}
                                        selectedKeys={[`${router.query['pid']}`]}
                                        onClick={(menu) => {
                                            handleMenuClick(menu);
                                        }}
                                    />
                                </>
                            </>
                        }

                    </Sider>

                    <Layout
                        className="site-layout"
                        style={{
                            backgroundColor: 'white',
                        }}
                    >
                        <Header toggleMobileSidebar={() => { }} />

                        <Content>
                            {/* Employee */}
                            {pid === "tam" && <TimeAndAttendanceManagement />}
                            {pid === "lm" && <LeaveManagement />}
                            {pid === "pe" && <PerformanceEvaluation />}
                            {pid === "pe_obj" && <PEObjectives />}
                            {pid === "pe_com" && <PECompetency />}

                            {/* Utilities */}
                            {pid === "profile" && <UserProfile />}

                            {/* HR Manager */}
                            {pid === "em" && <EmployeeManagement />}
                            {pid === "hrs" && <HRSettings />}
                            {pid === "ata" && <AttendanceApproval />}
                            {pid === "rm" && <RequestModification />}

                            {/* Manager */}
                            {pid === "atv" && <AttendanceValidation />}
                        </Content>

                        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
                    </Layout>
                </Layout>
            </>
        );
    }
}
