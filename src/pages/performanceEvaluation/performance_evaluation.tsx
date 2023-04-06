import FullLayout from '@/layouts/full/FullLayout';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { ReactElement, useEffect, useState } from 'react';
import DashboardCard from '../../components/shared/DashboardCard';

import { deleteLeaveRequest } from '@/backend/api/LM/deleteLeaveRequest';
import { db } from '@/backend/api/firebase';
import { Modal, message } from 'antd';

const PerformanceEvaluationManagement = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [addLeaveRequestModalVisible, setAddLeaveRequestModalVisible] = useState<boolean>(false);
    const [editData, setEditData] = useState<any>({});
    const [editLeaveRequestModalVisible, setEditLeaveRequestModalVisible] = useState<boolean>(false);

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

                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={1}
                        label='Objectives'
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
            <DashboardCard title="Performance Evaluation Management">
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
                        />
                    </div>
                </Box>
            </DashboardCard>
        </>
    );
};

export default PerformanceEvaluationManagement;
PerformanceEvaluationManagement.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};