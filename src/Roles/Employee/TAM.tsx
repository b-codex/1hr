import FullLayout from '@/layouts/full/FullLayout';
import { EditOutlined, EyeOutlined, PullRequestOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { ReactElement, useEffect, useState } from 'react';

import { db } from '@/backend/api/firebase';
import { calculateAbsentDays } from '@/backend/functions/absentDays';
import { calculatePeriodWorkingDays } from '@/backend/functions/periodWorkingDays';
import { calculateWorkedDays } from '@/backend/functions/workedDays';
import EmployeeAttendanceEdit from '@/components/modals/TAM/Employee/editAttendanceListModal';
import EmployeeRequestModificationModal from '@/components/modals/TAM/Employee/requestModificationModal';
import EmployeeAttendanceListView from '@/components/modals/TAM/Employee/viewAttendanceListModal';
import DashboardCard from '@/components/shared/DashboardCard';

const EmployeeTimeAndAttendanceManagement = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [attendanceListViewModalOpen, setAttendanceListViewModalOpen] = useState<boolean>(false);
    const [attendanceListEditModalOpen, setAttendanceListEditModalOpen] = useState<boolean>(false);
    const [activeAttendanceData, setActiveAttendanceDate] = useState<any>();

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
            data.forEach((doc) => {
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
            });

            setDataSource(data);
            setLoading(false);
        }
    }), [hrSettings]);

    const [selectedMonth, setSelectedMonth] = useState<any>({});
    const [requestModificationModalOpen, setRequestModificationModalOpen] = useState<boolean>(false);

    /* creating columns. */
    const columns: GridColDef[] = [
        {
            field: 'attendancePeriod',
            headerName: 'Attendance Period',
            flex: 1,
            hideable: false,
        },
        {
            field: 'year',
            headerName: 'Year',
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
            field: 'associatedShiftType',
            headerName: 'Associated Shift Type',
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
            field: "actions",
            headerName: 'Actions',
            type: "actions",
            flex: 1,
            width: 100,
            getActions: (params: any) => {
                let actionArray: any[] = [
                    <GridActionsCellItem
                        key={1}
                        label='View'
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setActiveAttendanceDate(params.row);
                            setAttendanceListViewModalOpen(true);
                        }}
                        showInMenu
                    />
                ];

                // if its open, then add the edit button to the array
                // if (params.row.stage === 'Open') {
                actionArray.push(<GridActionsCellItem
                    key={2}
                    label='Edit'
                    icon={<EditOutlined />}
                    onClick={() => {
                        setActiveAttendanceDate(params.row);
                        setAttendanceListEditModalOpen(true);
                    }}
                    showInMenu
                />);
                // }

                // if its closed, then add the request modification button to the array
                if (params.row.stage === 'Closed') {
                    actionArray.push(<GridActionsCellItem
                        key={2}
                        label='Request Modification'
                        icon={<PullRequestOutlined />}
                        onClick={() => {
                            setSelectedMonth(params.row);
                            setRequestModificationModalOpen(true);
                        }}
                        showInMenu
                    />);
                }

                return actionArray;
            }
        },
    ];

    const matches = useMediaQuery('(min-width:900px)');
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
    useEffect(() => {
        setColumnVisibilityModel(
            {
                year: matches,
                associatedShiftType: matches,
                periodWorkingDays: matches,
                workedDays: matches,
                absentDays: matches,
                actions: matches,
            }
        );
    }, [matches]);

    return (
        <>
            <DashboardCard title="Time & Attendance Management">
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
            </DashboardCard>

            <EmployeeAttendanceListView
                open={attendanceListViewModalOpen}
                setOpen={setAttendanceListViewModalOpen}
                attendanceData={activeAttendanceData}
            />

            <EmployeeAttendanceEdit
                open={attendanceListEditModalOpen}
                setOpen={setAttendanceListEditModalOpen}
                attendanceData={activeAttendanceData}
            />

            <EmployeeRequestModificationModal
                open={requestModificationModalOpen}
                setOpen={setRequestModificationModalOpen}
                month={selectedMonth.attendancePeriod ?? ""}
                data={selectedMonth}
            />
        </>
    );
};

export default EmployeeTimeAndAttendanceManagement;
// EmployeeTimeAndAttendanceManagement.getLayout = function getLayout(page: ReactElement) {
//     return <FullLayout>{page}</FullLayout>;
// };