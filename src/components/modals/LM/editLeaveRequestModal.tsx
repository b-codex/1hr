import { updateLeaveRequest } from '@/backend/api/LM/updateLeaveRequest';
import { db } from '@/backend/api/firebase';
import { groupBy } from '@/backend/constants/groupBy';
import findDifferenceInDays from '@/backend/functions/differenceInDays';
import { LeaveRequestData } from '@/backend/models/leaveRequestData';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, DatePicker, Divider, Form, Input, Row, Select, message } from 'antd';
import dayjs from 'dayjs';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import CustomModal from '../customModal';

export default function EmployeeEditLeaveRequestModal(
    {
        open,
        setOpen,
        data,
        docID,
    }: {
        open: boolean,
        setOpen: any,
        data: LeaveRequestData,
        docID: string,
    }
) {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle='Edit Leave Request'
                width={matches ? "50%" : "100%"}
            >
                <EditLeaveRequest
                    data={data}
                    docID={docID}
                    setOpen={setOpen}
                />
            </CustomModal>
        </>
    );
}

function EditLeaveRequest(
    {
        data,
        docID,
        setOpen,
    }: {
        data: any,
        docID: string,
        setOpen: any,
    }
) {
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    // getting HR Settings from the database
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [leaveStages, setLeaveStages] = useState<any[]>([]);
    const [leaveStates, setLeaveStates] = useState<any[]>([]);

    useEffect(() => onSnapshot(collection(db, "hrSettings"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });
        const groupedSettings: any = groupBy("type", data);

        const leaveTypes: any[] = groupedSettings["Leave Type"] ?? [];
        const leaveStages: any[] = groupedSettings["Leave Stage"] ?? [];
        const leaveStates: any[] = groupedSettings["Leave State"] ?? [];

        setLeaveTypes(leaveTypes.filter(leaveType => leaveType.active === "Yes"));
        setLeaveStages(leaveStages.filter(leaveStage => leaveStage.active === "Yes"));
        setLeaveStates(leaveStates.filter(leaveState => leaveState.active === "Yes"));

    }), []);

    useEffect(() => {
        if (data && docID) {
            const keys: string[] = Object.keys(data);
            keys.forEach((key: string) => {
                if (key === "firstDayOfLeave" || key === "lastDayOfLeave" || key === "dateOfReturn") {
                    form.setFieldValue(key, dayjs(data[key]));
                }
                else {
                    form.setFieldValue(key, data[key]);
                }
            });
        }
    }, [data, docID, form]);

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
                if (key === "firstDayOfLeave" || key === "lastDayOfLeave" || key === "dateOfReturn") {
                    values[key] = dayjs(values[key]).format("MMMM DD, YYYY");
                }
            });

            // console.log("values: ", values);

            await updateLeaveRequest(values, data.id)
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
                    console.log("error adding leave request: ", err);
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
                    label="Leave Request ID"
                    name="leaveRequestID"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input
                        readOnly
                    />
                </Form.Item>

                <Form.Item
                    label="Leave State"
                    name="leaveState"
                    rules={[{ required: true, message: "" }]}
                >
                    <Select
                        style={{ width: "100%" }}
                        dropdownStyle={{ zIndex: 2000, }}
                        options={leaveStates.map(leaveState => ({ label: leaveState.name, value: leaveState.name }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Leave Stage"
                    name="leaveStage"
                    rules={[{ required: true, message: "" }]}
                >
                    <Select
                        style={{ width: "100%" }}
                        dropdownStyle={{ zIndex: 2000, }}
                        options={leaveStages.map(leaveStage => ({ label: leaveStage.name, value: leaveStage.name }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Leave Type"
                    name="leaveType"
                    rules={[{ required: true, message: "" }]}
                >
                    <Select
                        style={{ width: "100%" }}
                        dropdownStyle={{ zIndex: 2000, }}
                        options={leaveTypes.map(leaveType => ({ label: leaveType.name, value: leaveType.name }))}
                        onChange={(value) => {
                            const res: any = leaveTypes.find(leaveType => leaveType.name === value);
                            form.setFieldValue('authorizedDays', res.authorizedDays);
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Authorized Days"
                    name="authorizedDays"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input
                        style={{ width: "100%" }}
                        disabled
                    />
                </Form.Item>

                <Form.Item
                    label="First Day of Leave"
                    name="firstDayOfLeave"
                    rules={[{ required: true, message: "" }]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        format={"MMMM DD, YYYY"}
                        onChange={(date) => {
                            const formValues: any = form.getFieldsValue();

                            const lastDayOfLeave: dayjs.Dayjs | null = formValues.lastDayOfLeave;

                            if (lastDayOfLeave !== undefined) {
                                const diff: number = findDifferenceInDays(date as dayjs.Dayjs, lastDayOfLeave as dayjs.Dayjs);

                                form.setFieldValue('numberOfLeaveDaysRequested', diff + 1);
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Last Day of Leave"
                    name="lastDayOfLeave"
                    rules={[{ required: true, message: "" }]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        format={"MMMM DD, YYYY"}
                        onChange={(date) => {
                            const formValues: any = form.getFieldsValue();

                            const firstDayOfLeave: dayjs.Dayjs | null = formValues.firstDayOfLeave;

                            if (firstDayOfLeave !== undefined) {
                                const diff: number = findDifferenceInDays(date as dayjs.Dayjs, firstDayOfLeave as dayjs.Dayjs);

                                form.setFieldValue('numberOfLeaveDaysRequested', diff + 1);
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Date of Return"
                    name="dateOfReturn"
                    rules={[{ required: true, message: "" }]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        format={"MMMM DD, YYYY"}
                    />
                </Form.Item>

                <Form.Item
                    label="Number of Leave Days Requested"
                    name="numberOfLeaveDaysRequested"
                    // rules={[{ required: true, message: "" }]}
                    initialValue={0}
                >
                    <Input
                        disabled
                        addonAfter={"Days"}
                    />
                </Form.Item>

                <Form.Item
                    label="Balance Leave Days"
                    name="balanceLeaveDays"
                // rules={[{ required: true, message: "" }]}
                >
                    <Input
                        style={{ width: "100%" }}
                        disabled
                        addonAfter={"Days"}
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
