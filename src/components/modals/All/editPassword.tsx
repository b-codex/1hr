import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Divider, Form, Input, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import CustomModal from '../customModal';
import { updateEmployee } from '@/backend/api/HR-Manager/updateEmployee';

export default function EditPasswordModal(
    {
        open,
        setOpen,
        oldPassword,
        docID,
    }: {
        open: boolean,
        setOpen: any,
        oldPassword: string,
        docID: string,
    }
) {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle='Edit Password'
                width={matches ? "30%" : "100%"}
            >
                <EditPassword
                    oldPassword={oldPassword}
                    docID={docID}
                    setOpen={setOpen}
                />
            </CustomModal>
        </>
    );
}

function EditPassword(
    {
        oldPassword,
        docID,
        setOpen,
    }: {
        oldPassword: any,
        docID: string,
        setOpen: any,
    }
) {
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        if (oldPassword && docID) {
            form.setFieldValue('oldPassword', oldPassword);
        }
    }, [oldPassword, docID, form]);

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

            // console.log("values: ", values);

            const password: string = values.newPassword;

            await updateEmployee({ password: password }, docID)
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
                    label="Old Password"
                    name="oldPassword"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input.Password readOnly />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: "" }]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    rules={[
                        { required: true, message: "" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                    dependencies={['newPassword']}
                >
                    <Input.Password />
                </Form.Item>

                <Row align={"middle"} justify={"center"}>
                    <Form.Item>
                        <Button
                            type='primary'
                            loading={loading}
                            htmlType='submit'
                        >
                            Change Password
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </>
    );
}
