import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import DashboardCard from '@/components/shared/DashboardCard';

import { db } from '@/backend/api/firebase';
import { EmployeeData } from '@/backend/models/employeeData';
import AppContext from '@/components/context/AppContext';

const PEObjectives = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;
    const employeeID: string = context.employeeID;

    useEffect(() => onSnapshot(collection(db, "objectives"), (snapshot: QuerySnapshot<DocumentData>) => {
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
            field: 'objectiveID',
            headerName: 'Objective ID',
            flex: 1,
            hideable: false,
        },
        {
            field: 'state',
            headerName: 'State',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'specificity',
            headerName: 'Specificity',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'measurability',
            headerName: 'Measurability',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'attainability',
            headerName: 'Attainability',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'relevancy',
            headerName: 'Relevancy',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'timePeriod',
            headerName: 'Time Period',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'targetDate',
            headerName: 'Target Date',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'completionRate',
            headerName: 'Completion Rate',
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
                        label='Edit'
                        icon={<EditOutlined />}
                        onClick={() => {

                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={1}
                        label='Delete'
                        icon={<DeleteOutlined />}
                        onClick={() => {

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
            <DashboardCard title="EmployeeObjectives">
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
        </>
    );
};

export default PEObjectives;