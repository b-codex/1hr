import { Box, Modal, Typography, TableContainer, TableBody, TableRow, Table, TableCell, Paper, Divider, Backdrop, Fade } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons';
import { months } from '@/backend/constants/months';
import screenSize from '@/backend/constants/screenSize';
import { DataGrid } from '@mui/x-data-grid';
import generateID from '@/backend/constants/generateID';

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
        <Modal
            open={open}
            onClose={() => { setOpen(false) }}
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
            <Fade in={open}>
                <Box sx={{ position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', bgcolor: '#ffffff', p: 4, }}>
                    <CloseOutlined className={'text-[#3f3d56] text-3xl hover:drop-shadow-lg hover:text-[#ffe6a7] hover:bg-[#3f3d56]'} onClick={() => setOpen(false)} style={{ position: 'absolute', right: 20, top: 20, borderRadius: "50%" }} />
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: '#3f3d56', fontFamily: "Montserrat, sans-serif", fontWeight: 'bold', fontSize: '20px' }}>
                        Attendance List - {attendanceData && attendanceData.attendancePeriod} Period
                    </Typography>
                    <Divider style={{ margin: "15px 0" }} />
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "20px", marginBottom: "50px" }}>
                        <div style={{ flex: .48, border: "1px solid #D3D3D3", borderRadius: "10px" }}>
                            <Typography style={{ color: '#3f3d56', margin: '10px', fontFamily: "Montserrat, sans-serif", fontWeight: 'bold' }} id="modal-modal-title" component="p" align='left'>Overtime</Typography>
                            <Divider />

                            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
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
                                        initialState={{
                                            columns: {
                                                columnVisibilityModel: {
                                                    // Hide columns status and traderName, the other columns will remain visible
                                                    // false is hidden, true is shown
                                                    id: !screenSize,
                                                }
                                            },
                                        }}
                                    />
                                </div>
                            </Box>

                        </div>
                        <div style={{ flex: .48, border: "1px solid #D3D3D3", borderRadius: "10px", fontFamily: "Montserrat, sans-serif", }}>
                            <Typography style={{ color: '#3f3d56', margin: '10px', fontFamily: "Montserrat, sans-serif", fontWeight: 'bold' }} id="modal-modal-title" component="p" align='left'>Comment</Typography>
                            <Divider />


                            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
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
                                        initialState={{
                                            columns: {
                                                columnVisibilityModel: {
                                                    // Hide columns status and traderName, the other columns will remain visible
                                                    // false is hidden, true is shown
                                                    id: !screenSize,
                                                }
                                            },
                                        }}
                                    />
                                </div>
                            </Box>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    )
}

export default EmployeeAttendanceListView;
