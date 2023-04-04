import React, { useEffect, useState } from 'react'
import CustomModal from '../../customModal';
import { Typography } from '@mui/material';
import InfoCard from '@/components/shared/InfoCard';
import { Button, Col, Divider, Form, Input, Row, Select, Space, message } from 'antd';
import { AttendanceData } from '@/backend/models/attendanceData';
import compareMonths from '@/backend/functions/compareMonths';
import { months } from '@/backend/constants/months';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { updateAttendanceList } from '@/backend/api/TAM/updateAttendanceList';

export default function EmployeeRequestModificationModal(
    {
        open,
        setOpen,
        month,
        dateList,
        valueList,
        data,
    }: {
        open: boolean,
        setOpen: any,
        month: string,
        dateList: any[],
        valueList: any[],
        data: any,
    }
) {
    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle={`Request Modification For ${month}`}
            >
                <RequestModification
                    setOpen={setOpen}
                    dateList={dateList}
                    valueList={valueList}
                    data={data}
                />
            </CustomModal>
        </>
    );
}

function RequestModification(
    {
        setOpen,
        dateList,
        valueList,
        data,
    }: {
        setOpen: any,
        dateList: any[],
        valueList: any[],
        data: any,
    }
) {

    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const [options, setOptions] = useState<any[]>([]);
    useEffect(() => {
        if (data) {
            const attendanceData: AttendanceData = data;

            const attendance: any = attendanceData.attendance;
            const months: string[] = Object.keys(attendance);
            const comparedMonths: string[] = compareMonths(months);
            const month1: string = comparedMonths[0] === "January" && comparedMonths[1] === "December" ? comparedMonths[1] : comparedMonths[0];
            const month2: string = comparedMonths[0] === "January" && comparedMonths[1] === "December" ? comparedMonths[0] : comparedMonths[1];

            const month1Data: any = attendance[month1];
            const month2Data: any = attendance[month2];

            const month1Days: string[] = Object.keys(month1Data);
            const month2Days: string[] = Object.keys(month2Data);

            const options: any[] = [];
            month1Days.forEach((day) => options.push({ label: `${month1} ${day}`, value: `${month1} ${day}`, }));
            month2Days.forEach((day) => options.push({ label: `${month2} ${day}`, value: `${month2} ${day}`, }));

            setOptions(options);
        }
    }, []);

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

            // const keys: string[] = Object.keys(values);
            // keys.forEach((key) => {
            //     if (values[key] === undefined) values[key] = null;
            // });

            const modifications: any[] = values.modifications;
            if (modifications.length === 0) {
                message.warning("Nothing to modify");
            }
            if (modifications.length > 0) {
                const update: AttendanceData = {
                    employeeID: data.employeeID,
                    attendancePeriod: data.attendancePeriod,
                    year: data.year,
                    state: data.state,
                    comments: data.comments,
                    attendance: data.attendance,
                    overtime: data.overtime,
                    modificationRequested: true,
                    modifications: modifications,
                    stage: data.stage,
                    associatedShiftType: data.associatedShiftType,
                };

                await updateAttendanceList(update, data.id)
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
                        console.log("error updating modifications on the attendance list: ", err);
                        formFailed();
                        setLoading(false);
                    });

            }
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
        <div style={{ padding: "1em" }}>
            <InfoCard title='Information' width='100%'>
                <Typography
                    component="h5"
                    style={{
                        fontSize: "14px",
                    }}
                >
                    Please choose <b>P</b> for <em>Present</em>, <b>H</b> for <em>Half Day</em>, <b>A</b> for <em>Absent</em>
                </Typography>

                <Divider />

                <Typography
                    component="h5"
                    style={{
                        fontSize: "14px",
                    }}
                >
                    Existing data will be replaced with the new data.
                </Typography>
            </InfoCard>

            <Form
                form={form}
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.List name="modifications">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "baseline",
                                    }}
                                >
                                    <Col xs={24} xl={7} xxl={7}>
                                        <Form.Item
                                            {...restField}
                                            label="Date"
                                            name={[name, 'date']}
                                            rules={[{ required: true, message: '' }]}
                                        >
                                            <Select
                                                style={{ width: "100%" }}
                                                dropdownStyle={{ zIndex: 2000, }}
                                                options={options}
                                                onChange={(d: string) => {
                                                    const date = new Date(d);
                                                    const month = months[date.getMonth()];
                                                    const day = date.getDate();

                                                    const attendanceData: AttendanceData = data;

                                                    const attendance: any = attendanceData.attendance;
                                                    const old: string | null = attendance[month][day];

                                                    form.setFieldValue(["modifications", key, 'old'], old);
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} xl={7} xxl={7}>
                                        <Form.Item
                                            {...restField}
                                            label="Old Presence"
                                            name={[name, 'old']}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} xl={7} xxl={7}>
                                        <Form.Item
                                            {...restField}
                                            label="New Presence"
                                            name={[name, 'new']}
                                            rules={[{ required: true, message: '' }]}
                                        >
                                            <Select
                                                style={{ width: "100%" }}
                                                options={['P', 'H', 'A'].map(value => ({ label: value, value: value }))}
                                                dropdownStyle={{ zIndex: 2000 }}
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
        </div>
    );
}
