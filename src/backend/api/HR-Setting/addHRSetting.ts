import { doc, setDoc } from "firebase/firestore";
import { batchAdd } from "../batch";
import { hrSettingsCollection } from "../firebase";
import { fetchPeriodicOption, fetchEmployees } from "../getFunctions";

// add hrSetting
export const addHRSetting = async (data: any) => {

    let result: boolean = false;

    if (data.type === "Evaluation Campaign") {
        const period: string = data.period;
        const round: string = data.round;
        const campaignName: string = data.campaignName;
        const campaignStartDate: string = data.startDate;
        const campaignEndDate: string = data.endDate;

        const periodicOptionData: any = (await fetchPeriodicOption(period)).at(0);
        const chosenRound: any = periodicOptionData.evaluations.find((val: any) => val.round === round);
        const from: string = chosenRound.from;
        const to: string = chosenRound.to;

        const newDataArray: any[] = [];

        const employees: any[] = await fetchEmployees();
        employees.forEach(employee => {
            const newData: any = {
                employeeID: employee.employeeID,
                roundOfEvaluation: round,
                stage: "",
                performanceYear: periodicOptionData.year,
                periodStart: from,
                periodEnd: to,
                campaignStartDate: campaignStartDate,
                campaignEndDate: campaignEndDate,
                campaignName: campaignName,
            };

            newDataArray.push(newData);
        });

        // console.log("newDataArray: ", newDataArray);

        const newDoc = doc(hrSettingsCollection);
        result = await setDoc(newDoc, { ...data, id: newDoc.id, })
            .then(async () => {
                return await batchAdd(newDataArray, 'performanceEvaluation');
            })
            .catch(err => {
                console.log(err);
                return false;
            });
    }

    else {
        const newDoc = doc(hrSettingsCollection);

        result = await setDoc(newDoc, { ...data, id: newDoc.id, })
            .then(() => true)
            .catch(err => {
                console.log(err);
                return false;
            });
    }

    return result;
}
