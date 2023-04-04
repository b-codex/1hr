
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Box, Button, Card, CardContent, CardHeader, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { Col, DatePicker, Form, Input, Row, Select, Space, Spin, TimePicker, message } from 'antd';
import { useEffect, useState } from 'react';

import { db } from '@/backend/api/firebase';
import { groupBy } from '@/backend/constants/groupBy';
import { months } from '@/backend/constants/months';

import { updateAttendanceList } from '@/backend/api/TAM/updateAttendanceList';
import { days } from '@/backend/constants/days';
import { AttendanceData } from '@/backend/models/attendanceData';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';


const EmployeeAttendanceEdit = ({
    attendanceData,
    open,
    setOpen,
}: {
    attendanceData: any,
    open: boolean,
    setOpen: any
}
) => {


    return (
        <>
            <CustomModal
                modalTitle={`Attendance List - ${attendanceData && attendanceData.attendancePeriod} Period`}
                open={open}
                setOpen={setOpen}
                width='80%'
            >
                <EditComponent
                    attendanceData={attendanceData}
                    setOpen={setOpen}
                />
            </CustomModal>
        </>
    );
}

export default EmployeeAttendanceEdit

import CustomModal from '../../customModal';

function EditComponent(
    {
        attendanceData,
        setOpen,
    }: {
        attendanceData: AttendanceData,
        setOpen: any,
    }
) {

    const [loading, setLoading] = useState<boolean>(false);

    // getting HR Settings from the database
    const [shiftTypes, setShiftTypes] = useState<any[]>([]);
    useEffect(() => onSnapshot(collection(db, "hrSettings"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });
        const groupedSettings: any = groupBy("type", data);

        const shiftTypes: any[] = groupedSettings["Shift Type"];
        setShiftTypes(shiftTypes);

    }), []);

    const [formValidated, setFormValidated] = useState<string>("");

    const [attendance, setAttendance] = useState<any[]>([]);
    const [month1, setMonth1] = useState<any>('');
    const [month2, setMonth2] = useState<any>('');
    const [month1Data, setMonth1Data] = useState<any>({});
    const [month2Data, setMonth2Data] = useState<any>({});

    const [workingDays, setWorkingDays] = useState<string[]>([]);
    useEffect(() => {
        if (attendanceData) {
            let attendance = attendanceData.attendance;
            let keys = Object.keys(attendance);
            let month1 = keys[0];
            let month2 = keys[1];
            const tempMonth = month1;
            if (months.indexOf(month1) === 11 && months.indexOf(month2) === 0) { }

            else if (months.indexOf(month1) === 0 && months.indexOf(month2) === 11) {
                month1 = month2;
                month2 = tempMonth;
            }

            else if (months.indexOf(month1) > months.indexOf(month2)) {
                month1 = month2;
                month2 = tempMonth;
            }

            let month1Data = Object.keys(attendance[month1]);
            let month2Data = Object.keys(attendance[month2]);

            if (shiftTypes.length > 0) {
                const shift: any = shiftTypes.find(value => value.name === attendanceData.associatedShiftType);
                const workingDays: string[] = shift['workingDays'] ?? [];

                setWorkingDays(workingDays);
            }

            setAttendance(attendance);
            setMonth1(month1);
            setMonth2(month2);
            setMonth1Data(month1Data);
            setMonth2Data(month2Data);
        }
    }, [attendanceData, shiftTypes]);

    const [form] = Form.useForm();

    return (
        <>
            <Form
                form={form}
                autoComplete="off"
            >
                {/* modal header */}
                <div className="">

                    <Divider style={{ margin: "15px 0" }} />

                    <Typography id="modal-modal-title" component="h5" style={{ color: '#3f3d56', marginTop: '18px', fontFamily: "Montserrat, sans-serif", }}>
                        Please input P for Present, H for Half Day, A for Absent
                    </Typography>

                    <Typography id="modal-modal-title" component="h5" style={{ color: '#3f3d56', marginTop: '18px', fontFamily: "Montserrat, sans-serif", }}>
                        If you have to declare overtime, do so before submitting
                    </Typography>

                    {/* <div style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', marginTop: '20px', fontFamily: "Montserrat, sans-serif", }}>
                            <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='pt-3 pb-3 pr-3'>Period working days: {attendanceData && attendanceData.periodWorkingDays} days</Typography>
                            <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='p-3'>Worked days: {attendanceData && attendanceData.workedDays} days</Typography>
                            <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='p-3'>Absent days: {attendanceData && attendanceData.absentDays} days</Typography>
                        </div> */}

                    <Divider style={{ marginTop: "1em", marginBottom: "1em" }} />

                    <Form.Item
                        name="associatedShiftType"
                        label="Shift Type"
                        initialValue={attendanceData?.associatedShiftType}
                    >
                        <Select
                            style={{ width: "100%" }}
                            options={[...shiftTypes].map(value => ({ label: value.name, value: value.name }))}
                            onChange={(value) => {
                                const chosenShiftType: any = shiftTypes.find(shiftType => shiftType.name === value);
                                const workingDays: string[] = chosenShiftType.workingDays;

                                setWorkingDays(workingDays);
                            }}
                            dropdownStyle={{ zIndex: 2000 }}
                        />
                    </Form.Item>

                    <Divider style={{ marginTop: "1em", marginBottom: "1em" }} />
                </div>


                <TableContainer
                    component={Paper}
                    sx={{ width: "100%", color: '#3f3d56' }}
                >

                    <Table
                        stickyHeader
                        sx={{ width: "max-content" }}
                    >
                        <TableBody>
                            {/* ------------------------------ */}
                            {/* Table Header (Jan - Dec) */}

                            <TableRow>
                                <TableCell
                                    sx={{
                                        borderRight: "1px solid #D3D3D3",
                                        backgroundColor: "#3f3d56",
                                        color: "#ffe6a7",
                                        fontFamily: "Montserrat, sans-serif",
                                    }}
                                    variant="head"
                                >

                                </TableCell>

                                {
                                    month1 !== '' &&
                                    <TableCell
                                        sx={{
                                            borderRight: "1px solid #D3D3D3",
                                            backgroundColor: "#3f3d56",
                                            color: "#ffffff",
                                            fontFamily: "Montserrat, sans-serif",
                                        }}
                                        align='center'
                                        colSpan={month1Data.length}
                                    >
                                        {month1}
                                    </TableCell>
                                }

                                {
                                    month2 !== '' &&
                                    <TableCell
                                        sx={{
                                            borderRight: "1px solid #D3D3D3",
                                            backgroundColor: "#3f3d56",
                                            color: "#ffffff",
                                            fontFamily: "Montserrat, sans-serif",
                                        }}
                                        align='center'
                                        colSpan={month2Data.length}
                                    >
                                        {month2}
                                    </TableCell>
                                }
                            </TableRow>

                            {/* Table Header (Months) */}
                            {/* --------------END-------------- */}

                            {/* ------------------------------ */}
                            {/* Days For The Months */}

                            <TableRow>
                                <TableCell
                                    sx={{
                                        borderRight: "1px solid #D3D3D3",
                                        fontFamily: "Montserrat, sans-serif",
                                    }}
                                    variant="head"
                                >
                                </TableCell>

                                {
                                    month1Data.length > 0 &&
                                    month1Data.map((value: any, index: number) => (
                                        <TableCell
                                            sx={{
                                                borderRight: "1px solid #D3D3D3",
                                                fontFamily: "Montserrat, sans-serif",
                                            }}
                                            key={index}
                                        >
                                            {value}
                                        </TableCell>
                                    ))
                                }

                                {
                                    month2Data.length > 0 &&
                                    month2Data.map((value: any, index: number) => (
                                        <TableCell
                                            sx={{
                                                borderRight: "1px solid #D3D3D3",
                                                fontFamily: "Montserrat, sans-serif",
                                            }}
                                            key={index}
                                        >
                                            {value}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>

                            {/* Days For The Months */}
                            {/* --------------END-------------- */}

                            {/* ------------------------------ */}
                            {/* Present or Absent Values */}
                            <TableRow>
                                <TableCell
                                    sx={{
                                        borderRight: "1px solid #D3D3D3",
                                        fontFamily: "Montserrat, sans-serif",
                                    }}
                                    variant="head"
                                >
                                    Presence
                                </TableCell>

                                {/* data for the first month */}
                                {
                                    month1Data.length > 0 &&
                                    month1Data.map((value: any, index: number) => {

                                        const year: number = attendanceData.attendancePeriod === "January" ? attendanceData.year - 1 : attendanceData.year;

                                        const date: moment.Moment = moment(`${month1} ${value}, ${year}`, "MMMM DD, YYYY");

                                        const dayInString: string = days[date.day()];
                                        const dayInWorkingDays: boolean = workingDays.includes(dayInString);

                                        return (
                                            <>
                                                <TableCell
                                                    sx={{
                                                        borderRight: "1px solid #D3D3D3",
                                                        backgroundColor: dayInWorkingDays ? "" : "gray",
                                                        fontFamily: "Montserrat, sans-serif",
                                                    }}
                                                    key={index}
                                                >
                                                    {
                                                        dayInWorkingDays ?
                                                            <Form.Item
                                                                name={[month1, value]}
                                                                rules={[{ required: true, message: "" }]}
                                                                initialValue={attendance[month1][value]}
                                                            >
                                                                <Select
                                                                    style={{ width: 60 }}
                                                                    options={['P', 'H', 'A'].map(value => ({ label: value, value: value }))}
                                                                    dropdownStyle={{ zIndex: 2000 }}
                                                                />
                                                            </Form.Item>
                                                            :
                                                            ''
                                                    }
                                                </TableCell>
                                            </>
                                        )
                                    })
                                }

                                {/* data for the second month */}
                                {
                                    month2Data.length > 0 &&
                                    month2Data.map((value: any, index: number) => {

                                        const year: number = attendanceData.year;

                                        const date: moment.Moment = moment(`${month2} ${value}, ${year}`, "MMMM DD, YYYY");

                                        const dayInString: string = days[date.day()];
                                        const dayInWorkingDays: boolean = workingDays.includes(dayInString);

                                        return (
                                            <>
                                                <TableCell
                                                    sx={{
                                                        borderRight: "1px solid #D3D3D3",
                                                        backgroundColor: dayInWorkingDays ? "" : "gray",
                                                        fontFamily: "Montserrat, sans-serif",
                                                    }}
                                                    key={index}
                                                >
                                                    {
                                                        dayInWorkingDays ?
                                                            <Form.Item
                                                                name={[month2, value]}
                                                                rules={[{ required: true, message: "" }]}
                                                                initialValue={attendance[month2][value]}
                                                            >
                                                                <Select
                                                                    style={{ width: 60 }}
                                                                    options={['P', 'H', 'A'].map(value => ({ label: value, value: value }))}
                                                                    dropdownStyle={{ zIndex: 2000 }}
                                                                />
                                                            </Form.Item>
                                                            :
                                                            ''
                                                    }
                                                </TableCell>
                                            </>
                                        )
                                    })
                                }
                            </TableRow>
                            {/* Present or Absent Values */}
                            {/* --------------END-------------- */}

                        </TableBody>
                    </Table>

                    {/* </Form> */}
                </TableContainer>

                <Divider style={{ marginTop: "2em", marginBottom: "2em" }} />

                <Box>
                    <Row align="middle" justify="space-around">

                        {/* Overtime Section */}
                        <Col xs={24} xl={11} xxl={11}>
                            <Card style={{ padding: "2em", }}>

                                <CardHeader title="Overtime" />

                                <CardContent
                                    style={{
                                        overflowY: 'scroll',
                                        height: '300px',
                                    }}
                                >
                                    <Typography>
                                        If overtime data already exists, it will be updated.
                                    </Typography>

                                    <Divider style={{ margin: "1em" }} />

                                    <Form.List name="overtime">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'date']}
                                                            rules={[{ required: true, message: '' }]}
                                                        >
                                                            <DatePicker
                                                                style={{ width: "100%", zIndex: 2000 }}
                                                                placeholder='Overtime Date'
                                                                format={"MMMM DD, YYYY"}
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'timeFrom']}
                                                            rules={[{ required: true, message: '' }]}
                                                        >
                                                            <TimePicker
                                                                use12Hours
                                                                format="h:mm A"
                                                                placeholder='From'
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'timeTo']}
                                                            rules={[{ required: true, message: '' }]}
                                                        >
                                                            <TimePicker
                                                                use12Hours
                                                                format="h:mm A"
                                                                placeholder='To'
                                                            />
                                                        </Form.Item>
                                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                                    </Space>
                                                ))}
                                                <Row align={"middle"} justify={"center"}>
                                                    <Form.Item>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => add()}
                                                            startIcon={<PlusOutlined />}
                                                        >
                                                            Add
                                                        </Button>
                                                    </Form.Item>
                                                </Row>
                                            </>
                                        )}
                                    </Form.List>
                                </CardContent>
                            </Card>
                        </Col>

                        {/* Comments Section */}
                        <Col xs={24} xl={11} xxl={11}>
                            <Card style={{ padding: "2em", }}>

                                <CardHeader title="Comments" />

                                <CardContent
                                    style={{
                                        overflowY: 'scroll',
                                        height: '300px',
                                    }}
                                >

                                    <Typography>
                                        If comment data already exists, it will be updated.
                                    </Typography>

                                    <Divider style={{ margin: "1em" }} />

                                    <Form.List name="comments">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="center">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'text']}
                                                            rules={[{ required: true, message: 'Required' }]}
                                                        >
                                                            <Input.TextArea rows={2} cols={115} placeholder="Your comment here..." />
                                                        </Form.Item>
                                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                                    </Space>
                                                ))}
                                                <Row align={"middle"} justify={"center"}>
                                                    <Form.Item>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => add()}
                                                            startIcon={<PlusOutlined />}
                                                        >
                                                            Add
                                                        </Button>
                                                    </Form.Item>
                                                </Row>
                                            </>
                                        )}
                                    </Form.List>
                                </CardContent>
                            </Card>
                        </Col>
                    </Row>
                </Box>

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

                            // console.log("values:", values);
                            // console.log("attendanceData: ", attendanceData);

                            const overtime: any[] = values.overtime === null ? [] : values.overtime;
                            overtime.forEach((value) => {
                                const date = value.date;
                                const timeFrom = value.timeFrom;
                                const timeTo = value.timeTo;

                                value.date = date.format("MMMM DD, YYYY");
                                value.timeFrom = timeFrom.format("h:mm A");
                                value.timeTo = timeTo.format("h:mm A");
                            });

                            const overtimeData: any[] = attendanceData.overtime.at(0) ?? [];
                            overtimeData.push(...overtime);

                            const commentData: any[] = attendanceData.comments;
                            if (values.comments !== null) commentData.push(...values.comments);

                            month1Data.forEach((value: any) => {
                                const year: number = attendanceData.attendancePeriod === "January" ? attendanceData.year - 1 : attendanceData.year;

                                const date: moment.Moment = moment(`${month1} ${value}, ${year}`, "MMMM DD, YYYY");

                                const dayInString: string = days[date.day()];
                                const dayInWorkingDays: boolean = workingDays.includes(dayInString);

                                if (dayInWorkingDays === false) {
                                    values[month1][value] = null;
                                }
                            });

                            month2Data.forEach((value: any) => {
                                const year: number = attendanceData.year;

                                const date: moment.Moment = moment(`${month2} ${value}, ${year}`, "MMMM DD, YYYY");

                                const dayInString: string = days[date.day()];
                                const dayInWorkingDays: boolean = workingDays.includes(dayInString);

                                if (dayInWorkingDays === false) {
                                    values[month2][value] = null;
                                }
                            });

                            const updatedAttendanceData: AttendanceData = {
                                employeeID: attendanceData.employeeID,
                                attendancePeriod: attendanceData.attendancePeriod,
                                year: attendanceData.year,
                                state: "Draft",
                                comments: commentData,
                                attendance: {
                                    [month1]: values[month1],
                                    [month2]: values[month2],
                                },
                                overtime: overtimeData,
                                modificationRequested: attendanceData.modificationRequested,
                                modifications: [...attendanceData.modifications],
                                stage: attendanceData.stage,
                                associatedShiftType: values.associatedShiftType,
                            };

                            // console.log("values:", values);
                            // console.log("updatedAttendanceData: ", updatedAttendanceData);

                            await updateAttendanceList(updatedAttendanceData, attendanceData.id as string)
                                .then((res: boolean) => {

                                    if (res === true) {
                                        setOpen(false);
                                        setLoading(false);
                                        message.success("Updated.");
                                        form.resetFields();
                                        setFormValidated("");
                                    }

                                    if (res === false) {
                                        setFormValidated("Update Error");
                                        setLoading(false);
                                    }
                                })
                                .catch((err: any) => {
                                    console.log("error updating attendance list: ", err);
                                    setFormValidated("Update Error");
                                    setLoading(false);
                                });

                            setLoading(false);
                        }).catch((err) => {
                            setLoading(false);
                            setFormValidated("Validation Error");
                            console.log("Validation Error: ", err);
                        });
                    }}
                >
                    {loading ? <Spin size='small' /> : "Save"}
                </Button>

            </Row>
        </>
    );
}
