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
    const [mode, setMode] = useState("posts");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSetting, setOpenSetting] = useState(false);

    useEffect(() => {
        if (mode === "grass") return;

        let alive = true;
        const request =
            mode === "posts" ? getMyPosts() : getMyComments();

        setLoading(true);

        request
            .then((data) => alive && setItems(data))
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
        <div className="mypage-layout">
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
                    <MyPostList
                        posts={items}
                        mode={mode}
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
        </div>
    );
}

export default Mypage;
