import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MyPostList from "../components/mypage/MyPostList.jsx";
import GrassSection from "../components/mypage/GrassSection.jsx";
import LeftSidebar from "../components/mypage/LeftSidebar.jsx";
import NicknameModal from "../components/mypage/NicknameModal.jsx";
import { getMyPosts, getMyComments } from "../api/mypageApi.js";
import "./Mypage.css";

function Mypage() {
    const { user, setUser } = useOutletContext();

    const [mode, setMode] = useState("posts"); // posts | comments | grass
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSetting, setOpenSetting] = useState(false);

    useEffect(() => {
        if (mode === "grass") return;

        let alive = true;
        setLoading(true);

        const request =
            mode === "posts" ? getMyPosts() : getMyComments();

        request
            .then((data) => {
                if (!alive) return;

                // 댓글일 때 프론트용 데이터로 변환
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
                    // posts는 그대로
                    setItems(data);
                }
            })
            .catch(console.error)
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [mode]);

    const handleMenuChange = (menu) => {
        if (menu === "settings") {
            setOpenSetting(true);
            return;
        }

        if (menu === "grass") {
            document
                .getElementById("grass")
                ?.scrollIntoView({ behavior: "smooth" });
            setMode("grass");
            return;
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        setMode(menu);
    };

    return (
        <div className="mypage-layout mypage-own">
            <aside className="mypage-sidebar">
                <LeftSidebar
                    mode={mode}
                    onMenuChange={handleMenuChange}
                />
            </aside>

            <div className="mypage-content">
                <section id="grass">
                    <GrassSection user={user} />
                </section>

                {mode !== "grass" && (
                    <section className="mypage-post-card">
                        <MyPostList
                            posts={items}
                            mode={mode}
                            isOwner={true}
                            loading={loading}
                        />
                    </section>
                )}
            </div>

            <NicknameModal
                open={openSetting}
                onClose={() => setOpenSetting(false)}
                user={user}
                onSuccess={setUser}
            />
        </div>
    );
}

export default Mypage;
