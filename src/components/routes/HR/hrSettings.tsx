
import { Tabs } from 'antd';
import LeaveStages from './HR-Settings/LM/leaveStages';
import LeaveStates from './HR-Settings/LM/leaveStates';
import LeaveTypes from './HR-Settings/LM/leaveTypes';
import EvaluationCampaigns from './HR-Settings/PE/evaluationCampaigns';
import MonitoringPeriods from './HR-Settings/PE/monitoringPeriods';
import PeriodicOptions from './HR-Settings/PE/periodicOptions';
import ShiftTypes from './HR-Settings/TAM/shiftTypes';
import CompetencyDefinition from './HR-Settings/PE/competencyDefinition';
import PositionDefinition from './HR-Settings/PE/positionDefinition';
import CompetencyPositionAssociation from './HR-Settings/PE/competencyPositionAssociation';

// TAM Settings
const timeAndAttendanceManagementSettings: any[] = [
    {
        key: "1",
        label: "Shift Types",
        children: <ShiftTypes />,
    },
];
function TimeAndAttendanceManagementTabs() {

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
                centered
                items={timeAndAttendanceManagementSettings}
                style={{}}
            />
        </>
    );
};

// LM Settings
const leaveManagementSettings: any[] = [
    {
        key: "1",
        label: "Leave Types",
        children: <LeaveTypes />,
    },
    {
        key: "2",
        label: "Leave Stages",
        children: <LeaveStages />
    },
    {
        key: "3",
        label: "Leave States",
        children: <LeaveStates />,
    },
];
function LeaveManagementTabs() {

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
                centered
                items={leaveManagementSettings}
                style={{}}
            />
        </>
    );
};

// PE Settings
const performanceEvaluationSettings: any[] = [
    {
        key: "1",
        label: "Periodic Options",
        children: <PeriodicOptions />,
    },
    {
        key: "2",
        label: "Evaluation Campaigns",
        children: <EvaluationCampaigns />,
    },
    {
        key: "3",
        label: "Monitoring Periods",
        children: <MonitoringPeriods />,
    },
    {
        key: "4",
        label: "Competency Definition",
        children: <CompetencyDefinition />,
    },
    {
        key: "5",
        label: "Position Definition",
        children: <PositionDefinition />,
    },
    {
        key: "6",
        label: "Competency Position Association",
        children: <CompetencyPositionAssociation />,
    },
];
function PerformanceEvaluationTabs() {

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
                centered
                items={performanceEvaluationSettings}
                style={{}}
            />
        </>
    );
};

const items: any[] = [
    {
        key: "TAM",
        label: "Time & Attendance Management Settings",
        children: <TimeAndAttendanceManagementTabs />,
    },
    {
        key: "LM",
        label: "Leave Management Settings",
        children: <LeaveManagementTabs />,
    },
    {
        key: "PE",
        label: "Performance Evaluation Settings",
        children: <PerformanceEvaluationTabs />,
    },
];

const HRSettings = () => {
    return (
        <>
            <Tabs
                defaultActiveKey="TAM"
                centered
                items={items}
                style={{
                    width: "100%",
                }}
            />
        </>
    );
};

export default HRSettings;