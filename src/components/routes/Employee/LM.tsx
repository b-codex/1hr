import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';

import { deleteLeaveRequest } from '@/backend/api/LM/deleteLeaveRequest';
import { db } from '@/backend/api/firebase';
import { EmployeeData } from '@/backend/models/employeeData';
import AppContext from '@/components/context/AppContext';
import EmployeeAddLeaveRequestModal from '@/components/modals/LM/addLeaveRequestModal';
import DashboardCard from '@/components/shared/DashboardCard';
import { Button, Col, Modal, Row, message } from 'antd';
import InfoCard from '@/components/shared/InfoCard';
import EmployeeEditLeaveRequestModal from '@/components/modals/LM/editLeaveRequestModal';

const LeaveManagement = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [addLeaveRequestModalVisible, setAddLeaveRequestModalVisible] = useState<boolean>(false);
    const [editData, setEditData] = useState<any>({});
    const [editLeaveRequestModalVisible, setEditLeaveRequestModalVisible] = useState<boolean>(false);

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;
    const employeeID: string = context.employeeID;

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

        const ds: any[] = data.filter((d) => d.employeeID === employeeID);

        setDataSource(ds);
        setLoading(false);
    }), [employeeID]);

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

    const matches = useMediaQuery('(min-width:900px)');
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
    useEffect(() => {
        setColumnVisibilityModel(
            {
                leaveType: matches,
                authorizedDays: matches,
                firstDayOfLeave: matches,
                lastDayOfLeave: matches,
                dateOfReturn: matches,
                numberOfLeaveDaysRequested: matches,
                balanceLeaveDays: matches,
                actions: matches,
            }
        );
    }, [matches]);

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
            <Row
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}
            >
                <Col xs={20} xl={4} xxl={4}>
                    <InfoCard title='Balance Leave Days'>
                        <Typography variant='h6' style={{ display: "flex", justifyContent: "center" }}>
                            10
                        </Typography>
                    </InfoCard>
                </Col>

                <Col xs={20} xl={4} xxl={4}>
                    <InfoCard title='Number of Leave Days Taken'>
                        <Typography variant='h6' style={{ display: "flex", justifyContent: "center" }}>
                            {employeeData.numberOfLeaveDaysTaken}
                        </Typography>
                    </InfoCard>
                </Col>
            </Row>

            <DashboardCard title="Leave Management" action={<AddButton />}>
                <>
                    <Box sx={{ overflow: 'auto', width: { xs: 'auto', sm: 'auto' } }}>
                        <div style={{ height: "calc(100vh - 200px)", width: '100%' }}>
                            <DataGrid
                                rows={dataSource}
                                loading={loading}
                                columns={columns}
                                autoPageSize={true}
                                components={{
                                    Toolbar: GridToolbar,
                                }}
                                disableRowSelectionOnClick={true}
                                columnVisibilityModel={columnVisibilityModel}
                                onColumnVisibilityModelChange={(newModel) =>
                                    setColumnVisibilityModel(newModel)
                                }
                            />
                        </div>
                    </Box>
                </>
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