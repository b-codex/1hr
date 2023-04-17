import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { db, deleteHRSetting } from '@/backend/api/firebase';
import { groupBy } from '@/backend/constants/groupBy';
import HRAddSetting from '@/components/modals/HR-Manager/addHRSettingModal';
import HREditSetting from '@/components/modals/HR-Manager/editHRSettingModal';
import DashboardCard from '@/components/shared/DashboardCard';
import { Button, Modal, Space, Tag, message } from 'antd';

const CompetencyPositionAssociation = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [hrAddSettingModalOpen, setHrAddSettingModalOpen] = useState<boolean>(false);
    const [hrEditSettingModalOpen, setHrEditSettingModalOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<any>({});

    useEffect(() => onSnapshot(collection(db, "hrSettings"), (snapshot: QuerySnapshot<DocumentData>) => {
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

            return date1.isBefore(date2) ? 1 : -1;
        });

        const groupedSettings: any = groupBy("type", data);
        const filtered: any[] = groupedSettings['Competency Position Association'] ?? [];

        setDataSource(filtered);
        setLoading(false);
    }), []);

    const hrSettingDelete = (id: string) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await deleteHRSetting(id)
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
            field: 'timestamp',
            headerName: 'Timestamp',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'pid',
            headerName: 'Position ID',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'cid',
            headerName: 'Competency ID',
            flex: 2,
            // hideable: false,
        },
        {
            field: 'grade',
            headerName: 'Grade',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'threshold',
            headerName: 'Threshold',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'active',
            headerName: 'Active',
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
                        icon={<EditOutlined />}
                        label='Edit'
                        onClick={() => {
                            setEditData(params.row);
                            setHrEditSettingModalOpen(true);
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<DeleteOutlined />}
                        label='Delete'
                        onClick={() => {
                            hrSettingDelete(params.row.id);
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

    const AddButton = () => {
        return (
            <>
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setHrAddSettingModalOpen(true);
                    }}
                >
                    Add
                </Button>
            </>
        );
    };

    return (
        <>
            <DashboardCard title="Competency Position Association" className='myCard2' action={<AddButton />}>
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

            <HRAddSetting
                open={hrAddSettingModalOpen}
                setOpen={setHrAddSettingModalOpen}
                type={"Competency Position Association"}
            />

            <HREditSetting
                open={hrEditSettingModalOpen}
                setOpen={setHrEditSettingModalOpen}
                type={"Competency Position Association"}
                data={editData}
            />
        </>
    );
};

export default CompetencyPositionAssociation;