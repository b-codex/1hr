/* eslint-disable @next/next/no-img-element */
import { login } from '@/backend/api/auth/login'
import { Button, Col, Form, Input, Row, Spin, message } from 'antd'
import type { NextPage } from 'next'
import { useRouter } from "next/router"
import { useEffect, useState } from 'react'

const Login: NextPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    // check login state
    useEffect(() => {
        const loggedIn: string = localStorage.getItem('loggedIn') as string;
        // console.log("Logged In: ", loggedIn);

        if (loggedIn === null || loggedIn === undefined) {
            setPageLoading(false);
        }
        else {
            router.push('/profile');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        console.log('user: ', response);

                        const user = response;
                        delete user.password;

                        localStorage.setItem("user", JSON.stringify(user));
                        localStorage.setItem("loggedIn", 'true');

                        success();
                        
                        //! check role and push route accordingly
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

    if (pageLoading === true) {
        return (
            <>
                <Row
                    style={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        justifyItems: 'center',
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
