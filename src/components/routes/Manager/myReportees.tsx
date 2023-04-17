import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';

import { db } from '@/backend/api/firebase';
import DashboardCard from '@/components/shared/DashboardCard';
import { Space, Tag } from 'antd';
import AppContext from '@/components/context/AppContext';
import { EmployeeData } from '@/backend/models/employeeData';

const MyReportees = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;
    const employeeID: string = context.employeeID;
    const reportees: string[] = employeeData.reportees;

    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const ds: any[] = [];

        data.forEach(doc => {
            if (reportees?.includes(doc.employeeID)) ds.push(doc);
        });

        setDataSource(ds);
        setLoading(false);
    }), [reportees]);

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
            field: 'gender',
            headerName: 'Gender',
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
            field: 'section',
            headerName: 'Section',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'department',
            headerName: 'Department',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'workingLocation',
            headerName: 'Working Location',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'contractStartingDate',
            headerName: 'Contract Starting Date',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'reportingLineManagerPosition',
            headerName: 'Reporting Line Manager Position',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'reportingLineManagerName',
            headerName: 'Reporting Line Manager Name',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'gradeLevel',
            headerName: 'Grade Level',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'probationPeriodEndDate',
            headerName: 'Probation Period End Date',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'eligibleLeaveDays',
            headerName: 'Eligible Leave Days',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'numberOfLeaveDaysTaken',
            headerName: 'Number of Leave Days Taken',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'contractType',
            headerName: 'Contract Type',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'shiftType',
            headerName: 'Shift Type',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'personalPhoneNumber',
            headerName: 'Personal Phone Number',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'lastDateOfProbation',
            headerName: 'Last Date of Probation',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'personalEmail',
            headerName: 'Personal Email',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'companyEmail',
            headerName: 'Company Email',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'reasonOfLeaving',
            headerName: 'Reason of Leaving',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'managerPosition',
            headerName: 'Manager Position',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'reportees',
            headerName: 'Reportees',
            flex: 1,
            // hideable: false,
            renderCell: (params: any) => {
                return (
                    <Space>
                        {
                            params.row.reportees?.map((row: any) => {
                                return <Tag key={row}>{row}</Tag>
                            })
                        }
                    </Space>
                )
            },
        },
    ];

    const matches = useMediaQuery('(min-width:900px)');
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
    useEffect(() => {
        setColumnVisibilityModel(
            {
                gender: false,
                section: false,
                department: false,
                contractStartingDate: false,
                reportingLineManagerPosition: false,
                reportingLineManagerName: false,
                gradeLevel: false,
                probationPeriodEndDate: false,
                eligibleLeaveDays: false,
                numberOfLeaveDaysTaken: false,
                contractType: false,
                lastDateOfProbation: false,
                personalEmail: false,
                companyEmail: false,
                reasonOfLeaving: false,
                managerPosition: false,
                reportees: false,

                // for responsive
                workingLocation: matches,
                personalPhoneNumber: matches,
                shiftType: matches,
            }
        );
    }, [matches]);

    return (
        <>
            <DashboardCard title="My Reportees">
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

                        />
                    </div>
                </Box>
            </DashboardCard>
        </>
    );
};

export default MyReportees;