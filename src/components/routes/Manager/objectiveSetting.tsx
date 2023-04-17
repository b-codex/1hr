import DashboardCard from '@/components/shared/DashboardCard';
import { DeleteOutlined, EditOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { db } from '@/backend/api/firebase';
import ManagerAddObjectiveModal from '@/components/modals/Manager/addObjectiveModal';
import { Button, Modal, Space, Tag, message } from 'antd';
import { ObjectiveData } from '@/backend/models/objectiveData';
import ManagerEditObjectiveModal from '@/components/modals/Manager/editObjectiveModal';
import { deleteObjective } from '@/backend/api/Manager/deleteObjective';

const ObjectiveSetting = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<ObjectiveData>();

    useEffect(() => onSnapshot(collection(db, "objective"), (snapshot: QuerySnapshot<DocumentData>) => {
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

    /* creating columns. */
    const columns: GridColDef[] = [
        // {
        //     field: 'timestamp',
        //     headerName: 'Timestamp',
        //     flex: 1,
        //     hideable: false,
        // },
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
        // {
        //     field: 'specificity',
        //     headerName: 'Specificity',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'measurability',
        //     headerName: 'Measurability',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'attainability',
        //     headerName: 'Attainability',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'relevancy',
        //     headerName: 'Relevancy',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'timePeriod',
        //     headerName: 'Time Period',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'targetDate',
        //     headerName: 'Target Date',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'completionRate',
        //     headerName: 'Completion Rate',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'period',
        //     headerName: 'Period',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'roundOfEvaluation',
        //     headerName: 'Round Of Evaluation',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'performanceYear',
        //     headerName: 'Performance Year',
        //     flex: 1,
        //     // hideable: false,
        // },
        // {
        //     field: 'employees',
        //     headerName: 'Employees',
        //     flex: 2,
        //     // hideable: false,
        //     renderCell: (params: GridRenderCellParams) => {
        //         return (
        //             <Space>
        //                 {
        //                     params.row.employees.map((employee: string) => <Tag key={employee}>{employee}</Tag>)
        //                 }
        //             </Space>
        //         )
        //     },
        // },
        // {
        //     field: 'objectiveResult',
        //     headerName: 'Objective Result',
        //     flex: 1,
        //     // hideable: false,
        // },
        {
            field: 'relatedKPI',
            headerName: 'Related KPI',
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
                            setEditData(params.row);
                            setIsEditModalOpen(true);
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={1}
                        label='Delete'
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            objectiveDelete(params.row.id);
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
                // title: matches,
                relatedKPI: matches,
                completionRate: matches,
                actions: matches,
            }
        );
    }, [matches]);

    const AddButton = () => {
        return (
            <>
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setIsAddModalOpen(true);
                    }}
                >
                    Add
                </Button>
            </>
        );
    };

    const objectiveDelete = (id: string) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await deleteObjective(id)
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

    return (
        <>
            <DashboardCard title="Objective Setting" action={<AddButton />}>
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

            <ManagerAddObjectiveModal
                open={isAddModalOpen}
                setOpen={setIsAddModalOpen}
            />

            <ManagerEditObjectiveModal
                open={isEditModalOpen}
                setOpen={setIsEditModalOpen}
                data={editData as ObjectiveData}
            />
        </>
    );
};

export default ObjectiveSetting;