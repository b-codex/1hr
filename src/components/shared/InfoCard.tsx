import { Card, Typography } from "@mui/material";
import { Divider } from "antd";

type Props = {
    title?: string;
    className?: string;
    children: JSX.Element | JSX.Element[];
    width?: string;
};

const InfoCard = ({ children, className, title, width }: Props) => {
    return (
        <Card
            sx={{ p: 0, position: "relative" }}
            className={className}
            elevation={9}
            variant={"outlined"}
            style={{
                margin: "1em 0",
                padding: "1em",
                width: width ?? "fit-content",
                zIndex: 100,
            }}
        >
            <Typography
                variant="h5"
            >
                {title}
            </Typography>

            <Divider style={{ margin: "1em 0" }} />

            {children}
        </Card>
    );
};

export default InfoCard;
