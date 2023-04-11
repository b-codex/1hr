import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { db, deleteHRSetting } from '@/backend/api/firebase';
import { groupBy } from '@/backend/constants/groupBy';
import HRAddSetting from '@/components/modals/PE/HR-Manager/addHRSettingModal';
import HREditSetting from '@/components/modals/PE/HR-Manager/editHRSettingModal';
import DashboardCard from '@/components/shared/DashboardCard';
import { Button, Modal, Space, Tag, message } from 'antd';

const ShiftTypes = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<any>({});
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

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

            return date1.isBefore(date2) ? -1 : 1;
        });

        const groupedSettings: any = groupBy("type", data);
        const leaveRequests: any[] = groupedSettings['Shift Type'] ?? [];

        setDataSource(leaveRequests);
        setLoading(false);
    }), []);

    const leaveTypeDelete = (id: string) => {
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
            field: 'name',
            headerName: 'Name',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'workingDays',
            headerName: 'Working Days',
            flex: 3,
            // hideable: false,
            renderCell: (params: any) => {
                const workingDays: string[] = params.row.workingDays;

                return (
                    <>
                        <Space direction='horizontal'>
                            {workingDays.map(day => <Tag key={day}>{day}</Tag>)}
                        </Space>
                    </>
                );
            },
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
                            setEditModalOpen(true);
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<DeleteOutlined />}
                        label='Delete'
                        onClick={() => {
                            leaveTypeDelete(params.row.id);
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
                timestamp: matches,
                active: matches,
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
                        setAddModalOpen(true);
                    }}
                >
                    Add
                </Button>
            </>
        );
    };

    return (
        <>
            <DashboardCard title="Shift Types" className='myCard2' action={<AddButton />}>
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
                open={addModalOpen}
                setOpen={setAddModalOpen}
                type={"Shift Type"}
            />

            <HREditSetting
                open={editModalOpen}
                setOpen={setEditModalOpen}
                type={"Shift Type"}
                data={editData}
            />
        </>
    );
};

export default ShiftTypes;