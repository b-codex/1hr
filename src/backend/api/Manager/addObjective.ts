import { doc, setDoc } from 'firebase/firestore';
import { objectiveCollection } from '../firebase';
import { ObjectiveData } from '@/backend/models/objectiveData';

// add objective
export const addObjective = async (data: ObjectiveData) => {

    let result: boolean = false;

    const newData = doc(objectiveCollection);

    result = await setDoc(newData, { ...data, id: newData.id, })
        .then(() => true)
        .catch(err => {
            console.log(err);
            return false;
        });

    return result;

}
