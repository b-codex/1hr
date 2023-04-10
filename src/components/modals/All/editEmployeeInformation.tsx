import { updateEmployee } from '@/backend/api/firebase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, DatePicker, Divider, Form, Input, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import CustomModal from '../customModal';
import { employeeInfoChangeRequestAdd } from '@/backend/api/Profile/employeeInfoChangeRequestAdd';
import dayjs from 'dayjs';

export default function EditEmployeeInformationModal(
    {
        open,
        setOpen,
        data,
        docID,
    }: {
        open: boolean,
        setOpen: any,
        data: any,
        docID: string,
    }
) {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle='Edit Employee Information'
                width={matches ? "30%" : "100%"}
            >
                <EditEmployeeInformation
                    data={data}
                    docID={docID}
                    setOpen={setOpen}
                />
            </CustomModal>
        </>
    );
}

function EditEmployeeInformation(
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

    useEffect(() => {
        if (data && docID) {
            const keys: string[] = Object.keys(data);
            if (keys.length > 0) {
                keys.forEach(key => {
                    form.setFieldValue(key, data[key]);
                });
            }
        }
    }, [data, docID, form]);

    const success = () => {
        message.info('Change Requested.');
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

            // console.log("values: ", values);
            values.birthDate = dayjs(values.birthDate).format("MMMM DD, YYYY");

            await employeeInfoChangeRequestAdd(values)
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
                    console.log("error changing password: ", err);
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
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Birth Date"
                    name="birthDate"
                    rules={[{ required: true, message: "" }]}
                >
                    <DatePicker
                        style={{ width: "100%", }}
                        format={"MMMM DD, YYYY"}
                    />
                </Form.Item>

                <Form.Item
                    label="Birth Place"
                    name="birthPlace"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Marital Status"
                    name="maritalStatus"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Personal Phone Number"
                    name="personalPhoneNumber"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Personal Email"
                    name="personalEmail"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Bank Account"
                    name="bankAccount"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Tin Number"
                    name="tinNumber"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Row align={"middle"} justify={"center"}>
                    <Form.Item>
                        <Button
                            type='primary'
                            loading={loading}
                            htmlType='submit'
                        >
                            Submit Change Request
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </>
    );
}
