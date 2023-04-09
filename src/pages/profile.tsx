import FullLayout from '@/layouts/full/FullLayout';
import { Box, Typography, Button } from '@mui/material';
import { Badge, Col, Descriptions, Divider, Row, Space, Spin, Tag } from 'antd';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import DashboardCard from '../components/shared/DashboardCard';
import { EditOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { EmployeeData } from '@/backend/models/employeeData';
import { db } from '@/backend/api/firebase';
import { onSnapshot, collection, QuerySnapshot, DocumentData } from 'firebase/firestore';
import EditPasswordModal from '@/components/modals/All/editPassword';
import EditEmployeeInformationModal from '@/components/modals/All/editEmployeeInformation';

const Profile = () => {

    const router = useRouter();

    const [viewPassword, setViewPassword] = useState<boolean>(false);

    const [docID, setDocID] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [editPasswordModalOpen, setEditPasswordModalOpen] = useState<boolean>(false);

    const [employeeInformation, setEmployeeInformation] = useState<any>({});
    const [editEmployeeInformationOpen, setEditEmployeeInformationOpen] = useState<boolean>(false);

    const [employeeID, setEmployeeID] = useState<any>({});
    const [employeeData, setEmployeeData] = useState<EmployeeData>();

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    // check login state
    useEffect(() => {
        const loggedIn: string = localStorage.getItem('loggedIn') as string;
        // console.log("Logged In: ", loggedIn);

        if (loggedIn === null || loggedIn === undefined) {
            router.push('/');
        }
        else {
            const user: EmployeeData = JSON.parse(localStorage.getItem('user') as string);

            setEmployeeID(user.employeeID)
            // setPageLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const employee: EmployeeData | undefined = data.find((doc) => doc.employeeID === employeeID);

        if (employee) {
            setEmployeeData(employee);
            setPageLoading(false);
        }

    }), [employeeID]);

    if (pageLoading === true) {
        return (
            <>
                <DashboardCard className='loadingContainer'>
                    <Spin />
                </DashboardCard>
            </>
        );
    }
    else {
        return (
            <>
                <DashboardCard title=' '>
                    <Box sx={{ overflow: 'auto', width: { xs: 'auto', sm: 'auto' } }}>
                        <Row
                            style={{
                                width: "100%",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Divider orientation='left'>
                                <Typography variant='h4'>
                                    Account Information
                                </Typography>
                            </Divider>

                            <Col xs={22} xl={10} xxl={10} className={"m-1"} >
                                <Descriptions layout="horizontal" bordered>
                                    <Descriptions.Item label="Fullname" span={5}>{employeeData?.firstName} {employeeData?.lastName}</Descriptions.Item>

                                    <Descriptions.Item label="Employee ID" span={5}>{employeeData?.employeeID}</Descriptions.Item>

                                    <Descriptions.Item label="Password" span={5}>
                                        <Row
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {
                                                (() => {
                                                    const password: string | undefined = employeeData?.password;

                                                    let hiddenPassword: string = ''
                                                    if (password) {
                                                        for (let i = 0; i < password.length; i++) {
                                                            hiddenPassword += '*';
                                                        }
                                                    }
                                                    return viewPassword ? password : hiddenPassword;
                                                })()
                                            }

                                            <Space>
                                                <Button
                                                    variant='contained'
                                                    style={{
                                                        padding: "10px 0"
                                                    }}
                                                    onClick={() => {
                                                        setDocID(`${employeeData?.id}`);
                                                        setOldPassword(`${employeeData?.password}`)
                                                        setEditPasswordModalOpen(true);
                                                    }}
                                                >
                                                    <EditOutlined />
                                                </Button>

                                                <Button
                                                    variant='contained'
                                                    style={{
                                                        padding: "10px 0"
                                                    }}
                                                    onClick={() => {
                                                        const isVisible: boolean = viewPassword;

                                                        setViewPassword(!isVisible);
                                                    }}
                                                >
                                                    {viewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                                </Button>

                                            </Space>

                                        </Row>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>

                            <Col xs={22} xl={10} xxl={10} className={"m-1"} >

                            </Col>
                        </Row>

                        <div style={{ margin: "1em 0" }} />

                        <Row
                            style={{
                                width: "100%",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Divider orientation='left'>
                                <Typography variant='h4'>
                                    Employee Information
                                </Typography>
                            </Divider>

                            <Row
                                style={{
                                    width: "100%",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'right',
                                    margin: "10px 0"
                                }}
                            >
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        setDocID(`${employeeData?.id}`);
                                        setEmployeeInformation(
                                            {
                                                firstName: employeeData?.firstName,
                                                lastName: employeeData?.lastName,
                                                birthDate: employeeData?.birthDate,
                                                birthPlace: employeeData?.birthPlace,
                                                gender: employeeData?.gender,
                                                maritalStatus: employeeData?.maritalStatus,
                                                personalPhoneNumber: employeeData?.personalPhoneNumber,
                                                personalEmail: employeeData?.personalEmail,
                                                bankAccount: employeeData?.bankAccount,
                                                tinNumber: employeeData?.tinNumber,
                                            }
                                        );
                                        setEditEmployeeInformationOpen(true);
                                    }}
                                >
                                    Edit Employee Information
                                </Button>
                            </Row>

                            <Col xs={22} xl={10} xxl={10} className={"m-1"} >
                                <Descriptions layout="horizontal" bordered>
                                    <Descriptions.Item label="First Name" span={5}>{employeeData?.firstName}</Descriptions.Item>

                                    <Descriptions.Item label="Last Name" span={5}>{employeeData?.lastName}</Descriptions.Item>

                                    <Descriptions.Item label="Birth Date" span={5}>{employeeData?.birthDate}</Descriptions.Item>

                                    <Descriptions.Item label="Birth Place" span={5}>{employeeData?.birthPlace}</Descriptions.Item>

                                    <Descriptions.Item label="Gender" span={5}>{employeeData?.gender}</Descriptions.Item>
                                </Descriptions>
                            </Col>

                            <Col xs={22} xl={10} xxl={10} className={"m-1"} >
                                <Descriptions layout="horizontal" bordered>
                                    <Descriptions.Item label="Marital Status" span={5}>{employeeData?.maritalStatus}</Descriptions.Item>

                                    <Descriptions.Item label="Personal Phone Number" span={5}>{employeeData?.personalPhoneNumber}</Descriptions.Item>

                                    <Descriptions.Item label="Personal Email" span={5}>{employeeData?.personalEmail}</Descriptions.Item>

                                    <Descriptions.Item label="Bank Account" span={5}>{employeeData?.bankAccount}</Descriptions.Item>

                                    <Descriptions.Item label="Tin Number" span={5}>{employeeData?.tinNumber}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>

                        <div style={{ margin: "1em 0" }} />

                        <Row
                            style={{
                                width: "100%",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Divider orientation='left'>
                                <Typography variant='h4'>
                                    Contract Information
                                </Typography>
                            </Divider>

                            <Col xs={22} xl={10} xxl={10} className={"m-1"} >
                                <Descriptions layout="horizontal" bordered>
                                    <Descriptions.Item label="Contract Type" span={5}>{employeeData?.contractType}</Descriptions.Item>

                                    <Descriptions.Item label="Contract Status" span={5}>{employeeData?.contractStatus}</Descriptions.Item>

                                    <Descriptions.Item label="Contract Starting Date" span={5}>{employeeData?.contractStartingDate}</Descriptions.Item>

                                    <Descriptions.Item label="Contract Termination Date" span={5}>{employeeData?.contractTerminationDate}</Descriptions.Item>

                                    <Descriptions.Item label="Probation Period End Date" span={5}>{employeeData?.probationPeriodEndDate}</Descriptions.Item>

                                    <Descriptions.Item label="Last Date of Probation" span={5}>{employeeData?.lastDateOfProbation}</Descriptions.Item>
                                </Descriptions>
                            </Col>

                            <Col xs={22} xl={10} xxl={10} className={"m-1"} >
                                <Descriptions layout="horizontal" bordered>
                                    <Descriptions.Item label="Reason of Leaving" span={5}>{employeeData?.reasonOfLeaving}</Descriptions.Item>

                                    <Descriptions.Item label="Salary" span={5}>Salary</Descriptions.Item>

                                    <Descriptions.Item label="Eligible Leave Days" span={5}>{employeeData?.eligibleLeaveDays}</Descriptions.Item>

                                    <Descriptions.Item label="Number of Leave Days Taken" span={5}>{employeeData?.numberOfLeaveDaysTaken}</Descriptions.Item>

                                    <Descriptions.Item label="Company Email" span={5}>{employeeData?.companyEmail}</Descriptions.Item>

                                    <Descriptions.Item label="Company Phone Number" span={5}>{employeeData?.companyPhoneNumber}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>

                        <div style={{ margin: "1em 0" }} />

                        <Row
                            style={{
                                width: "100%",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Divider orientation='left'>
                                <Typography variant='h4'>
                                    Position Information
                                </Typography>
                            </Divider>

                            <Col xs={22} xl={10} xxl={10} className={"m-1"} >
                                <Descriptions layout="horizontal" bordered>
                                    <Descriptions.Item label="Employment Position" span={5}>{employeeData?.employmentPosition}</Descriptions.Item>

                                    <Descriptions.Item label="Position Level" span={5}>{employeeData?.positionLevel}</Descriptions.Item>

                                    <Descriptions.Item label="Section/Division" span={5}>{employeeData?.section}</Descriptions.Item>

                                    <Descriptions.Item label="Department" span={5}>{employeeData?.department}</Descriptions.Item>

                                    <Descriptions.Item label="Working Location" span={5}>{employeeData?.workingLocation}</Descriptions.Item>

                                    <Descriptions.Item label="Manager Position" span={5}>{employeeData?.managerPosition}</Descriptions.Item>

                                    <Descriptions.Item label="Reportees" span={5}><Space>{employeeData?.reportees.map(r => <Tag key={r}>{r}</Tag>)}</Space></Descriptions.Item>

                                    <Descriptions.Item label="Reporting Line Manager Position" span={5}>{employeeData?.reportingLineManagerPosition}</Descriptions.Item>
                                </Descriptions>
                            </Col>

                            <Col xs={22} xl={10} xxl={10} className={"m-1"} >
                                <Descriptions layout="horizontal" bordered>
                                    <Descriptions.Item label="Reporting Line Manager Name" span={5}>{employeeData?.reportingLineManagerName}</Descriptions.Item>

                                    <Descriptions.Item label="Grade Level" span={5}>{employeeData?.gradeLevel}</Descriptions.Item>

                                    <Descriptions.Item label="Band" span={5}>{employeeData?.band}</Descriptions.Item>

                                    <Descriptions.Item label="Shift Type" span={5}>{employeeData?.shiftType}</Descriptions.Item>

                                    <Descriptions.Item label="Transport Allowance" span={5}>{employeeData?.transportAllowance}</Descriptions.Item>

                                    <Descriptions.Item label="Mobile Allowance" span={5}>{employeeData?.mobileAllowance}</Descriptions.Item>

                                    <Descriptions.Item label="Other Allowance" span={5}>{employeeData?.otherAllowance}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                    </Box>
                </DashboardCard>

                <EditPasswordModal
                    docID={docID}
                    oldPassword={oldPassword}
                    open={editPasswordModalOpen}
                    setOpen={setEditPasswordModalOpen}
                />

                <EditEmployeeInformationModal
                    data={employeeInformation}
                    docID={docID}
                    open={editEmployeeInformationOpen}
                    setOpen={setEditEmployeeInformationOpen}
                />
            </>
        );
    }
};

export default Profile;
Profile.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};