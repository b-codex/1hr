import { Box, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { batchDelete } from '@/backend/api/batch';
import { db, deleteEmployee } from '@/backend/api/firebase';
import HRManagerAddEmployeeModal from '@/components/modals/LM/HR-Manager/addEmployeeModal';
import HRManagerEditEmployeeModal from '@/components/modals/HR-Manager/editEmployeeModal';
import DashboardCard from '@/components/shared/DashboardCard';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tag, message } from 'antd';

const EmployeeManagement = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<any>({});

    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        setDataSource(data);
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
                await deleteEmployee(id)
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
            field: 'birthDate',
            headerName: 'Birth Date',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'birthPlace',
            headerName: 'Birth Place',
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
            field: 'maritalStatus',
            headerName: 'Marital Status',
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
            field: 'personalEmail',
            headerName: 'Personal Email',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'bankAccount',
            headerName: 'Bank Account',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'tinNumber',
            headerName: 'Tin Number',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'employeeID',
            headerName: 'Employee ID',
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
            field: 'contractStatus',
            headerName: 'Contract Status',
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
            field: 'probationPeriodEndDate',
            headerName: 'Probation Period End Date',
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
            field: 'reasonOfLeaving',
            headerName: 'Reason of Leaving',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'salary',
            headerName: 'Salary',
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
            field: 'companyEmail',
            headerName: 'Company Email',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'companyPhoneNumber',
            headerName: 'Company Phone Number',
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
            field: 'positionLevel',
            headerName: 'Position Level',
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
            field: 'band',
            headerName: 'Band',
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
            field: 'transportAllowance',
            headerName: 'Transport Allowance',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'mobileAllowance',
            headerName: 'Mobile Allowance',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'otherAllowance',
            headerName: 'Other Allowance',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'role',
            headerName: 'Role(s)',
            flex: 1,
            // hideable: false,
            renderCell: (params: any) => {
                return (
                    <Space>
                        {
                            params.row.role.map((row: any) => {
                                return <Tag key={row}>{row}</Tag>
                            })
                        }
                    </Space>
                )
            },
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
                        key={2}
                        label='Delete'
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            rowDelete(params.row.id);
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
                birthDate: false,
                birthPlace: false,
                maritalStatus: false,
                personalEmail: false,
                bankAccount: false,
                tinNumber: false,
                contractType: false,
                contractStatus: false,
                contractStartingDate: false,
                contractTerminationDate: false,
                probationPeriodEndDate: false,
                lastDateOfProbation: false,
                reasonOfLeaving: false,
                salary: false,
                eligibleLeaveDays: false,
                numberOfLeaveDaysTaken: false,
                companyEmail: false,
                companyPhoneNumber: false,
                workingLocation: false,
                managerPosition: false,
                reportees: false,
                reportingLineManagerPosition: false,
                reportingLineManagerName: false,
                gradeLevel: false,
                band: false,
                transportAllowance: false,
                mobileAllowance: false,
                otherAllowance: false,
                role: false,

                // for responsive
                gender: matches,
                employeeID: matches,
                positionLevel: matches,
                section: matches,
                department: matches,
                shiftType: matches,
                actions: matches,
            }
        );
    }, [matches]);

    /* A function that is called when a button is clicked. It is a confirmation modal that asks the user if
    they are sure they want to delete the selected items. If they click yes, it will call the
    batchDelete function. */
    const [selections, setSelections] = useState<string[]>([]);
    const deleteBatch = () => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await batchDelete(selections, "employee")
                    .then((res: boolean) => {
                        message.success("Success");
                    })
                    .catch((err: any) => {
                        console.log("error deleting batch: ", err);
                    });
            }
        });
    };

    function ActionButtons() {
        return (
            <>
                <Space key="1234">
                    <Button
                        key="1"
                        type="primary"
                        onClick={() => {
                            setIsAddModalOpen(true);
                        }}
                        icon={<PlusOutlined />}
                    >
                        Add
                    </Button>

                    {
                        selections.length > 0 &&
                        <>
                            <Button
                                key="2"
                                type="primary"
                                onClick={() => {
                                    deleteBatch();
                                }}
                                icon={<DeleteOutlined />}
                                danger
                            >
                                Delete Selected
                            </Button>
                        </>
                    }
                </Space>

            </>
        );
    }

    return (
        <>
            <DashboardCard title="Employee Management" action={<ActionButtons />}>
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

                        />
                    </div>
                </Box>
            </DashboardCard>

            <HRManagerAddEmployeeModal
                open={isAddModalOpen}
                setOpen={setIsAddModalOpen}
            />

            <HRManagerEditEmployeeModal
                data={editData}
                docID={editData.id}
                open={isEditModalOpen}
                setOpen={setIsEditModalOpen}
            />
        </>
    );
};

export default EmployeeManagement;