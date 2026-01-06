import { Outlet } from "react-router-dom";
import Header from "./header.jsx";
import "./layout.css";

export default function Layout() {
    return (
        <>
            <div className="main-layout">
                <Header />

                <main className="layout-main">
                    <Outlet />
                </main>
            </div>

        </>
    );
}