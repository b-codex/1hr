import FullLayout from '@/layouts/full/FullLayout';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { ReactElement, useEffect, useState } from 'react';
import DashboardCard from '../components/shared/DashboardCard';

import { deleteLeaveRequest } from '@/backend/api/LM/deleteLeaveRequest';
import { db } from '@/backend/api/firebase';
import screenSize from '@/backend/constants/screenSize';
import EmployeeAddLeaveRequestModal from '@/components/modals/LM/Employee/addLeaveRequest';
import EmployeeEditLeaveRequestModal from '@/components/modals/LM/Employee/editLeaveRequestModal';
import { Button, Modal, message } from 'antd';

const LeaveManagement = () => {

    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [addLeaveRequestModalVisible, setAddLeaveRequestModalVisible] = useState<boolean>(false);
    const [editData, setEditData] = useState<any>({});
    const [editLeaveRequestModalVisible, setEditLeaveRequestModalVisible] = useState<boolean>(false);

    useEffect(() => onSnapshot(collection(db, "leaveManagement"), (snapshot: QuerySnapshot<DocumentData>) => {
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

        setDataSource(data);
        setLoading(false);
    }), []);

    const leaveRequestDelete = (id: string) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await deleteLeaveRequest(id)
                    .then((res: boolean) => {
                        if (res) {
                            message.success('Deleted Successfully');
                        }
                        else {
                            message.error('An Error Occurred.');
                        }
                    });
            }
        });
    };

    /* creating columns. */
    const columns: GridColDef[] = [
        {
            field: 'leaveRequestID',
            headerName: 'Leave Request ID',
            flex: 1,
            hideable: false,
        },
        {
            field: 'leaveState',
            headerName: 'Leave State',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'leaveStage',
            headerName: 'Leave Stage',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'leaveType',
            headerName: 'Leave Type',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'authorizedDays',
            headerName: 'Authorized Days',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'firstDayOfLeave',
            headerName: 'First Day of Leave',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'lastDayOfLeave',
            headerName: 'Last Day of Leave',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'dateOfReturn',
            headerName: 'Date of Return',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'numberOfLeaveDaysRequested',
            headerName: 'Number of Leave Days Requested',
            flex: 1.5,
            // hideable: false,
            type: 'number',
        },
        {
            field: 'balanceLeaveDays',
            headerName: 'Balance Leave Days',
            flex: 1,
            // hideable: false,
            type: 'number',
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
                        label='Edit'
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditData(params.row);
                            setEditLeaveRequestModalVisible(true);
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={1}
                        label='Delete'
                        icon={<DeleteOutlined color='red' />}
                        onClick={() => {
                            leaveRequestDelete(params.row.id);
                        }}
                        showInMenu
                    />
                ];

                return actionArray;
            }
        },
    ];

    const AddButton = () => {
        return (
            <>
                <Button
                    type='primary'
                    onClick={() => {
                        setAddLeaveRequestModalVisible(true);
                    }}
                >
                    Request Leave
                </Button>
            </>
        );
    };

    return (
        <>
            <DashboardCard title="Leave Management" action={<AddButton />}>
                <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                    <div style={{ height: "calc(100vh - 200px)", width: '100%' }}>
                        <DataGrid
                            rows={dataSource}
                            loading={loading}
                            columns={columns}
                            autoPageSize={true}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            // checkboxSelection={screenSize}
                            disableRowSelectionOnClick={true}
                            onStateChange={(params: any) => {
                                // console.log("params: ", params);
                                const selection: string[] = params.rowSelection;

                                // setSelections(selection);
                            }}
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
            </DashboardCard>

            <EmployeeAddLeaveRequestModal
                open={addLeaveRequestModalVisible}
                setOpen={setAddLeaveRequestModalVisible}
            />

            <EmployeeEditLeaveRequestModal
                open={editLeaveRequestModalVisible}
                setOpen={setEditLeaveRequestModalVisible}
                data={editData}
                docID={editData.id}
            />
        </>
    );
};

export default LeaveManagement;
LeaveManagement.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};