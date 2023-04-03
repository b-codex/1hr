import { Backdrop, Box, Fade, Modal, Typography } from '@mui/material';
import { CloseOutlined } from "@ant-design/icons";

export default function CustomModal(
    {
        modalTitle,
        open,
        setOpen,
        children,
        width,
        height,
    }: {
        modalTitle: string,
        open: boolean,
        setOpen: any,
        children: any,
        width?: string,
        height?: string,
    }
) {
    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade
                    in={open}
                    style={{
                        height: height || "90vh",
                        overflowY: "scroll"
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: width || '80%',
                            bgcolor: '#ffffff',
                            p: 4,
                        }}
                    >
                        <CloseOutlined
                            onClick={() => setOpen(false)}
                            style={{
                                position: 'absolute',
                                right: 20,
                                top: 20,
                                borderRadius: "50%"
                            }}
                        />

                        <Typography
                            id="modal-title"
                            variant="h6"
                            component="h2"
                            style={{
                                color: '#3f3d56',
                                fontFamily: "Montserrat, sans-serif"
                            }}
                        >
                            {modalTitle}
                        </Typography>

                        {children}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}
