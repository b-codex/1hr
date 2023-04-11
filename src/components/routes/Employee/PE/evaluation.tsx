import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';

import { db } from '@/backend/api/firebase';
import { EmployeeData } from '@/backend/models/employeeData';
import AppContext from '@/components/context/AppContext';
import DashboardCard from '@/components/shared/DashboardCard';
import { useRouter } from 'next/router';
import { AttendanceData } from '@/backend/models/attendanceData';

const PerformanceEvaluation = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const [addLeaveRequestModalVisible, setAddLeaveRequestModalVisible] = useState<boolean>(false);
    const [editData, setEditData] = useState<any>({});
    const [editLeaveRequestModalVisible, setEditLeaveRequestModalVisible] = useState<boolean>(false);

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;
    const employeeID: string = context.employeeID;

    useEffect(() => onSnapshot(collection(db, "performanceEvaluation"), (snapshot: QuerySnapshot<DocumentData>) => {
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

    /* creating columns. */
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
            hideable: false,
        },
        {
            field: 'employeeID',
            headerName: 'Employee ID',
            flex: 1,
            hideable: false,
        },
        {
            field: 'roundOfEvaluation',
            headerName: 'Round of Evaluation',
            flex: 1,
            hideable: false,
        },
        {
            field: 'stage',
            headerName: 'Stage',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'performanceYear',
            headerName: 'Performance Year',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'periodStart',
            headerName: 'Period Start',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'periodEnd',
            headerName: 'Period End',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'campaignStartDate',
            headerName: 'Campaign Start Date',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'campaignEndDate',
            headerName: 'Campaign End Date',
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
                        label='Competency Assessment'
                        onClick={() => {
                            router.push('/pe_com');
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={1}
                        label='Objectives'
                        onClick={() => {
                            router.push('/pe_obj');
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
                periodStart: matches,
                periodEnd: matches,
                campaignStartDate: matches,
                campaignEndDate: matches,
                actions: matches,
            }
        );
    }, [matches]);

    return (
        <>
            <DashboardCard title="Performance Evaluation">
                <Box sx={{ overflow: 'auto', width: { xs: 'auto', sm: 'auto' } }}>
                    <div style={{ height: "calc(100vh - 200px)", width: '100%', }}>
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
                            onRowClick={(params: GridRowParams) => {
                                const row: AttendanceData = params.row;
                                console.log(row);
                            }}
                        />
                    </div>
                </Box>
            </DashboardCard>
        </>
    );
};

export default PerformanceEvaluation;