import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';

import { refuseAttendanceList, refuseBatchAttendanceList } from '@/backend/api/TAM/refuseAttendanceList';
import { validateAttendanceList, validateBatchAttendanceList } from '@/backend/api/TAM/validateAttendanceList';
import { db } from '@/backend/api/firebase';
import { calculateAbsentDays } from '@/backend/functions/absentDays';
import { calculatePeriodWorkingDays } from '@/backend/functions/periodWorkingDays';
import { calculateWorkedDays } from '@/backend/functions/workedDays';
import { AttendanceData } from '@/backend/models/attendanceData';
import { EmployeeData } from '@/backend/models/employeeData';
import AppContext from '@/components/context/AppContext';
import ManagerAttendanceListView from '@/components/modals/Manager/viewAttendanceListModal';
import EmployeeAttendanceEdit from '@/components/modals/TAM/Employee/editAttendanceListModal';
import DashboardCard from '@/components/shared/DashboardCard';
import { Button, Modal, Space, message } from 'antd';

const AttendanceValidation = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [attendanceListViewModalOpen, setAttendanceListViewModalOpen] = useState<boolean>(false);
    const [attendanceListEditModalOpen, setAttendanceListEditModalOpen] = useState<boolean>(false);
    const [activeAttendanceData, setActiveAttendanceDate] = useState<any>();

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

    useEffect(() => onSnapshot(collection(db, "attendance"), (snapshot: QuerySnapshot<DocumentData>) => {
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

                    if (rID === doc.employeeID && doc.state === "Submitted") {
                        doc.firstName = user.firstName;
                        doc.lastName = user.lastName;
                        doc.employmentPosition = user.employmentPosition;

                        const shiftType: string = doc.associatedShiftType;

                        // getting the shift type data from hrSettings data array
                        const shiftTypeData: any = hrSettings.find((e: any) => e.name === shiftType) ?? {};

                        // getting the working days data from the filtered shift type data
                        const workingDays: string[] = shiftTypeData.workingDays ?? [];

                        // calculating the period working days based on the shift type working days
                        const periodWorkingDays: number = calculatePeriodWorkingDays(doc, workingDays);

                        // calculate the worked days
                        const workedDays: number = calculateWorkedDays(doc);

                        // calculate the absent days
                        const absentDays: number = calculateAbsentDays(doc);

                        // adding the period working days, worked days and absent days to the document
                        doc.periodWorkingDays = periodWorkingDays;
                        doc.workedDays = workedDays;
                        doc.absentDays = absentDays;

                        ds.push(doc);
                    }
                });
            });

            setDataSource(ds);
            setLoading(false);

        }
    }), [hrSettings, reportees, employees]);

    const validateAttendance = (id: string) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await validateAttendanceList(id)
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

    const refuseAttendance = (id: string) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await refuseAttendanceList(id, "LM")
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
            field: 'attendancePeriod',
            headerName: 'Attendance Period',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'year',
            headerName: 'Year',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'periodWorkingDays',
            headerName: 'Period Working Days',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'workedDays',
            headerName: 'Worked Days',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'absentDays',
            headerName: 'Absent Days',
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
            field: 'stage',
            headerName: 'Stage',
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
                        label='Validate'
                        icon={<CheckOutlined />}
                        onClick={() => {
                            validateAttendance(params.row.id);
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={2}
                        label='Refuse'
                        icon={<CloseOutlined />}
                        onClick={() => {
                            refuseAttendance(params.row.id);
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
    const validateBatchAttendance = () => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await validateBatchAttendanceList(selections)
                    .then((res: boolean) => {
                        message.success("Success");
                    })
                    .catch((err: any) => {
                        console.log("error deleting batch: ", err);
                    });
            }
        });
    };

    const refuseBatchAttendance = () => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await refuseBatchAttendanceList(selections, "LM")
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
                            validateBatchAttendance();
                        }}
                    >
                        Validate
                    </Button>

                    <Button
                        type='primary'
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => {
                            refuseBatchAttendance();
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
            <DashboardCard title="Attendance Validation" action={<SideButtons />}>
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
                            onRowClick={(params: GridRowParams) => {
                                const row: AttendanceData = params.row;

                                setActiveAttendanceDate(row);
                                setAttendanceListViewModalOpen(true);
                            }}
                        />
                    </div>
                </Box>
            </DashboardCard>

            <ManagerAttendanceListView
                open={attendanceListViewModalOpen}
                setOpen={setAttendanceListViewModalOpen}
                attendanceData={activeAttendanceData}
            />

            <EmployeeAttendanceEdit
                open={attendanceListEditModalOpen}
                setOpen={setAttendanceListEditModalOpen}
                attendanceData={activeAttendanceData}
            />
        </>
    );
};

export default AttendanceValidation;