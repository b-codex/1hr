import { log } from 'console';
import { doc, setDoc } from 'firebase/firestore';
import { leaveManagementCollection } from '../firebase';
import { LeaveRequestData } from './../../models/leaveRequestData';

// add leaveRequest
export const addLeaveRequest = async (data: LeaveRequestData) => {

    let result: boolean = false;

    const newLeaveRequest = doc(leaveManagementCollection);

    result = await setDoc(newLeaveRequest, { ...data, id: newLeaveRequest.id, })
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;

}
