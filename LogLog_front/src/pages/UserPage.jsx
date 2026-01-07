import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyPostList from "../components/mypage/MyPostList.jsx";
import GrassSection from "../components/mypage/GrassSection.jsx";
import MyPageFrame from "../components/mypage/MyPageFrame.jsx";
import { getUserPosts, getUserProfile } from "../api/userApi.js";
import "./Mypage.css";

function UserPage() {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        Promise.all([
            getUserProfile(userId),
            getUserPosts(userId),
        ])
            .then(([userData, postData]) => {
                setUser(userData);
                setPosts(postData);
            })
            .catch(console.error);
    }, [userId]);

    if (!user) return null;

    return (
        <MyPageFrame sidebar={null}>
            <div className="mypage-container">
                <section id="grass">
                    <GrassSection user={user} />
                </section>

                <MyPostList
                    posts={posts}
                    mode="posts"
                    isOwner={false}
                    ownerNickname={user.nickname}
                />
            </div>
        </MyPageFrame>
    );
}

export default UserPage;
