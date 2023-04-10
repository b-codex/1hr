import EmployeeLeaveManagement from '@/Roles/Employee/LM';
import { db } from '@/backend/api/firebase';
import { EmployeeData } from '@/backend/models/employeeData';
import DashboardCard from '@/components/shared/DashboardCard';
import FullLayout from '@/layouts/full/FullLayout';
import { Spin } from 'antd';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import router from 'next/router';
import { ReactElement, useEffect, useState } from 'react';

const LeaveManagement = () => {
    const [role, setRole] = useState<string>('');

    const [employeeID, setEmployeeID] = useState<string>('');

    useEffect(() => {
        const loggedIn: string = localStorage.getItem('loggedIn') as string;
        // console.log("Logged In: ", loggedIn);

        if (loggedIn === null || loggedIn === undefined) {
            router.push('/');
        }
        else {
            const user: EmployeeData = JSON.parse(localStorage.getItem('user') as string);
            setEmployeeID(`${user.employeeID}`);

            // setPageLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const employee: EmployeeData | undefined = data.find((doc) => doc.employeeID === employeeID);

        if (employee) {
            //! check role and push route accordingly
            if (employee.managerPosition === true) {
                if (employee.positionLevel.toLowerCase() === "hr-manager") {
                    setRole("hr-manager");
                }

                if (employee.positionLevel.toLowerCase() === "manager") {
                    setRole("manager");
                }
            }

            if (employee.managerPosition === false) {
                if (employee.positionLevel.toLowerCase() === "employee") {
                    setRole("employee");
                }
            }
        }

    }), [employeeID]);

    if (role === '') {
        return (
            <>
                {/* <DashboardCard className='loadingContainer'>
                    <Spin />
                </DashboardCard> */}
            </>
        );
    }

    if (role === 'employee') {
        return (
            <>
                <EmployeeLeaveManagement />
            </>
        )
    }

    if (role === 'hr-manager') {
        return (
            <>
            </>
        )
    }

    if (role === 'manager') {
        return (
            <>
            </>
        )
    }
};

export default LeaveManagement;
LeaveManagement.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};