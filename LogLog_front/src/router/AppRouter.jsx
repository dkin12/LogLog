import {createBrowserRouter, Navigate} from "react-router-dom";
import Layout from "../components/common/auth/layout.jsx";
import MainLayout from "../components/common/main/MainLayout.jsx";
import RequireAuth from "../components/common/auth/RequireAuth.jsx";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HomePage from "../pages/HomePage.jsx";
import MyPage from "../pages/Mypage.jsx";
import DraftsPage from "../components/post/DraftsPage.jsx";
import PostWrite from "../components/post/PostWrite.jsx";
import PostDetail from "../components/post/PostDetail.jsx";
import PostHistory from "../components/post/PostHistory.jsx";
import PostDiffPage from "../components/post/PostDiffPage.jsx";
import UserPage from "../pages/UserPage.jsx";
import MainPage from "../pages/MainPage.jsx";

export const router = createBrowserRouter([
    // 메인 영역 (공통 헤더)
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {index: true, element: <HomePage/>},
            {path: "posts", element: <MainPage/>},

            {
                path: "mypage",
                element: (
                    <RequireAuth>
                        <MyPage/>
                    </RequireAuth>
                ),
            },
            {
                path: "mypage/:userId",
                element: (
                    <UserPage/>
                ),
            },
            {
                path: "draft",
                element: (
                    <RequireAuth>
                        <DraftsPage/>
                    </RequireAuth>
                ),
            },
            {
                path: "posts/write/:id/edit", element: (
                    <RequireAuth>
                        <PostWrite mode="edit"/>
                    </RequireAuth>
                )
            }, {
                path: "posts/write/:id/draft", element: (
                    <RequireAuth>
                        <PostWrite mode="draft"/>
                    </RequireAuth>
                )
            },
            {
                path: "posts/write", element: (
                    <RequireAuth>
                        <PostWrite mode="create"/>
                    </RequireAuth>
                )
            }, {
                path: "posts/:id", element: (
                    <PostDetail/>
                )
            }, {
                path: "posts/:id/history", element: (
                    <RequireAuth>
                        <PostHistory/>
                    </RequireAuth>
                )
            }, {
                path: "posts/:id/history/:historyId",
                element: (
                    <RequireAuth>
                        <PostDiffPage/>
                    </RequireAuth>
                )
            }, {
                path: "posts/write/:id/restore", element: (
                    <RequireAuth>
                        <PostWrite mode="restore"/>
                    </RequireAuth>
                )
            }
        ],
    },

    // 인증 영역 (로그인 / 회원가입 전용 헤더)
    {
        path: "/",
        element: <Layout/>,
        children: [
            {path: "login", element: <LoginPage/>},
            {path: "signup", element: <SignupPage/>}
        ],
    },

    // fallback
    {
        path: "*",
        element: <Navigate to="/" replace/>,
    },
]);