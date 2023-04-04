import React from 'react'
import CustomModal from '../../customModal';

export default function EmployeeRequestModificationModal(
    {
        open,
        setOpen,
    }: {
        open: boolean,
        setOpen: any,
    }
) {
    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle=''
            >
                <RequestModification />
            </CustomModal>
        </>
    );
}

function RequestModification() {
    return (
        <>
        </>
    );
}
