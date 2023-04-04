import dayjs from "dayjs";
import moment from "moment";

const findDifferenceInDays = (dateOne: dayjs.Dayjs, dateTwo: dayjs.Dayjs) => {
    return Math.abs(dateOne.diff(dateTwo, 'day'));
}

export default findDifferenceInDays;