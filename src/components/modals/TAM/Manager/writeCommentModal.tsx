import generateID from '@/backend/constants/generateID';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Divider, Form, Input, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import CustomModal from '../../customModal';
import { CommentData } from '@/backend/models/attendanceData';
import { EmployeeData } from '@/backend/models/employeeData';
import AppContext from '@/components/context/AppContext';
import { updateComment } from '@/backend/api/TAM/updateComment';

export default function WriteCommentModal(
    {
        docID,
        oldComments,
        open,
        setOpen,
    }: {
        docID: string,
        oldComments: any[],
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
                modalTitle='Write Comment'
                width={matches ? "50%" : "100%"}
            >
                <WriteComment setOpen={setOpen} docID={docID} oldComments={oldComments} />
            </CustomModal>
        </>
    );
}

function WriteComment(
    {
        setOpen,
        docID,
        oldComments,
    }: {
        setOpen: any,
        docID: string,
        oldComments: any[],
    }
) {
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;
    const employeeID: string = context.employeeID;

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

            const newComments: CommentData[] = [...oldComments];
            newComments.push({
                commentBy: employeeID,
                timestamp: dayjs(dayjs()).format("MMMM DD, YYYY"),
                comment: values.comment,
            });

            await updateComment(docID, newComments)
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
                    label="Comment"
                    name="comment"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input.TextArea rows={4} />
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
