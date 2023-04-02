import { months } from '@/pages/api/constants/months';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Backdrop, Box, Button, Card, CardContent, CardHeader, Divider, Fade, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { Col, Form, Input, Row, Space } from 'antd';
import { useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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

    let attendance: any = [];
    let keys: string[] = [];
    let month1: string = '';
    let month2: string = '';
    let month1Data: string[] = [];
    let month2Data: string[] = [];

    if (attendanceData) {
        attendance = attendanceData.attendance;
        keys = Object.keys(attendance);
        month1 = keys[0]
        month2 = keys[1]
        const tempMonth = month1;
        if (months.indexOf(month1) === 11 && months.indexOf(month2) === 0) {
        }
        else if (months.indexOf(month1) === 0 && months.indexOf(month2) === 11) {
            month1 = month2
            month2 = tempMonth
        }
        else if (months.indexOf(month1) > months.indexOf(month2)) {
            month1 = month2
            month2 = tempMonth
        }
        month1Data = Object.keys(attendance[month1])
        month2Data = Object.keys(attendance[month2])
    }

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };

    const [form] = Form.useForm();

    const [age, setAge] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open} style={{ height: "90vh", overflowY: "scroll" }}>
                <Box sx={{ position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', bgcolor: '#ffffff', p: 4, }}>
                    <Typography id="modal-title" variant="h6" component="h2" style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif" }}>
                        Attendance List - {attendanceData && attendanceData.attendancePeriod} Period
                    </Typography>
                    <Divider style={{ margin: "15px 0" }} />
                    <Typography id="modal-modal-title" component="h5" style={{ color: '#3f3d56', marginTop: '18px', fontFamily: "Montserrat, sans-serif", }}>
                        Please input P for Present, H for Half Day, A for Absent
                    </Typography>
                    <Typography id="modal-modal-title" component="h5" style={{ color: '#3f3d56', marginTop: '18px', fontFamily: "Montserrat, sans-serif", }}>
                        If you have to declare overtime, do so before submitting
                    </Typography>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px', fontFamily: "Montserrat, sans-serif", }}>
                        <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='pt-3 pb-3 pr-3'>Period working days: {attendanceData && attendanceData.periodWorkingDays} days</Typography>
                        <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='p-3'>Worked days: {attendanceData && attendanceData.workedDays} days</Typography>
                        <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='p-3'>Absent days: {attendanceData && attendanceData.absentDays} days</Typography>
                    </div>

                    <TableContainer
                        component={Paper}
                        sx={{ width: "100%", color: '#3f3d56' }}
                    >

                        <Form
                            form={form}
                            onFinish={onFinish}
                            autoComplete="off"
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

                                        {
                                            month1Data.length > 0 &&
                                            month1Data.map((value: any, index: number) => (
                                                <TableCell
                                                    sx={{
                                                        borderRight: "1px solid #D3D3D3",
                                                        backgroundColor: attendance[month1][value] ? "" : "gray",
                                                        fontFamily: "Montserrat, sans-serif",
                                                    }}
                                                    key={index}
                                                >
                                                    {
                                                        attendance[month1][value] ?

                                                            <Form.Item
                                                                name={[month1, value]}
                                                                rules={[{ required:true }]}
                                                            >
                                                                <Select
                                                                    value={attendance[month1][value]}
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value={"P"}>P</MenuItem>
                                                                    <MenuItem value={"A"}>A</MenuItem>
                                                                    <MenuItem value={"H"}>H</MenuItem>
                                                                </Select>
                                                            </Form.Item>




                                                            :
                                                            ''
                                                    }
                                                </TableCell>
                                            ))
                                        }


                                        {
                                            month2Data.length > 0 &&
                                            month2Data.map((value: any, index: number) => (
                                                <TableCell
                                                    sx={{
                                                        borderRight: "1px solid #D3D3D3",
                                                        backgroundColor: attendance[month1][value] ? "" : "gray",
                                                        fontFamily: "Montserrat, sans-serif",
                                                    }}
                                                    key={index}
                                                >
                                                    {
                                                        attendance[month1][value] ?
                                                            <input
                                                                style={{
                                                                    border: "1px solid #D3D3D3",
                                                                    borderRadius: "4px",
                                                                    textAlign: "center",
                                                                }}
                                                                pattern="[A-Z]*"
                                                                size={1}
                                                                maxLength={1}
                                                                minLength={1}
                                                                value={attendance[month1][value]}
                                                            />
                                                            :
                                                            ''
                                                    }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                    {/* Present or Absent Values */}
                                    {/* --------------END-------------- */}

                                </TableBody>
                            </Table>

                        </Form>
                    </TableContainer>

                    <Divider style={{ marginTop: "2em", marginBottom: "2em" }} />

                    <Box>
                        <Row align="middle" justify="space-around">
                            <Col xs={24} xl={11} xxl={11}>
                                <Card style={{ padding: "2em", }}>

                                    <CardHeader title="Overtime" />

                                    <CardContent
                                        style={{
                                            overflowY: 'scroll',
                                            height: '300px',
                                        }}
                                    >
                                        <Form.List name="users">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'first']}
                                                                rules={[{ required: true, message: 'Missing first name' }]}
                                                            >
                                                                <Input placeholder="First Name" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'last']}
                                                                rules={[{ required: true, message: 'Missing last name' }]}
                                                            >
                                                                <Input placeholder="Last Name" />
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

                            <Col xs={24} xl={11} xxl={11}>
                                <Card style={{ padding: "2em", }}>

                                    <CardHeader title="Comments" />

                                    <CardContent
                                        style={{
                                            overflowY: 'scroll',
                                            height: '300px',
                                        }}
                                    >
                                        <Form
                                            name="dynamic_form_nest_item"
                                            onFinish={onFinish}
                                            style={{ maxWidth: 600 }}
                                            autoComplete="off"
                                        >
                                            <Form.List name="users">
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, ...restField }) => (
                                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'first']}
                                                                    rules={[{ required: true, message: 'Missing first name' }]}
                                                                >
                                                                    <Input placeholder="First Name" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'last']}
                                                                    rules={[{ required: true, message: 'Missing last name' }]}
                                                                >
                                                                    <Input placeholder="Last Name" />
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
                                        </Form>
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default EmployeeAttendanceEdit
