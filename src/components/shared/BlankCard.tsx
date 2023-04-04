import { Card } from "@mui/material";

type Props = {
    className?: string;
    children: JSX.Element | JSX.Element[];
};

const BlankCard = ({ children, className }: Props) => {
    return (
        <Card
            sx={{ p: 0, position: "relative" }}
            className={className}
            elevation={9}
            variant={"outlined"}
        >
            {children}
        </Card>
    );
};

export default BlankCard;
