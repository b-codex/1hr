import { addHRSetting, db, updateHRSetting } from '@/backend/api/firebase';
import { months } from '@/backend/constants/months';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import CustomModal from '../../customModal';
import { groupBy } from '@/backend/constants/groupBy';
import { onSnapshot, collection, QuerySnapshot, DocumentData } from 'firebase/firestore';
import moment from 'moment';
import { days } from '@/backend/constants/days';
import generateID from '@/backend/constants/generateID';
import { PositionDefinitionData } from '@/backend/models/positionDefinitionData';
import { CompetencyDefinitionData } from '@/backend/models/competencyDefinitionData';
import { ObjectiveData } from '@/backend/models/objectiveData';
import { DepartmentData } from '@/backend/models/departmentData';
import { SectionData } from '@/backend/models/sectionData';

export default function HREditSetting(
    {
        open,
        setOpen,
        type,
        data,
    }: {
        open: boolean,
        setOpen: any,
        type: string,
        data: any,
    }
) {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle={`Edit Setting - ${type}`}
                width={matches ? "50%" : "100%"}
            >
                <EditSetting setOpen={setOpen} type={type} data={data} />
            </CustomModal>
        </>
    );
}

function EditSetting(
    {
        setOpen,
        type,
        data,
    }: {
        setOpen: any,
        type: string,
        data: any,
    }
) {
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const [periodicOptionsData, setPeriodicOptionsData] = useState<any>([]);
    const [periodNames, setPeriodNames] = useState<any[]>([]);

    const [cid, setCid] = useState<any[]>([]);
    const [pid, setPid] = useState<any[]>([]);

    const [sections, setSections] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => onSnapshot(collection(db, "hrSettings"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        /* Sorting the data by date. */
        data.sort((a, b) => {
            let date1: moment.Moment = moment(`${a.timestamp} ${a.year}`, "MMMM YYYY");
            let date2: moment.Moment = moment(`${b.timestamp} ${b.year}`, "MMMM YYYY");

            return date1.isBefore(date2) ? 1 : -1;
        });

        const groupedSettings: any = groupBy("type", data);
        const periodicOptions: any[] = groupedSettings['Periodic Option'] ?? [];
        setPeriodicOptionsData(periodicOptions);

        const options: any[] = [];
        periodicOptions.forEach((option) => {
            const name: string = option.periodName;
            const id: string = option.id;

            options.push({ label: name, value: name });
        });
        setPeriodNames(options);

        const pid: any[] = groupedSettings['Position Definition'] ?? [];
        const pidOptions: any[] = pid.map((pid: PositionDefinitionData) => pid.active === "Yes" && ({ label: pid.pid, value: pid.pid }));
        setPid(pidOptions);

        const cid: any[] = groupedSettings['Competency Definition'] ?? [];
        const cidOptions: any[] = cid.map((cid: CompetencyDefinitionData) => cid.active === "Yes" && ({ label: cid.cid, value: cid.cid }));
        setCid(cidOptions);

        const scs: any[] = groupedSettings['Section'] ?? [];
        const sections: any[] = scs.map((sc: SectionData) => sc.active === "Yes" && ({ label: sc.name, value: sc.name }));
        setSections(sections);

        const dept: any[] = groupedSettings['Department'] ?? [];
        const deps: any[] = dept.map((dep: DepartmentData) => dep.active === "Yes" && ({ label: dep.name, value: dep.name }));
        setDepartments(deps);

    }), []);

    const [employees, setEmployees] = useState<any>([]);
    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const options: any[] = [];
        data.forEach(user => {
            options.push(
                {
                    label: user.employeeID,
                    value: user.employeeID,
                }
            );
        });

        setEmployees(options);

    }), []);


    const [objectives, setObjectives] = useState<any[]>([]);
    useEffect(() => onSnapshot(collection(db, "objective"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        /* Sorting the data by date. */
        data.sort((a, b) => {
            let date1: moment.Moment = moment(`${a.timestamp} ${a.year}`, "MMMM YYYY");
            let date2: moment.Moment = moment(`${b.timestamp} ${b.year}`, "MMMM YYYY");

            return date1.isBefore(date2) ? -1 : 1;
        });

        const objectives: any[] = data.map((obj: ObjectiveData) => ({ label: obj.objectiveID, value: obj.objectiveID }));
        setObjectives(objectives);
    }), []);

    useEffect(() => {
        if (data !== undefined) {
            const keys: string[] = Object.keys(data);

            if (type === "Evaluation Campaign" || type === "Monitoring Period" || type === "Competency Definition" || type === "Position Definition" || type === "Section") {
                keys.forEach((key) => {
                    if (key === "startDate" || key === "endDate") {
                        if (data[key]) form.setFieldValue(key, dayjs(data[key], "MMMM DD, YYYY"));
                    }
                    else {
                        if (data[key] !== null) form.setFieldValue(key, data[key]);
                    }
                });
            }
            else {
                keys.forEach((key) => {
                    if (data[key] !== null) form.setFieldValue(key, data[key]);
                });
            }
        }
    }, [data, form, type]);

    const success = () => {
        message.success('Success.');
    };

    const error = () => {
        message.error('Something went wrong. Please Try Again.');
    };

    const formFailed = () => {
        message.error('Please Make Sure All Fields Are Filled');
    };

    const onFinish = () => {
        form.validateFields().then(async (values) => {
            setLoading(true);

            const keys: string[] = Object.keys(values);
            keys.forEach((key) => {
                if (values[key] === undefined) values[key] = null;
            });

            if (type === "Evaluation Campaign" || type === "Monitoring Period" || type === "Competency Definition" || type === "Position Definition" || type === "Section") {
                if (values.startDate) values.startDate = dayjs(values.startDate).format("MMMM DD, YYYY");
                if (values.endDate) values.endDate = dayjs(values.endDate).format("MMMM DD, YYYY");
            }

            // console.log("values: ", values);

            await updateHRSetting(values, data.id)
                .then((res: boolean) => {

                    if (res === true) {
                        success();
                        setLoading(false);
                        setOpen(false);
                        form.resetFields();
                    }

                    if (res === false) {
                        error();
                        setLoading(false);
                    }
                })
                .catch((err: any) => {
                    console.log("error adding HR Setting: ", err);
                    formFailed();
                    setLoading(false);
                });

            setLoading(false);
        }).catch((err) => {
            formFailed();
            setLoading(false);
            console.log("Validation Error: ", err);
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        formFailed();
    };

    return (
        <>
            <Divider
                style={{
                    marginTop: "1em",
                    marginBottom: "1em",
                }}
            />

            <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Type"
                    name="type"
                    initialValue={type}
                    rules={[{ required: true, message: "" }]}
                >
                    <Input
                        readOnly
                    />
                </Form.Item>

                <Form.Item
                    label="Timestamp"
                    name="timestamp"
                    rules={[{ required: true, message: "" }]}
                    initialValue={dayjs().format("MMMM DD, YYYY - hh:mm A")}
                >
                    <Input
                        readOnly
                    />
                </Form.Item>

                {
                    (() => {
                        // periodic option
                        if (type === "Periodic Option") {
                            return (
                                <>
                                    <PeriodicOption />
                                </>
                            );
                        }

                        // evaluation campaign
                        if (type === "Evaluation Campaign") {
                            return (
                                <>
                                    <EvaluationCampaign periodNames={periodNames} data={data} periodicOptionsData={periodicOptionsData} />
                                </>
                            );
                        }

                        // monitoring period
                        if (type === "Monitoring Period") {
                            return (
                                <>
                                    <MonitoringPeriod periodNames={periodNames} data={data} periodicOptionsData={periodicOptionsData} />
                                </>
                            );
                        }

                        // leave type
                        if (type === "Leave Type") {
                            return (
                                <>
                                    <LeaveType />
                                </>
                            );
                        }

                        // leave state
                        if (type === "Leave State") {
                            return (
                                <>
                                    <LeaveState />
                                </>
                            );
                        }

                        // leave stage
                        if (type === "Leave Stage") {
                            return (
                                <>
                                    <LeaveStage />
                                </>
                            );
                        }

                        // shift type
                        if (type === "Shift Type") {
                            return (
                                <>
                                    <ShiftType />
                                </>
                            );
                        }

                        // competency definition
                        if (type === "Competency Definition") {
                            return (
                                <>
                                    <CompetencyDefinition />
                                </>
                            );
                        }

                        // position definition
                        if (type === "Position Definition") {
                            return (
                                <>
                                    <PositionDefinition />
                                </>
                            );
                        }

                        // competency position association
                        if (type === "Competency Position Association") {
                            return (
                                <>
                                    <CompetencyPositionAssociation cid={cid} pid={pid} />
                                </>
                            );
                        }

                        // department
                        if (type === "Department") {
                            return (
                                <>
                                    <Department employees={employees} objectives={objectives} sections={sections} />
                                </>
                            );
                        }

                        // section
                        if (type === "Section") {
                            return (
                                <>
                                    <Section departments={departments} employees={employees} />
                                </>
                            );
                        }
                    })()
                }

                <Row align={"middle"} justify={"center"}>
                    <Form.Item>
                        <Button
                            type='primary'
                            loading={loading}
                            htmlType='submit'
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </>
    );
}

// periodic option settings
function PeriodicOption() {
    return (
        <>
            <Form.Item
                label="Period Name"
                name="periodName"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Year"
                name="year"
                rules={[{ required: true, message: "" }]}
            >
                <InputNumber
                    style={{ width: "100%" }}
                    min={dayjs().year()}
                />
            </Form.Item>

            <Divider>
                <Typography variant='h6'>
                    Evaluations
                </Typography>
            </Divider>

            <Form.List name="evaluations">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Row
                                key={key}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'baseline',
                                }}
                                className='boxShadowMP2'
                            >
                                <Col xs={20} xl={7} xxl={7}>
                                    <Form.Item
                                        {...restField}
                                        label="Round"
                                        name={[name, 'round']}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Input placeholder='Round Name' />
                                    </Form.Item>
                                </Col>

                                <Col xs={20} xl={7} xxl={7}>
                                    <Form.Item
                                        {...restField}
                                        label={"From"}
                                        name={[name, 'from']}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Select
                                            style={{
                                                width: "100%",
                                            }}
                                            options={months.map((month) => ({ label: month, value: month }))}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={20} xl={7} xxl={7}>
                                    <Form.Item
                                        {...restField}
                                        label={"To"}
                                        name={[name, 'to']}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Select
                                            style={{
                                                width: "100%",
                                            }}
                                            options={months.map((month) => ({ label: month, value: month }))}
                                        />
                                    </Form.Item>
                                </Col>

                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Row>
                        ))}
                        <Row align={"middle"} justify={"center"}>
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                >
                                    Add
                                </Button>
                            </Form.Item>
                        </Row>
                    </>
                )}
            </Form.List>
        </>
    )
}

