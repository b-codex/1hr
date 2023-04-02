import moment from "moment";

export function calculateDaysBeforeDeadline() {
    // getting current day from moment package
    const today: number = moment().day();

    return 25 - today;
}