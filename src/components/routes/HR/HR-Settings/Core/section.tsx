import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { db } from '@/backend/api/firebase';
import { Button, Modal, Space, Tag, message } from 'antd';

import { groupBy } from '@/backend/constants/groupBy';
import HRAddSetting from '@/components/modals/HR-Manager/addHRSettingModal';
import DashboardCard from '@/components/shared/DashboardCard';
import { deleteHRSetting } from '@/backend/api/HR-Setting/deleteHRSetting';
import HREditSetting from '@/components/modals/HR-Manager/editHRSettingModal';

const Section = () => {
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
        const departments: any[] = groupedSettings['Section'] ?? [];

        setDataSource(departments);
        setLoading(false);
    }), []);

    const rowDelete = (id: string) => {
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
            field: 'sectionID',
            headerName: 'Section ID',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'sectionHeadName',
            headerName: 'Section Head Name',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'relatedDept',
            headerName: 'Related Dept',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'associatedEmployees',
            headerName: 'Associated Employees',
            flex: 2,
            // hideable: false,
            renderCell: (params: any) => {
                return (
                    <Space>
                        {
                            params.row.associatedEmployees?.map((row: any) => {
                                return <Tag key={row}>{row}</Tag>
                            })
                        }
                    </Space>
                )
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
                            rowDelete(params.row.id);
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
                timestamp: false,
                startDate: matches,
                endDate: matches,
                // relatedDept: matches,
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
            <DashboardCard title="Section" className='myCard2' action={<AddButton />}>
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
                type={"Section"}
            />

            <HREditSetting
                open={editModalOpen}
                setOpen={setEditModalOpen}
                type={"Section"}
                data={editData}
            />
        </>
    );
};

export default Section;