// evaluation campaign settings
function EvaluationCampaign(props: any) {
    const [roundOptions, setRoundOptions] = useState<any[]>([]);

    useEffect(() => {
        if (props !== undefined && props.data !== undefined && props.periodicOptionsData !== undefined) {
            const periodicOptionsData: any[] = props.periodicOptionsData;
            // console.log("periodicOptionsData: ", periodicOptionsData);

            const filteredOptionsData: any = periodicOptionsData.find(period => period.periodName === props.data.period);
            // console.log("filteredOptionsData: ", filteredOptionsData);

            if (filteredOptionsData) {
                const evaluations: any[] = filteredOptionsData.evaluations;

                const options: any[] = evaluations.map(evaluation => ({ label: evaluation.round, value: evaluation.round }));
                setRoundOptions(options);
            }
        }
    }, [props]);

    return (
        <>
            <Form.Item
                label="Period"
                name="period"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={props.periodNames ?? []}
                    onChange={(value) => {
                        const periodicOptionsData: any[] = props.periodicOptionsData;
                        const filteredOptionsData: any = periodicOptionsData.find(period => period.periodName === value);
                        const evaluations: any[] = filteredOptionsData.evaluations;

                        const options: any[] = evaluations.map(evaluation => ({ label: evaluation.round, value: evaluation.round }));
                        setRoundOptions(options);
                    }}
                />
            </Form.Item>

            <Form.Item
                label="Round"
                name="round"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={roundOptions}
                />
            </Form.Item>

            <Form.Item
                label="Campaign Name"
                name="campaignName"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>

            <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>
        </>
    );
}

