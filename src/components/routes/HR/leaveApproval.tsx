import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';

import { refuseBatchLeaveRequest, refuseLeaveRequest } from '@/backend/api/LM/refuseAttendanceList';
import { approveBatchLeaveRequest, approveLeaveRequest } from '@/backend/api/LM/approveLeaveRequest';
import { db } from '@/backend/api/firebase';
import { EmployeeData } from '@/backend/models/employeeData';
import AppContext from '@/components/context/AppContext';
import DashboardCard from '@/components/shared/DashboardCard';
import { Button, Modal, Space, message } from 'antd';
import { LeaveData } from '@/backend/models/leaveData';

const LeaveApproval = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;
    const employeeID: string = context.employeeID;

    const [hrSettings, setHrSettings] = useState<any[]>([]);
    useEffect(() => onSnapshot(collection(db, "hrSettings"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        setHrSettings(data);
    }), []);

    const [reportees, setReportees] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        setEmployees(data);

        const manager: EmployeeData = data.find((user) => user.employeeID === employeeID);
        if (manager) setReportees(manager.reportees);

    }), [employeeID]);

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
            let date1: moment.Moment = moment(`${a.attendancePeriod} ${a.year}`, "MMMM YYYY");
            let date2: moment.Moment = moment(`${b.attendancePeriod} ${b.year}`, "MMMM YYYY");

            return date1.isBefore(date2) ? -1 : 1;
        });

        // checking for hrSettings length
        if (hrSettings.length > 0) {
            const ds: any[] = [];

            reportees?.forEach(rID => {
                data.forEach((doc) => {
                    const user: EmployeeData = employees.find((e) => e.employeeID === rID);

                    if (rID === doc.employeeID && doc.leaveStage === "Validated") {
                        doc.firstName = user.firstName;
                        doc.lastName = user.lastName;
                        doc.employmentPosition = user.employmentPosition;

                        ds.push(doc);
                    }
                });
            });

            setDataSource(ds);
            setLoading(false);

        }
    }), [hrSettings, reportees, employees]);

    const approveLeave = (id: string, leaveData: LeaveData) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await approveLeaveRequest(id, leaveData)
                    .then((res: boolean) => {
                        if (res) {
                            message.success('Success.');
                        }
                        else {
                            message.error('An Error Occurred.');
                        }
                    });
            }
        });
    };

    const refuseLeave = (id: string) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await refuseLeaveRequest(id, "HR")
                    .then((res: boolean) => {
                        if (res) {
                            message.success('Success.');
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
            field: 'firstName',
            headerName: 'First Name',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'employmentPosition',
            headerName: 'Employment Position',
            flex: 1,
            // hideable: false,
        },
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
                        label='Approve'
                        icon={<CheckOutlined />}
                        onClick={() => {
                            approveLeave(params.row.id, params.row);
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={2}
                        label='Refuse'
                        icon={<CloseOutlined />}
                        onClick={() => {
                            refuseLeave(params.row.id);
                        }}
                        showInMenu
                    />,
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
                year: false,
                state: false,
                stage: false,
                workedDays: matches,
                absentDays: matches,
                actions: matches,
            }
        );
    }, [matches]);

    const [selections, setSelections] = useState<string[]>([]);
    const approveBatchLeave = () => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await approveBatchLeaveRequest(selections, dataSource)
                    .then((res: boolean) => {
                        message.success("Success");
                    })
                    .catch((err: any) => {
                        console.log("error deleting batch: ", err);
                    });
            }
        });
    };

    const refuseBatchLeave = () => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await refuseBatchLeaveRequest(selections, "HR")
                    .then((res: boolean) => {
                        message.success("Success");
                    })
                    .catch((err: any) => {
                        console.log("error deleting batch: ", err);
                    });
            }
        });
    };

    function SideButtons() {
        if (selections.length > 0) {
            return (
                <Space>
                    <Button
                        type='primary'
                        icon={<CheckOutlined />}
                        onClick={() => {
                            approveBatchLeave();
                        }}
                    >
                        Approve
                    </Button>

                    <Button
                        type='primary'
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => {
                            refuseBatchLeave();
                        }}
                    >
                        Refuse
                    </Button>
                </Space>
            )
        }
        else {
            return <></>
        }
    }

    return (
        <>
            <DashboardCard title="Leave Approval" action={<SideButtons />}>
                <Box sx={{ overflow: 'auto', width: { xs: 'auto', sm: 'auto' } }}>
                    <div style={{ height: "calc(100vh - 200px)", width: '100%' }}>
                        <DataGrid
                            rows={dataSource}
                            loading={loading}
                            columns={columns}
                            autoPageSize={true}
                            checkboxSelection={matches}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            disableRowSelectionOnClick={true}
                            columnVisibilityModel={columnVisibilityModel}
                            onColumnVisibilityModelChange={(newModel) =>
                                setColumnVisibilityModel(newModel)
                            }
                            onStateChange={(params) => {
                                // console.log("params: ", params);
                                const selection: string[] = params.rowSelection;

                                setSelections(selection);
                            }}
                        />
                    </div>
                </Box>
            </DashboardCard>
        </>
    );
};

export default LeaveApproval;