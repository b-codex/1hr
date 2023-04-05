import screenSize from "../constants/screenSize";

const getResponsiveColumns = (columnNames: string[]) => {
    const columnVisibilityModel: any = {
        // false is hidden, true is shown
        id: !screenSize,
    };

    columnNames.forEach(columnName => {
        columnVisibilityModel[columnName] = screenSize;
    });

    return columnVisibilityModel;
};

export default getResponsiveColumns;