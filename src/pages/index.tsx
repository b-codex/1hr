/* eslint-disable @next/next/no-img-element */
import { login } from '@/backend/api/auth/login'
import { EmployeeData } from '@/backend/models/employeeData'
import AppContext from '@/components/context/AppContext'
import { Button, Col, Form, Input, Row, Spin, message } from 'antd'
import type { NextPage } from 'next'
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from 'react'

const Login: NextPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;
    const employeeID: string = context.employeeID;

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    useEffect(() => {
        // console.log(context);
        if (context.user) {
            router.push('/profile');
        }
        else {
            setPageLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.user]);

    const success = () => {
        message.success('Logged in.');
    };

    const error = () => {
        message.error("Account Not Found!");
    };

    const formFailed = () => {
        message.error('Please Make Sure All Fields Are Filled');
    };

    const onFinish = async (values: any) => {
        form.validateFields().then(async (values: any) => {
            setLoading(true);
            // console.log("values: ", values);

            await login(values.employeeID, values.password)
                .then((response: any) => {
                    // console.log("Response: ", response);

                    if (response === undefined || response === null) {
                        error();
                        setLoading(false);
                    }
                    if (response !== undefined && response !== null) {
                        console.log("Login Success.");
                        // console.log('user: ', response);

                        const user: EmployeeData = response;
                        delete user.password;

                        context.login(user);

                        localStorage.setItem("user", JSON.stringify(user));
                        localStorage.setItem("loggedIn", 'true');

                        success();

                        router.push('/profile');
                        // setLoading(false);
                    }
                });

            // setLoading(false);

        }).catch((info: any) => {
            message.error('Unable to verify your credentials. Please try again.');
            console.log('Validate Failed:', info);
            setLoading(false);
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        formFailed();
    };

    if (pageLoading) {
        return (
            <>
                <Row
                    style={{
                        width: "calc(100vw - 1rem)",
                        height: "calc(100vh - 1rem)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin />
                </Row>
            </>
        );
    }

    else {
        return (
            <>
                <Row
                    style={{
                        width: "100vw",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Col
                        xs={20}
                        xl={8}
                        xxl={8}
                        style={{
                            width: "100%",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Form
                            form={form}
                            key={"form"}
                            name="login"
                            labelCol={{ span: 6 }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            style={{
                                paddingTop: "4rem",
                                paddingBottom: "2rem",
                                paddingLeft: "4rem",
                                paddingRight: "4rem",
                                width: "100%",
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                                boxShadow: "0px 0px 10px #00000029",
                            }}
                        >
                            <Row
                                style={{
                                    width: "100%",
                                    marginTop: "1rem",
                                    marginBottom: "3rem",
                                }}
                                align="middle"
                                justify='center'
                            >
                                <img src="/logo.png" alt="" width={"45%"} />
                            </Row>

                            <Form.Item
                                label='Employee ID'
                                name="employeeID"
                                rules={[{ required: true, message: "Required!" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='Password'
                                name="password"
                                rules={[{ required: true, message: "Required!" }]}
                            >
                                <Input.Password minLength={4} />
                            </Form.Item>

                            <Row
                                style={{ width: "100%", }}
                                align="middle"
                                justify='center'
                            >
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    loading={loading}
                                >
                                    Sign In
                                </Button>
                            </Row>

                        </Form>
                    </Col>
                </Row>
            </>
        );
    }
}

export default Login
