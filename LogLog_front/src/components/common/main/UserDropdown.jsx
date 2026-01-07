import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Divider, IconButton, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function UserDropdown({ user }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        handleClose();
        navigate("/post");
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    borderRadius: 2,
                    px: 1.5,
                    gap: 0.5
                }}
            >
                <Typography variant="body2" fontWeight={500}>
                    {user?.nickname ?? "USER"}
                </Typography>
                <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        borderRadius: 2,
                        minWidth: 120,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        navigate("/mypage");
                        handleClose();
                    }}
                    sx={{
                        fontSize: "12px",
                        py: 1,
                    }}
                >
                    마이페이지
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        navigate("/draft");
                        handleClose();
                    }}
                    sx={{
                        fontSize: "12px",
                        py: 1,
                    }}
                >
                    임시글 보기
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        color: "error.main",
                        fontWeight: 500,
                        fontSize: "12px",
                        py: 1
                    }}
                >
                    로그아웃
                </MenuItem>
            </Menu>
        </>
    );
}