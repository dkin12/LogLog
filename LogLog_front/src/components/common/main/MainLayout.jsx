import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MainHeader from "./MainHeader";
import {getMe} from "../../../api/authApi.js";
import "./MainLayout.css"

export default function MainLayout() {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) return;

        getMe()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem("accessToken");
                setUser(null);
            });
    }, [token]);

    const isLogin = !!user;

    return (
        <>
            <MainHeader isLogin={isLogin} user={user} />
            <main className="main-container">
                <Outlet />
            </main>
        </>
    );
}
