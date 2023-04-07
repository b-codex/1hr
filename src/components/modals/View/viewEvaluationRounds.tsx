import generateID from '@/backend/constants/generateID';
import DashboardCard from '@/components/shared/DashboardCard';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import CustomModal from '../customModal';

export default function ViewEvaluationRoundsModal(
    {
        open,
        setOpen,
        data,
    }: {
        open: boolean,
        setOpen: any,
        data: any,
    }
) {
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        const ds: any[] = [];

        data.forEach((d: any) => {
            ds.push({
                id: generateID(),
                ...d,
            });
        });

        setDataSource(ds);
    }, [data])


    /* creating columns. */
    const columns: GridColDef[] = [
        {
            field: 'round',
            headerName: 'Round',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'from',
            headerName: 'From',
            flex: 1,
            // hideable: false,
        },
        {
            field: 'to',
            headerName: 'To',
            flex: 1,
            // hideable: false,
        },
    ];

    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle={`Evaluation Rounds`}
                width={matches ? "50%" : "100%"}
            >
                <DashboardCard title="" className='myCard2'>
                    <Box sx={{ overflow: 'auto', width: { xs: 'auto', sm: 'auto' } }}>
                        <div style={{ height: matches ? "calc(100vh - 600px)" : "100vh", width: '100%' }}>
                            <DataGrid
                                rows={dataSource}
                                loading={false}
                                columns={columns}
                                autoPageSize={true}
                                components={{
                                    Toolbar: GridToolbar,
                                }}
                                disableRowSelectionOnClick={true}
                            />
                        </div>
                    </Box>
                </DashboardCard>
            </CustomModal>
        </>
    );
}