// monitoring period settings
function MonitoringPeriod(props: any) {
    const [roundOptions, setRoundOptions] = useState<any[]>([]);

    return (
        <>
            <Form.Item
                label="Period"
                name="period"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={props.periodNames ?? []}
                    onChange={(value) => {
                        const periodicOptionsData: any[] = props.periodicOptionsData;
                        const filteredOptionsData: any = periodicOptionsData.find(period => period.periodName === value);
                        const evaluations: any[] = filteredOptionsData.evaluations;

                        const options: any[] = evaluations.map(evaluation => ({ label: evaluation.round, value: evaluation.round }));
                        setRoundOptions(options);
                    }}
                />
            </Form.Item>

            <Form.Item
                label="Round"
                name="round"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={roundOptions}
                />
            </Form.Item>

            <Form.Item
                label="Monitoring Period Name"
                name="monitoringPeriodName"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>

            <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>
        </>
    );
}

// leave type settings
function LeaveType() {
    return (
        <>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Authorized Days"
                name="authorizedDays"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>
        </>
    );
}

// leave state settings
function LeaveState() {
    return (
        <>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>
        </>
    );
}

// leave stage settings
function LeaveStage() {
    return (
        <>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>
        </>
    );
}

// shift type settings
function ShiftType() {
    return (
        <>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Working Days"
                name="workingDays"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={days.map((value) => ({ label: value, value: value }))}
                    mode='multiple'
                />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>
        </>
    );
}

