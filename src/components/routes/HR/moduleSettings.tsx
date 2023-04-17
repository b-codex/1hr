
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

const companySetup: any[] = [
    {
        key: "1",
        label: "Basic Info",
        children: [],
    },
    {
        key: "2",
        label: "Department",
        children: [],
    },
    {
        key: "3",
        label: "Section",
        children: [],
    },
];
function CompanySetupTabs() {

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
                centered
                items={companySetup}
                style={{}}
            />
        </>
    );
};

const jobMgmt: any[] = [
    {
        key: "1",
        label: "Basic Info",
        children: [],
    },
    {
        key: "2",
        label: "Department",
        children: [],
    },
    {
        key: "3",
        label: "Section",
        children: [],
    },
];
function JobMgmtTabs() {

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
                centered
                items={jobMgmt}
                style={{}}
            />
        </>
    );
};

const items: any[] = [
    {
        key: "CS",
        label: "Company Setup",
        children: <CompanySetupTabs />,
    },
    {
        key: "JM",
        label: "Job Management",
        children: [],
    },
    {
        key: "IS",
        label: "Issue",
        children: [],
    },
];

const ModuleSettings = () => {
    return (
        <>
            <Tabs
                defaultActiveKey="CS"
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