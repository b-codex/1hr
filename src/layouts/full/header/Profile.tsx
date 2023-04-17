import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
    Box,
    Menu,
    Button,
    IconButton,
    MenuItem,
    ListItemIcon,
    ListItemText,

} from "@mui/material";

import { LikeFilled, MailOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { Space, Typography, Avatar } from "antd";
import { db } from "@/backend/api/firebase";
import { EmployeeData } from "@/backend/models/employeeData";
import { onSnapshot, collection, QuerySnapshot, DocumentData } from "firebase/firestore";
import router from "next/router";
import AppContext from "@/components/context/AppContext";

const Profile = () => {
    const [anchorEl2, setAnchorEl2] = useState(null);
    const handleClick2 = (event: any) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const context = useContext(AppContext);
    const employeeData: EmployeeData = context.user;

    return (
        <Box>
            <IconButton
                size="large"
                aria-label="show 11 new notifications"
                color="inherit"
                aria-controls="msgs-menu"
                aria-haspopup="true"
                sx={{
                    ...(typeof anchorEl2 === "object" && {
                        color: "primary.main",
                    }),
                }}
                onClick={handleClick2}
            >
                <Space>
                    <Typography>
                        Hi, {employeeData?.firstName}
                    </Typography>

                    <Avatar
                        // src="/images/profile/profile_placeholder.jpg"
                        icon={<UserOutlined />}
                        alt="image"
                        // sx={{
                        //     width: 35,
                        //     height: 35,
                        // }}
                        size={"large"}
                    />
                </Space>
            </IconButton>
            {/* ------------------------------------------- */}
            {/* Message Dropdown */}
            {/* ------------------------------------------- */}
            <Menu
                id="msgs-menu"
                anchorEl={anchorEl2}
                keepMounted
                open={Boolean(anchorEl2)}
                onClose={handleClose2}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                sx={{
                    "& .MuiMenu-paper": {
                        width: "250px",
                    },
                }}
            >

                <Box mt={1} px={2}>
                    <Typography.Title level={4}>
                        {employeeData?.firstName} {employeeData?.lastName} ({employeeData?.employeeID})
                    </Typography.Title>
                </Box>

                <Box mt={1} px={2}>
                    <Space size={15}>
                        <PhoneOutlined rotate={90} />

                        <Typography>{employeeData?.personalPhoneNumber ?? employeeData?.companyPhoneNumber}</Typography>
                    </Space>
                </Box>

                <Box mt={1} px={2}>
                    <Space size={15}>
                        <MailOutlined />

                        <Typography>{employeeData?.personalEmail ?? employeeData?.companyEmail}</Typography>
                    </Space>
                </Box>

                {/* <MenuItem onClick={(event)=>{
                    console.log(event)
                }}>
                    <ListItemIcon>
                        <UserOutlined width={20} />
                    </ListItemIcon>
                    <ListItemText>User Information</ListItemText>
                </MenuItem> */}
                {/* <MenuItem>
                    <ListItemIcon>
                        <MailOutlined width={20} />
                    </ListItemIcon>
                    <ListItemText>My Account</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <LikeFilled width={20} />
                    </ListItemIcon>
                    <ListItemText>My Tasks</ListItemText>
                </MenuItem> */}
                <Box mt={1} py={1} px={2}>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={() => {
                            router.push('/profile');
                        }}
                    >
                        My Information
                    </Button>
                </Box>

                {
                    employeeData.role.includes("Manager") &&
                    <>
                        <Box mt={1} py={1} px={2}>
                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                    router.push('/mr');
                                }}
                            >
                                My Reportees
                            </Button>
                        </Box>
                    </>
                }

                <Box mt={1} py={1} px={2}>
                    <Button
                        variant="contained"
                        color="warning"
                        fullWidth
                        onClick={() => {
                            localStorage.clear();
                            context.logout();
                            router.push('/');
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Menu>
        </Box>
    );
};

export default Profile;
