
import { Tabs } from 'antd';
import Department from './HR-Settings/Core/department';
import Section from './HR-Settings/Core/section';

const companySetup: any[] = [
    {
        key: "1",
        label: "Basic Info",
        children: [],
    },
    {
        key: "2",
        label: "Department",
        children: <Department />,
    },
    {
        key: "3",
        label: "Section",
        children: <Section />,
    },
];
function CompanySetupTabs() {

    return (
        <>
            <Tabs
                defaultActiveKey="2"
                tabPosition='left'
                centered
                items={companySetup}
                style={{}}
            />
        </>
    );
};

const jobMgmt: any[] = [

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
        children: <JobMgmtTabs />,
    },
    {
        key: "IS",
        label: "Issue",
        children: [],
    },
];

const CoreSettings = () => {
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

export default CoreSettings;