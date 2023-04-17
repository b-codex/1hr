
import { Tabs } from 'antd';
import LeaveStages from './HR-Settings/Module/LM/leaveStages';
import LeaveStates from './HR-Settings/Module/LM/leaveStates';
import LeaveTypes from './HR-Settings/Module/LM/leaveTypes';
import EvaluationCampaigns from './HR-Settings/Module/PE/evaluationCampaigns';
import MonitoringPeriods from './HR-Settings/Module/PE/monitoringPeriods';
import PeriodicOptions from './HR-Settings/Module/PE/periodicOptions';
import ShiftTypes from './HR-Settings/Module/TAM/shiftTypes';
import CompetencyDefinition from './HR-Settings/Module/PE/competencyDefinition';
import PositionDefinition from './HR-Settings/Module/PE/positionDefinition';
import CompetencyPositionAssociation from './HR-Settings/Module/PE/competencyPositionAssociation';

// TAM Settings
const timeAndAttendanceManagementSettings: any[] = [
    {
        key: "1",
        label: "Shift Types",
        children: <ShiftTypes />,
    },
];
function AttendanceManagementTabs() {

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
function PerformanceManagementTabs() {

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
        label: "Attendance Management",
        children: <AttendanceManagementTabs />,
    },
    {
        key: "LM",
        label: "Leave Management",
        children: <LeaveManagementTabs />,
    },
    {
        key: "PE",
        label: "Performance Management",
        children: <PerformanceManagementTabs />,
    },
];

const ModuleSettings = () => {
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

export default ModuleSettings;