import { approveAttendanceList } from '@/backend/api/TAM/approveAttendanceList';
import { refuseAttendanceList } from '@/backend/api/TAM/refuseAttendanceList';
import { months } from '@/backend/constants/months';
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useMediaQuery } from '@mui/material';
import { Button, Modal, Row, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import CustomModal from '../../customModal';
import WriteCommentModal from '../Manager/writeCommentModal';
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbar } from '@mui/x-data-grid';
import generateID from '@/backend/constants/generateID';
import { approveAttendanceModification } from '@/backend/api/TAM/approveAttendanceModification';
import { ModificationData } from '@/backend/models/attendanceData';
import { refuseAttendanceModification } from '@/backend/api/TAM/refuseAttendanceModification';

const HRManagerViewRequestedModifications = ({
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

    const matches = useMediaQuery('(min-width:900px)');

    const [dataSource, setDataSource] = useState<any[]>([]);
    useEffect(() => {
        const ds: any[] = [];

        if (attendanceData) {
            attendanceData?.modifications?.forEach((modification: any) => {
                ds.push(
                    {
                        id: generateID(),
                        parent: attendanceData,
                        ...modification,
                    }
                );
            });

            setDataSource(ds);
        }
    }, [attendanceData]);

    /* creating columns. */
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'old',
            headerName: 'Old',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'new',
            headerName: 'New',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'state',
            headerName: 'State',
            flex: 1,
            // hideable: false,
        },
        {
            field: "actions",
            headerName: 'Actions',
            type: "actions",
            flex: 1,
            width: 100,
            getActions: (params: any) => {
                let actionArray: any[] = [
                    <GridActionsCellItem
                        key={1}
                        label='Approve'
                        icon={<CheckOutlined />}
                        onClick={() => {
                            approveAttendance(params.row);
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={2}
                        label='Refuse'
                        icon={<CloseOutlined />}
                        onClick={() => {
                            refuseAttendance(params.row);
                        }}
                        showInMenu
                    />,
                ];

                return actionArray;
            }
        },
    ];

    const approveAttendance = (modification: ModificationData) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await approveAttendanceModification(attendanceData, modification)
                    .then((res: boolean) => {
                        if (res) {
                            message.success('Success.');
                            setOpen(false);
                        }
                        else {
                            message.error('An Error Occurred.');
                        }
                    });
            }
        });
    };

    const refuseAttendance = (modification: ModificationData) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await refuseAttendanceModification(attendanceData, modification)
                    .then((res: boolean) => {
                        if (res) {
                            message.success('Success.');
                            setOpen(false);
                        }
                        else {
                            message.error('An Error Occurred.');
                        }
                    });
            }
        });
    };

    return (
        <>
            <CustomModal
                modalTitle={`Attendance List - ${attendanceData && attendanceData?.attendancePeriod} Period - Requested Modifications By ${attendanceData?.employeeID}`}
                open={open}
                setOpen={setOpen}
                width={matches ? '70%' : '100%'}
            >
                <div style={{ height: "calc(100vh - 200px)", width: '100%' }}>
                    <DataGrid
                        rows={dataSource}
                        columns={columns}
                        autoPageSize={true}
                        // checkboxSelection={matches}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        disableRowSelectionOnClick={true}
                        onStateChange={(params) => {
                            // console.log("params: ", params);
                            const selection: string[] = params.rowSelection;

                            // setSelections(selection);
                        }}
                    />
                </div>

            </CustomModal>
        </>
    )
}

export default HRManagerViewRequestedModifications;
