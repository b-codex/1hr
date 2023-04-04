import React, { useEffect, useState } from 'react'
import CustomModal from '../../customModal';
import { DatePicker, Divider, Form, Input, Row, Select, Spin } from 'antd';
import { Alert, Button } from '@mui/material';
import generateID from '@/backend/constants/generateID';
import { db } from '@/backend/api/firebase';
import { groupBy } from '@/backend/constants/groupBy';
import { onSnapshot, collection, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { LeaveRequestData } from '@/backend/models/leaveRequestData';

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
    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle='Edit New Leave Request'
                // width='40%'
            >
                <EditLeaveRequest
                    data={data}
                    docID={docID}
                />
            </CustomModal>
        </>
    );
}

function EditLeaveRequest(
    {
        data,
        docID,
    }: {
        data: any,
        docID: string,
    }
) {
    const [loading, setLoading] = useState<boolean>(false);
    const [formValidated, setFormValidated] = useState<string>("");

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

    useEffect(() => {
        if (data && docID) {
            const keys: string[] = Object.keys(data);
            keys.forEach((key: string) => {
                if (key === "firstDayOfLeave" || key === "lastDayOfLeave" || key === "dateOfReturn") {

                }
                else {
                    form.setFieldValue(key, data[key]);
                }
            });
        }
    }, [data, docID, form]);

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
            </Form>

            <Divider style={{ marginTop: "2em", marginBottom: "2em" }} />

            <Row align={"middle"} justify={"end"}>

                {
                    (() => {
                        if (formValidated === "") {
                            return (
                                <>
                                </>
                            );
                        }

                        if (formValidated === "Validation Error") {
                            return (
                                <>
                                    <Alert severity="error" sx={{ width: '100%' }}>
                                        Check your form inputs and try again.
                                    </Alert>
                                </>
                            );
                        }

                        if (formValidated === "Update Error") {
                            return (
                                <>
                                    <Alert severity="error" sx={{ width: '100%' }}>
                                        Request failed. Try saving again.
                                    </Alert>
                                </>
                            );
                        }
                    })()
                }

                <Button
                    variant='contained'
                    disabled={loading}
                    onClick={() => {
                        form.validateFields().then(async (values) => {
                            setLoading(true);

                            const keys: string[] = Object.keys(values);
                            keys.forEach((key) => {
                                if (values[key] === undefined) values[key] = null;
                            });


                            // await updateAttendanceList(updatedAttendanceData, attendanceData.id)
                            //     .then((res: boolean) => {
                            //         console.log("res: ", res);

                            //         if (res === true) {
                            //             setOpen(false);
                            //             setLoading(false);
                            //             message.success("Updated.");
                            //             form.resetFields();
                            //             setFormValidated("");
                            //         }

                            //         if (res === false) {
                            //             setFormValidated("Update Error");
                            //             setLoading(false);
                            //         }
                            //     })
                            //     .catch((err: any) => {
                            //         console.log("error updating attendance list: ", err);
                            //         setFormValidated("Update Error");
                            //         setLoading(false);
                            //     });

                            setLoading(false);
                        }).catch((err) => {
                            setLoading(false);
                            setFormValidated("Validation Error");
                            console.log("Validation Error: ", err);
                        });
                    }}
                >
                    {loading ? <Spin size='small' /> : "Submit"}
                </Button>

            </Row>
        </>
    );
}
