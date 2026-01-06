import WriteFloatingButton from "../WriteFloatingButton.jsx";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MainHeader from "./MainHeader";
import { getMe } from "../../../api/authApi.js";
import "./MainLayout.css";

export default function MainLayout() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        getMe()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem("accessToken");
                setUser(null);
            });
    }, []);

    const isLogin = !!user;

    return (
        <div className="main-layout">
            <MainHeader isLogin={!!user} user={user} />

            <main className="main-container">
                <Outlet context={{ user, setUser }} />
            </main>

            <WriteFloatingButton isLogin={isLogin} />
        </div>
    );
}
