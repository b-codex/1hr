import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Divider, Form, Radio, RadioChangeEvent, Row, Space, message } from 'antd';

import { db } from '@/backend/api/firebase';
import { EmployeeData } from '@/backend/models/employeeData';
import AppContext from '@/components/context/AppContext';
import DashboardCard from '@/components/shared/DashboardCard';
import { groupBy } from '@/backend/constants/groupBy';
import { CompetencyPositionAssociationData } from '@/backend/models/competencyPositionAssociation';
import { CompetencyDefinitionData } from '@/backend/models/competencyDefinitionData';
import InfoCard from '@/components/shared/InfoCard';
import { CompetencyAssessmentData } from '@/backend/models/competencyAssessmentData';
import dayjs from 'dayjs';
import { addCompetencyAssessment } from '@/backend/api/PE/addCompetencyAssessment';

const PECompetency = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;
    const employeeID: string = context.employeeID;

    const [competencies, setCompetencies] = useState<CompetencyDefinitionData[]>([]);
    const [competencyType, setCompetencyType] = useState<any>();

    useEffect(() => onSnapshot(collection(db, "hrSettings"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        /* Sorting the data by date. */
        data.sort((a, b) => {
            let date1: moment.Moment = moment(`${a.timestamp} ${a.year}`, "MMMM YYYY");
            let date2: moment.Moment = moment(`${b.timestamp} ${b.year}`, "MMMM YYYY");

            return date1.isBefore(date2) ? -1 : 1;
        });

        const groupedSettings: any = groupBy("type", data);

        const competencies: CompetencyDefinitionData[] = groupedSettings["Competency Definition"] ?? [];
        data.map((doc) => {
            const cd = competencies.find((competency) => competency.cid === doc.cid);
            doc.cd = cd;
        });

        // console.log(competencies)
        const competencyType: any = groupBy("competencyType", competencies);
        setCompetencyType(competencyType);

        const CPA: any[] = groupedSettings['Competency Position Association'] ?? [];
        const filteredForCurrentEmployee: CompetencyPositionAssociationData[] = CPA.filter((association: CompetencyPositionAssociationData) => association.pid === employeeData.employmentPosition);

        setDataSource(filteredForCurrentEmployee);
    }), [employeeID]);

    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

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

            // console.log("values: ", values);

            const data: CompetencyAssessmentData = {
                timestamp: dayjs().format("MMMM DD, YYYY h:mm A"),
                for: employeeID,
                assessment: [
                    {
                        evaluatedBy: employeeID,
                        competencyValues: values,
                    },
                ],
            };

            // console.log("data: ", data);

            await addCompetencyAssessment(data)
                .then((res: boolean) => {

                    if (res === true) {
                        success();
                        setLoading(false);
                        // form.resetFields();
                    }

                    if (res === false) {
                        // error();
                        message.warning("You are not allowed to submit an assessment again.");
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
            <DashboardCard title="Competency Assessment">
                <Box sx={{ overflow: 'auto', width: { xs: 'auto', sm: 'auto' } }} p={"1em"}>

                    <Row align={"middle"} justify={"space-around"}>
                        <Col xs={20} xl={7} xxl={7}>
                            <InfoCard title='Information' width='70%'>
                                <Radio
                                    value={1}
                                    className={`competencyRow-true`}
                                >
                                    Threshold
                                </Radio>
                            </InfoCard>
                        </Col>

                        <Col xs={20} xl={7} xxl={7}>
                        </Col>
                    </Row>

                    <Form
                        form={form}
                        // labelCol={{ span: 8 }}
                        // wrapperCol={{ span: 16 }}
                        autoComplete="off"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <Divider orientation='left' style={{ margin: "3em 0" }}>
                            <Typography variant='h4'>Soft Skill</Typography>
                        </Divider>

                        <Space direction='vertical' size={"large"}>
                            {
                                dataSource.map((value) => {
                                    if (value.cd.competencyType === "Soft Skill")
                                        return (
                                            <Row>
                                                <CompetencyRow threshold={value.threshold} data={value} />
                                            </Row>
                                        );
                                })
                            }
                        </Space>

                        <Divider orientation='left' style={{ margin: "3em 0" }}>
                            <Typography variant='h4'>Hard Skill</Typography>
                        </Divider>

                        <Space direction='vertical' size={"large"}>
                            {
                                dataSource.map((value) => {
                                    if (value.cd.competencyType === "Hard Skill")
                                        return (
                                            <Row>
                                                <CompetencyRow threshold={value.threshold} data={value} />
                                            </Row>
                                        );
                                })
                            }
                        </Space>

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

                </Box>
            </DashboardCard>
        </>
    );
};

export default PECompetency;

function CompetencyRow(
    {
        threshold,
        data,
    }: {
        threshold: number,
        data: any,
    }
) {

    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    return (
        <>

            <Form.Item
                label={data.cd.name}
                name={data.cd.cid}
                rules={[{ required: true, message: "" }]}
                initialValue={value}
            >

                <Space style={{ display: "flex", justifyContent: "right", width: "100%" }}>
                    <Radio.Group onChange={onChange} value={value}>
                        {
                            [1, 2, 3, 4, 5].map((value: number) => {
                                return (
                                    <>
                                        <Radio
                                            value={value}
                                            className={`competencyRow-${threshold === value}`}
                                        >
                                            {value}
                                        </Radio>
                                    </>
                                );
                            })
                        }
                    </Radio.Group>
                </Space>

            </Form.Item>

        </>
    )
}