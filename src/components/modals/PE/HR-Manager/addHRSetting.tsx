import { addHRSetting, db } from '@/backend/api/firebase';
import generateID from '@/backend/constants/generateID';
import { groupBy } from '@/backend/constants/groupBy';
import findDifferenceInDays from '@/backend/functions/differenceInDays';
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Space, message } from 'antd';
import dayjs from 'dayjs';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import CustomModal from '../../customModal';
import { addLeaveRequest } from '@/backend/api/LM/addLeaveRequest';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { months } from '@/backend/constants/months';
import { Typography } from '@mui/material';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default function HRAddSetting(
    {
        open,
        setOpen,
        type,
    }: {
        open: boolean,
        setOpen: any,
        type: string,
    }
) {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle={`Add Setting - ${type}`}
                width={matches ? "70%" : "100%"}
            >
                <AddSetting setOpen={setOpen} type={type} />
            </CustomModal>
        </>
    );
}

function AddSetting(
    {
        setOpen,
        type,
    }: {
        setOpen: any,
        type: string,
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

            const evaluations: any[] = values['evaluations'] ?? [];
            evaluations.forEach((evaluation: any) => {
                const evaluationPeriod: any[] = evaluation.evaluationPeriod;
                const monitoringPeriod: any[] = evaluation.monitoringPeriod;

                evaluationPeriod.forEach((e: any, i: number) => {
                    const formatted: string = moment(e).format("MMMM DD, YYYY");
                    evaluationPeriod[i] = formatted;
                });

                monitoringPeriod.forEach((m: any, i: number) => {
                    const formatted: string = moment(m).format("MMMM DD, YYYY");
                    monitoringPeriod[i] = formatted;
                });
            });

            // console.log("values: ", values);

            await addHRSetting(values)
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
                    console.log("error adding HR Setting: ", err);
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
                    label="Type"
                    name="type"
                    initialValue={type}
                    rules={[{ required: true, message: "" }]}
                >
                    <Input
                        readOnly
                    />
                </Form.Item>

                <Form.Item
                    label="Timestamp"
                    name="timestamp"
                    rules={[{ required: true, message: "" }]}
                    initialValue={dayjs().format("MMMM DD, YYYY - hh:mm A")}
                >
                    <Input
                        readOnly
                    />
                </Form.Item>

                <Form.Item
                    label="Period Name"
                    name="periodName"
                    rules={[{ required: true, message: "" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Year"
                    name="year"
                    rules={[{ required: true, message: "" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={dayjs().year()}
                    />
                </Form.Item>

                <Divider>
                    <Typography variant='h6'>
                        Evaluations
                    </Typography>
                </Divider>

                <Form.List name="evaluations">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row
                                    key={key}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        alignItems: 'baseline',
                                    }}
                                    className='boxShadowMP2'
                                >
                                    <Col xs={20} xl={7} xxl={7}>
                                        <Form.Item
                                            {...restField}
                                            label="Round"
                                            name={[name, 'round']}
                                            rules={[{ required: true, message: '' }]}
                                        >
                                            <Input placeholder='Round Name' />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={20} xl={7} xxl={7}>
                                        <Form.Item
                                            {...restField}
                                            label={"From"}
                                            name={[name, 'from']}
                                            rules={[{ required: true, message: '' }]}
                                        >
                                            <Select
                                                style={{
                                                    width: "100%",
                                                }}
                                                options={months.map((month) => ({ label: month, value: month }))}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={20} xl={7} xxl={7}>
                                        <Form.Item
                                            {...restField}
                                            label={"To"}
                                            name={[name, 'to']}
                                            rules={[{ required: true, message: '' }]}
                                        >
                                            <Select
                                                style={{
                                                    width: "100%",
                                                }}
                                                options={months.map((month) => ({ label: month, value: month }))}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={20} xl={10} xxl={10}>
                                        <Form.Item
                                            {...restField}
                                            label={"Evaluation Period"}
                                            name={[name, 'evaluationPeriod']}
                                            rules={[{ required: true, message: '' }]}
                                        >
                                            <RangePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                format={"MMMM DD, YYYY"}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={20} xl={10} xxl={10}>
                                        <Form.Item
                                            {...restField}
                                            label={"Monitoring Period"}
                                            name={[name, 'monitoringPeriod']}
                                            rules={[{ required: true, message: '' }]}
                                        >
                                            <RangePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                format={"MMMM DD, YYYY"}
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
        </>
    );
}
