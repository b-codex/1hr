import generateID from '@/backend/constants/generateID';
import { months } from '@/backend/constants/months';
import { Box, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import CustomModal from '../../customModal';

const EmployeeAttendanceListView = ({
    attendanceData,
    open,
    setOpen,
}: {
    attendanceData: any,
    open: boolean,
    setOpen: any,
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

    const [overtime, setOvertime] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    useEffect(() => {
        if (attendanceData) {
            const otData: any[] = attendanceData.overtime;
            console.log("otData: ", otData);
            otData.forEach((o) => o.id = generateID());
            setOvertime(otData);

            const commentData: any[] = attendanceData.comments;
            commentData.forEach((c) => c.id = generateID());
            setComments(commentData);
        }
    }, [attendanceData]);

    return (
        <>

            <CustomModal
                modalTitle={`Attendance List - ${attendanceData && attendanceData.attendancePeriod} Period`}
                open={open}
                setOpen={setOpen}
            >
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: '20px', fontFamily: "Montserrat, sans-serif", }}>
                    <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='pt-3 pb-3 pr-3'>Period working days: <span style={{ fontWeight: 500 }}>{attendanceData && attendanceData.periodWorkingDays} days</span></Typography>
                    <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='p-3'>Worked days: <span style={{ fontWeight: 500 }}>{attendanceData && attendanceData.workedDays} days</span></Typography>
                    <Typography style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className='p-3'>Absent days: <span style={{ fontWeight: 500 }}>{attendanceData && attendanceData.absentDays} days</span></Typography>
                </div>

                <TableContainer
                    component={Paper}
                    sx={{ width: "100%", color: '#3f3d56', fontFamily: "Montserrat, sans-serif", }}
                >
                    <Table
                        stickyHeader
                        sx={{ width: "max-content" }}
                    >
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ borderRight: "1px solid #D3D3D3", backgroundColor: "#3f3d56", color: "#ffe6a7", fontFamily: "Montserrat, sans-serif", }} variant="head"></TableCell>
                                {
                                    month1 !== '' && <TableCell sx={{ borderRight: "1px solid #D3D3D3", backgroundColor: "#3f3d56", color: "#ffffff", fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }} align='center' colSpan={month1Data.length}>{month1}</TableCell>
                                }
                                {
                                    month2 !== '' && <TableCell sx={{ borderRight: "1px solid #D3D3D3", backgroundColor: "#3f3d56", color: "#ffffff", fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }} align='center' colSpan={month2Data.length}>{month2}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ borderRight: "1px solid #D3D3D3" }} variant="head"></TableCell>
                                {
                                    month1Data.length > 0 && month1Data.map((value: any, index: number) => (<TableCell sx={{ borderRight: "1px solid #D3D3D3", fontFamily: "Montserrat, sans-serif", }} key={index}>{value}</TableCell>))
                                }
                                {
                                    month2Data.length > 0 && month2Data.map((value: any, index: number) => (<TableCell sx={{ borderRight: "1px solid #D3D3D3", fontFamily: "Montserrat, sans-serif", }} key={index}>{value}</TableCell>))
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ borderRight: "1px solid #D3D3D3", fontFamily: "Montserrat, sans-serif", }} variant="head">Presence</TableCell>
                                {
                                    month1Data.length > 0 && month1Data.map((value: any, index: number) => (<TableCell sx={{ borderRight: "1px solid #D3D3D3", backgroundColor: attendance[month1][value] ? "" : "#ffe6a7", fontFamily: "Montserrat, sans-serif", }} key={index}>{attendance[month1][value]}</TableCell>))
                                }
                                {
                                    month2Data.length > 0 && month2Data.map((value: any, index: number) => (<TableCell sx={{ borderRight: "1px solid #D3D3D3", backgroundColor: attendance[month2][value] ? "" : "#ffe6a7", fontFamily: "Montserrat, sans-serif", }} key={index}>{attendance[month2][value]}</TableCell>))
                                }
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Row
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        marginTop: '1em',
                        marginBottom: '1em',
                    }}
                >
                    <Col xs={24} xl={11} xxl={11}>
                        <div style={{ border: "1px solid #D3D3D3", borderRadius: "10px", margin: "1em" }}>
                            <Typography style={{ color: '#3f3d56', margin: '10px', fontFamily: "Montserrat, sans-serif", fontWeight: 'bold' }} id="modal-modal-title" component="p" align='left'>Overtime</Typography>
                            <Divider />

                            <Box sx={{ overflow: 'auto', width: { xs: 'auto', sm: 'auto' } }}>
                                <div style={{ height: "300px", width: '97%' }}>
                                    <DataGrid
                                        rows={overtime}
                                        // loading={loading}
                                        columns={[
                                            {
                                                field: 'date',
                                                headerName: 'Date',
                                                flex: 1,
                                                hideable: false,
                                            },
                                            {
                                                field: 'from',
                                                headerName: 'From',
                                                flex: 1,
                                                hideable: false,
                                            },
                                            {
                                                field: 'to',
                                                headerName: 'To',
                                                flex: 1,
                                                hideable: false,
                                            },
                                        ]}
                                        autoPageSize={true}
                                        disableRowSelectionOnClick={true}
                                    />
                                </div>
                            </Box>

                        </div>
                    </Col>

                    <Col xs={24} xl={11} xxl={11}>
                        <div style={{ border: "1px solid #D3D3D3", borderRadius: "10px", margin: "1em" }}>
                            <Typography style={{ color: '#3f3d56', margin: '10px', fontFamily: "Montserrat, sans-serif", fontWeight: 'bold' }} id="modal-modal-title" component="p" align='left'>Comment</Typography>

                            <Divider />

                            <Box sx={{ overflow: 'auto', width: { xs: 'auto', sm: 'auto' } }}>
                                <div style={{ height: "300px", width: '97%' }}>
                                    <DataGrid
                                        rows={comments}
                                        // loading={loading}
                                        columns={[
                                            {
                                                field: 'text',
                                                headerName: 'Text',
                                                flex: 1,
                                                hideable: false,
                                            },
                                        ]}
                                        autoPageSize={true}
                                        disableRowSelectionOnClick={true}
                                    />
                                </div>
                            </Box>
                        </div>
                    </Col>
                </Row>
            </CustomModal>
        </>
    )
}

export default EmployeeAttendanceListView;

function AttendanceListView() {
    return (
        <>
        </>
    );
}
