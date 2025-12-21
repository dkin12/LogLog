import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <MainPage /> },
            { path: "login", element: <LoginPage /> },
            { path: "signup", element: <SignupPage /> }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />
    }
]);