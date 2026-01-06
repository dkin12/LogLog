import { Outlet } from "react-router-dom";
import Header from "./header.jsx";
import "./layout.css";

export default function Layout() {
    return (
        <>
            <Header />

            <main className="layout-main">
                <Outlet />
            </main>

        </>
    );
}