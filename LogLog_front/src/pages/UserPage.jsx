import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyPostList from "../components/mypage/MyPostList.jsx";
import GrassSection from "../components/mypage/GrassSection.jsx";
import { getUserPosts, getUserProfile } from "../api/userApi.js";
import "./Mypage.css";

function UserPage() {
    console.log('UserPage mounted');
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        setLoading(true);

        Promise.all([
            getUserProfile(userId),
            getUserPosts(userId),
        ])
            .then(([userData, postData]) => {
                if (!alive) return;
                setUser(userData);
                setPosts(postData);
            })
            .catch(console.error)
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [userId]);

    if (!user) return null;

    return (
        <div className="mypage-layout">
            {/* LeftSidebar 제외 */}

            <div className="mypage-content">
                {/* 잔디 */}
                <section id="grass">
                    <GrassSection user={user} />
                </section>

                {/* 게시글 목록 (공개글만) */}
                <MyPostList
                    posts={posts}
                    mode="posts"
                    isOwner={false}
                    ownerNickname={user.nickname}
                />
            </div>
        </div>
    );
}

export default UserPage;
