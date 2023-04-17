import { groupBy } from "@/backend/constants/groupBy";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { fetchHRSettings, fetchPerformanceEvaluations } from "../getFunctions";

// delete hrSetting
export async function deleteHRSetting(id: string, data?: any) {
    let result: boolean = false;

    if (data !== undefined) {
        if (data.type === "Periodic Option") {
            const idArrayHRSettings: string[] = [id];
            const idArrayPE: string[] = [];

            const periodName: string = data.periodName;

            // fetch all HR settings
            const allHRSettings: any[] = await fetchHRSettings();
            const groupedHRSettings: any = groupBy("type", allHRSettings);

            // from evaluation campaign, find the docs with the same period name
            const evaluationCampaigns: any[] = groupedHRSettings['Evaluation Campaign'] ?? []
            const evaluationCampaignsByPeriodName: any[] = evaluationCampaigns.filter(c => c.period === periodName);
            evaluationCampaignsByPeriodName.forEach(c => idArrayHRSettings.push(c.id));

            // from monitoring period, find the docs with the same period name
            const monitoringPeriods: any[] = groupedHRSettings['Monitoring Period'] ?? []
            const monitoringPeriodsByPeriodName: any[] = monitoringPeriods.filter(c => c.period === periodName);
            monitoringPeriodsByPeriodName.forEach(m => idArrayHRSettings.push(m.id));

            // from performance evaluation, find the docs with the same period name
            const performanceEvaluations: any[] = await fetchPerformanceEvaluations();
            evaluationCampaignsByPeriodName.forEach(c => {
                const campaignName: string = c.campaignName;
                const performanceEvaluationByCampaignName: any[] = performanceEvaluations.filter(e => e.campaignName === campaignName);

                performanceEvaluationByCampaignName.forEach(p => idArrayPE.push(p.id));
            });

            // delete from hrSettings collection
            for (const id of idArrayHRSettings) {
                await deleteDoc(doc(db, "hrSettings", id))
                    .then(() => {
                        result = true;
                    })
                    .catch(() => {
                        result = false;
                    });
            }

            // delete from performanceEvaluation collection
            for (const id of idArrayPE) {
                await deleteDoc(doc(db, "performanceEvaluation", id))
                    .then(() => {
                        result = true;
                    })
                    .catch(() => {
                        result = false;
                    });
            }
        }
    }

    await deleteDoc(doc(db, "hrSettings", id))
        .then(() => {
            result = true;
        })
        .catch(() => {
            result = false;
        });

    return true;
}