// competency definition
function CompetencyDefinition() {
    return (
        <>
            <Form.Item
                label="Competency ID"
                name="cid"
                rules={[{ required: true, message: "" }]}
            >
                <Input readOnly />
            </Form.Item>

            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Competency Type"
                name="competencyType"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={["Soft Skill", "Hard Skill"].map(value => ({ label: value, value: value }))}
                />
            </Form.Item>


            <Form.Item
                label="Level"
                name="level"
            // rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>

            <Form.Item
                label="Start Date"
                name="startDate"
            // rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>

            <Form.Item
                label="End Date"
                name="endDate"
            // rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>
        </>
    );
}

// position definition
function PositionDefinition() {
    return (
        <>
            <Form.Item
                label="Position ID"
                name="pid"
                rules={[{ required: true, message: "" }]}
                initialValue={generateID()}
            >
                <Input readOnly />
            </Form.Item>

            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Responsibility"
                name="responsibility"
            // rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>

            <Form.Item
                label="Start Date"
                name="startDate"
            // rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>

            <Form.Item
                label="End Date"
                name="endDate"
            // rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>
        </>
    );
}

// competency position association
function CompetencyPositionAssociation({ pid, cid }: { pid: any[], cid: any[] }) {
    return (
        <>
            <Form.Item
                label="Position ID"
                name="pid"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={pid}
                />
            </Form.Item>

            <Form.Item
                label="Competency ID"
                name="cid"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    options={cid}
                />
            </Form.Item>

            <Form.Item
                label="Grade"
                name="grade"
                rules={[{ required: true, message: "" }]}
            >
                <InputNumber style={{ width: "100%" }} min={1} max={12} />
            </Form.Item>

            <Form.Item
                label="Threshold"
                name="threshold"
                rules={[{ required: true, message: "" }]}
            >
                <InputNumber style={{ width: "100%" }} min={1} max={5} />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>
        </>
    );
}

// department
function Department({ employees, sections, objectives }: { employees: any[], sections: any[], objectives: any[] }) {
    return (
        <>
            <Form.Item
                label="Department Name"
                name="name"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Department Size"
                name="size"
            // rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Department Head Name"
                name="deptHeadName"
            // rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Associated Employees"
                name="associatedEmployees"
            // rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={employees}
                    mode="multiple"
                />
            </Form.Item>

            <Form.Item
                label="Associated Sections"
                name="associatedSections"
            // rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={sections}
                    mode="multiple"
                />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>

            <Divider orientation='left'>
                KPI
            </Divider>

            <Form.List name="kpi">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => {
                            return (
                                <>
                                    <Row
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "baseline",
                                        }}
                                    >
                                        <Col xs={20} xl={6} xxl={6}>
                                            <Form.Item
                                                {...restField}
                                                // label={"Department KPI Year"}
                                                name={[name, 'deptKPIYear']}
                                                rules={[{ required: true, message: "" }]}
                                            >
                                                <Input
                                                    placeholder={"Department KPI Year"}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={20} xl={7} xxl={7}>
                                            <Form.Item
                                                {...restField}
                                                // label={"Department KPI Definition"}
                                                name={[name, 'deptKPIDefinition']}
                                                rules={[{ required: true, message: "" }]}
                                            >
                                                <Input
                                                    placeholder={"Department KPI Definition"}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={20} xl={8} xxl={8}>
                                            <Form.Item
                                                {...restField}
                                                // label={"Associated Company Objective"}
                                                name={[name, 'associatedCompanyObjective']}
                                                rules={[{ required: true, message: "" }]}
                                            >
                                                <Select
                                                    style={{ width: "100" }}
                                                    options={objectives}
                                                    placeholder={"Associated Company Objective"}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Row>
                                </>
                            );
                        })}

                        <Form.Item
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                Add
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </>
    );
}

// section
function Section({ departments, employees }: { departments: any[], employees: any[] }) {
    return (
        <>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Section ID"
                name="sectionID"
                rules={[{ required: true, message: "" }]}
                initialValue={generateID()}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Section Head Name"
                name="sectionHeadName"
            // rules={[{ required: true, message: "" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Related Department"
                name="relatedDept"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={departments}
                />
            </Form.Item>

            <Form.Item
                label="Associated Employees"
                name="associatedEmployees"
                // rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={employees}
                    mode='multiple'
                />
            </Form.Item>

            <Form.Item
                label="Active"
                name="active"
                rules={[{ required: true, message: "" }]}
            >
                <Select
                    style={{ width: "100" }}
                    options={["Yes", "No"].map((value) => ({ label: value, value: value }))}
                />
            </Form.Item>

            <Form.Item
                label="Start Date"
                name="startDate"
            // rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>

            <Form.Item
                label="End Date"
                name="endDate"
            // rules={[{ required: true, message: "" }]}
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format={"MMMM DD, YYYY"}
                />
            </Form.Item>
        </>
    );
}