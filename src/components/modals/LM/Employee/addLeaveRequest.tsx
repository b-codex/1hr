import React, { useEffect, useState } from 'react'
import CustomModal from '../../customModal';
import { DatePicker, Divider, Form, Input, Row, Select, Spin, Button, Modal, message } from 'antd';
import { Alert } from '@mui/material';
import generateID from '@/backend/constants/generateID';
import { db } from '@/backend/api/firebase';
import { groupBy } from '@/backend/constants/groupBy';
import { onSnapshot, collection, QuerySnapshot, DocumentData } from 'firebase/firestore';

export default function EmployeeAddLeaveRequestModal(
    {
        open,
        setOpen,
    }: {
        open: boolean,
        setOpen: any,
    }
) {
    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle='Add New Leave Request'
                width='50%'
            >
                <AddLeaveRequest setOpen={setOpen} />
            </CustomModal>
        </>
    );
}

function AddLeaveRequest(
    {
        setOpen,
    }: {
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

        setLeaveTypes(leaveTypes);
        setLeaveStages(leaveStages);
        setLeaveStates(leaveStates);

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
            });

            // console.log("values: ", values)

            // await updateAttendanceList(updatedAttendanceData, attendanceData.id)
            //     .then((res: boolean) => {
            //         console.log("res: ", res);

            //         if (res === true) {
            // success();
            // setLoading(false);
            // setOpen(false);
            // form.resetFields();

            //         }

            //         if (res === false) {
            // error();
            // setLoading(false);

            //         }
            //     })
            //     .catch((err: any) => {
            //         console.log("error updating attendance list: ", err);
            //         formFailed();
            //         setLoading(false);
            //     });

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
                    initialValue={generateID()}
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
                        addonAfter={"Days"}
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
                    rules={[{ required: true, message: "" }]}
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
                    rules={[{ required: true, message: "" }]}
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
