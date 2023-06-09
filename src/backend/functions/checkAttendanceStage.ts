import moment from 'moment';
import { batchUpdate } from '../api/batch';
import { fetchAttendanceList } from '../api/getFunctions';
import { months } from '../constants/months';
import { AttendanceData } from '../models/attendanceData';

const date: number = moment().date();
const month: string = months[moment().month()];

export function checkAttendanceStage() {
    {
        (async () => {
            const newData: any[] = [];

            const attendanceList: any[] = await fetchAttendanceList();

            attendanceList.forEach((doc: AttendanceData) => {

                const currentMonth: number = months.indexOf(month);
                const docMonth: number = months.indexOf(doc.attendancePeriod);

                if (docMonth < currentMonth) newData.push({ ...doc, stage: "Closed" });
                if (docMonth > currentMonth) newData.push({ ...doc, stage: "Incoming" });

                if (docMonth === currentMonth) {
                    if (date < 23) doc.stage = "Incoming";
                    if (date >= 23 && date <= 25) doc.stage = "Open";
                    if (date > 25) doc.stage = "Closed";

                    newData.push(doc);
                }
            });

            // console.log("newData: ", newData);

            await batchUpdate(newData, "attendance")
                .then((res: boolean) => { })
                .catch((err: string) => {
                    console.log("error updating batch: ", err);
                });

            // console.log("update");
        })();
    }
};
