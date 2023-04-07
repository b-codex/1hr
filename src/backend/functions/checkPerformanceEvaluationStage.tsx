import moment from 'moment';
import { batchUpdate } from '../api/batch';
import { fetchPerformanceEvaluations } from '../api/getFunctions';
import { months } from '../constants/months';

const month: string = months[moment().month()];
const currentMonthIndex: number = months.indexOf(month);

export function checkPerformanceEvaluationStage() {
    {
        (async () => {
            const newData: any[] = [];

            const performanceEvaluations: any[] = await fetchPerformanceEvaluations();

            performanceEvaluations.forEach((doc: any) => {

                const periodStartMonth: string = doc.periodStart;
                const periodEndMonth: string = doc.periodEnd;

                const periodStartMonthIndex: number = months.indexOf(periodStartMonth);
                const periodEndMonthIndex: number = months.indexOf(periodEndMonth);
                
                if (currentMonthIndex > periodStartMonthIndex && currentMonthIndex > periodEndMonthIndex) doc.stage = "Closed";
                if (currentMonthIndex >= periodStartMonthIndex && currentMonthIndex <= periodEndMonthIndex) doc.stage = "Open";
                if (currentMonthIndex < periodStartMonthIndex && currentMonthIndex < periodEndMonthIndex) doc.stage = "Incoming";

                newData.push(doc);
            });

            // console.log("newData: ", newData);

            await batchUpdate(newData, "performanceEvaluation")
                .then((res: boolean) => { })
                .catch((err: string) => {
                    console.log("error updating batch: ", err);
                });

            // console.log("update");
        })();
    }
};
