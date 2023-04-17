import { addObjective } from '@/backend/api/Manager/addObjective';
import { db } from '@/backend/api/firebase';
import generateID from '@/backend/constants/generateID';
import { groupBy } from '@/backend/constants/groupBy';
import { EmployeeData } from '@/backend/models/employeeData';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, message } from 'antd';
import dayjs from 'dayjs';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import CustomModal from '../customModal';

export default function ManagerAddObjectiveModal(
    {
        open,
        setOpen,
    }: {
        open: boolean,
        setOpen: any,
    }
) {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle='Add Objective'
                width={matches ? "50%" : "100%"}
            >
                <EditObjective setOpen={setOpen} />
            </CustomModal>
        </>
    );
}

function EditObjective(
    {
        setOpen,
    }: {
        setOpen: any,
    }
) {
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const [employees, setEmployees] = useState<any[]>([]);
    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });


        const options: any[] = data.map((user: EmployeeData) => ({ label: user.employeeID, value: user.employeeID }));

        setEmployees(options);
    }), []);

    const [periodicOptionsData, setPeriodicOptionsData] = useState<any>([]);
    const [periodNames, setPeriodNames] = useState<any[]>([]);
    const [roundOptions, setRoundOptions] = useState<any[]>([]);

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
    }), []);

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
                if (key === "targetDate" && values["targetDate"]) {
                    values[key] = dayjs(values[key]).format("MMMM DD, YYYY");
                }
            });

            // console.log("values: ", values);

            await addObjective(values)
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
                    console.log("error adding objective: ", err);
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
                    label="Timestamp"
                    name="timestamp"
                    initialValue={dayjs().format("MMMM DD, YYYY")}
                    rules={[{ required: true, message: "" }]}
                >
                    <Input readOnly />
                </Form.Item>

                <Form.Item
                    label="Objective ID"
                    name="objectiveID"
                    initialValue={generateID()}
                    rules={[{ required: true, message: "" }]}
                >
                    <Input readOnly />
                </Form.Item>

                <Form.Item
                    label="State"
                    name="state"
                    rules={[{ required: true, message: "" }]}
                    initialValue={"Open"}
                >
                    <Select
                        style={{ width: "100%" }}
                        dropdownStyle={{ zIndex: 2000, }}
                        options={[].map(value => ({ label: value, value: value }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Related KPI"
                    name="relatedKPI"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Specificity"
                    name="specificity"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Measurability"
                    name="measurability"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Attainability"
                    name="attainability"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Relevancy"
                    name="relevancy"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Time Period"
                    name="timePeriod"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Target Date"
                    name="targetDate"
                // rules={[{ required: true, message: "" }]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        format={"MMMM DD, YYYY"}
                    />
                </Form.Item>

                <Form.Item
                    label="Completion Rate"
                    name="completionRate"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Performance Year"
                    name="performanceYear"
                    // rules={[{ required: true, message: "" }]}
                    initialValue={dayjs().year()}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Objective Result"
                    name="objectiveResult"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Period"
                    name="period"
                    rules={[{ required: true, message: "" }]}
                >
                    <Select
                        style={{ width: "100%" }}
                        options={periodNames ?? []}
                        onChange={(value) => {
                            const filteredOptionsData: any = periodicOptionsData.find((period: any) => period.periodName === value);
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
                    label="Employees"
                    name="employees"
                    rules={[{ required: true, message: "" }]}
                >
                    <Select
                        style={{ width: "100%" }}
                        options={employees}
                        mode='multiple'
                    />
                </Form.Item>

                <Form.Item
                    label="Completion Rate"
                    name="completionRate"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Divider orientation='left'>
                    Employee Comment
                </Divider>

                <Form.List name="employeeComment">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => {
                                return (
                                    <>
                                        <Row
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "space-around",
                                                alignItems: "baseline",
                                            }}
                                        >
                                            <Col xs={20} xl={10} xxl={10}>
                                                <Form.Item
                                                    {...restField}
                                                    label={"Timestamp"}
                                                    name={[name, 'timestamp']}
                                                    initialValue={dayjs().format("MMMM DD, YYYY h:mm A")}
                                                >
                                                    <Input readOnly />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={20} xl={10} xxl={10}>
                                                <Form.Item
                                                    {...restField}
                                                    label={"Comment"}
                                                    name={[name, 'comment']}
                                                    rules={[{ required: true, message: '' }]}
                                                >
                                                    <Input.TextArea rows={2} />
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

                <Divider orientation='left'>
                    Manager Comment
                </Divider>

                <Form.List name="managerComment">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => {
                                return (
                                    <>
                                        <Row
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "space-around",
                                                alignItems: "baseline",
                                            }}
                                        >
                                            <Col xs={20} xl={10} xxl={10}>
                                                <Form.Item
                                                    {...restField}
                                                    label={"Timestamp"}
                                                    name={[name, 'timestamp']}
                                                    initialValue={dayjs().format("MMMM DD, YYYY h:mm A")}
                                                >
                                                    <Input readOnly />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={20} xl={10} xxl={10}>
                                                <Form.Item
                                                    {...restField}
                                                    label={"Comment"}
                                                    name={[name, 'comment']}
                                                    rules={[{ required: true, message: '' }]}
                                                >
                                                    <Input.TextArea rows={2} />
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
