import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MyPostList from "../components/mypage/MyPostList.jsx";
import GrassSection from "../components/mypage/GrassSection.jsx";
import LeftSidebar from "../components/mypage/LeftSidebar.jsx";
import NicknameModal from "../components/mypage/NicknameModal.jsx";
import MyPageFrame from "../components/mypage/MyPageFrame.jsx";
import { getMyPosts, getMyComments } from "../api/mypageApi.js";
import "./Mypage.css";

export default function Mypage() {
    const { user, setUser } = useOutletContext();

    const [mode, setMode] = useState("posts");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSetting, setOpenSetting] = useState(false);

    useEffect(() => {
        if (mode === "grass" || mode === "settings") return;

        let alive = true;
        setLoading(true);

        const request = mode === "posts" ? getMyPosts() : getMyComments();

        request
            .then((data) => {
                if (!alive) return;

                if (mode === "comments") {
                    const mapped = data.map(c => ({
                        id: c.postId,
                        title: c.postTitle,
                        categoryName: c.categoryName,
                        status: c.postStatus,
                        createdAt: new Date(c.createdAt).toLocaleDateString(),
                        commentContent: c.content,
                    }));
                    setItems(mapped);
                } else {
                    setItems(data);
                }
            })
            .catch(console.error)
            .finally(() => alive && setLoading(false));

        return () => { alive = false; };
    }, [mode]);

    const handleMenuChange = (menu) => {
        if (menu === "settings") {
            setOpenSetting(true);
            return;
        }

        if (menu === "grass") {
            document.getElementById("grass")
                ?.scrollIntoView({ behavior: "smooth" });
            setMode("grass");
            return;
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        setMode(menu);
    };

    if (!user) return null;

    return (
        <MyPageFrame
            sidebar={
                <LeftSidebar
                    mode={mode}
                    onMenuChange={handleMenuChange}
                />
            }
        >
            <div className="mypage-container page-scroll">
                <section id="grass">
                    <GrassSection user={user} />
                </section>

                {mode !== "grass" && mode !== "settings" && (
                    <MyPostList
                        posts={items}
                        mode={mode}
                        isOwner={true}
                        ownerNickname={user.nickname}
                        loading={loading}
                    />
                )}
            </div>

            <NicknameModal
                open={openSetting}
                onClose={() => setOpenSetting(false)}
                user={user}
                onSuccess={setUser}
            />
        </MyPageFrame>
    );
}
