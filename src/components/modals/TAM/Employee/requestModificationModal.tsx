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
                children={<RequestModification />}
            />
        </>
    );
}

function RequestModification() {
    return (
        <>
        </>
    );
}
