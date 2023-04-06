import FullLayout from '@/layouts/full/FullLayout';
import { ReactElement } from 'react';

import { Tabs } from 'antd';
import { useMediaQuery } from '@mui/material';
import LeaveTypes from '@/components/HR-Settings/LM/leaveTypes';
import LeaveStages from '@/components/HR-Settings/LM/leaveStages';
import LeaveStates from '@/components/HR-Settings/LM/leaveStates';
import PeriodicOptions from '@/components/HR-Settings/PE/periodicOptions';

const timeAndAttendanceManagementSettings: any[] = [];
function TimeAndAttendanceManagementTabs() {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
                centered
                items={timeAndAttendanceManagementSettings}
                style={{
                    width: matches ? 'calc(100vw - 370px)' : "100%",
                }}
            />
        </>
    );
};

const leaveManagementSettings: any[] = [
    {
        key: "1",
        label: "Leave Types",
        children: [
            <>
                <LeaveTypes />
            </>,
        ]
    },
    {
        key: "2",
        label: "Leave Stages",
        children: [
            <>
                <LeaveStages />
            </>,
        ]
    },
    {
        key: "3",
        label: "Leave States",
        children: [
            <>
                <LeaveStates />
            </>,
        ]
    },
];
function LeaveManagementTabs() {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
                centered
                items={leaveManagementSettings}
                style={{
                    width: matches ? 'calc(100vw - 370px)' : "100%",
                }}
            />
        </>
    );
};

const performanceEvaluationSettings: any[] = [
    {
        key: "1",
        label: "Periodic Options",
        children: [
            <>
                <PeriodicOptions />
            </>,
        ]
    },
];
function PerformanceEvaluationTabs() {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
                centered
                items={performanceEvaluationSettings}
                style={{
                    width: matches ? 'calc(100vw - 370px)' : "100%",
                }}
            />
        </>
    );
};


const items: any[] = [
    {
        key: "TAM",
        label: "Time & Attendance Management Settings",
        children: [
            <>
                <TimeAndAttendanceManagementTabs />
            </>,
        ]
    },
    {
        key: "LM",
        label: "Leave Management Settings",
        children: [
            <>
                <LeaveManagementTabs />
            </>,
        ]
    },
    {
        key: "PE",
        label: "Performance Evaluation Settings",
        children: [
            <>
                <PerformanceEvaluationTabs />
            </>,
        ]
    },
];

const HRSettings = () => {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <Tabs
                defaultActiveKey="TAM"
                centered
                items={items}
                style={{
                    width: matches ? 'calc(100vw - 370px)' : "100%",
                }}
            />
        </>
    );
};

export default HRSettings;
HRSettings.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};