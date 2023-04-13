import { addObjective } from '@/backend/api/PE/addObjective';
import { db } from '@/backend/api/firebase';
import generateID from '@/backend/constants/generateID';
import { groupBy } from '@/backend/constants/groupBy';
import { EmployeeData } from '@/backend/models/employeeData';
import { ObjectiveData } from '@/backend/models/objectiveData';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, DatePicker, Divider, Form, Input, InputNumber, Row, Select, message } from 'antd';
import dayjs from 'dayjs';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import CustomModal from '../../customModal';
import { updateObjective } from '@/backend/api/PE/updateObjective';

export default function ManagerEditObjectiveModal(
    {
        open,
        setOpen,
        data,
    }: {
        open: boolean,
        setOpen: any,
        data: ObjectiveData,
    }
) {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle='Edit Objective'
                width={matches ? "50%" : "100%"}
            >
                <EditObjective setOpen={setOpen} data={data} />
            </CustomModal>
        </>
    );
}

function EditObjective(
    {
        setOpen,
        data,
    }: {
        setOpen: any,
        data: any,
    }
) {
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        if (data) {
            const keys: string[] = Object.keys(data);
            keys.forEach(key => {
                if (key === "targetDate" && data[key]) form.setFieldValue(key, dayjs(data[key], "MMMM DD, YYYY"));
                else form.setFieldValue(key, data[key]);
            });
        }
    }, [data, form]);

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

            await updateObjective(values, data.id)
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
                    console.log("error updating objective: ", err);
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
