const compareMonths = (months: string[]) => {
    return months.sort((a, b) => {
        return months.indexOf(a) - months.indexOf(b);
    });
};

export default compareMonths;