import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MyPostList from "../components/mypage/MyPostList";
import { getUserPosts } from "../api/userApi";

function UserPage() {
    const { userId } = useParams();

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ["userPosts", userId],
        queryFn: () => getUserPosts(userId),
    });

    return (
        <div className="mypage-layout">
            <div className="mypage-content">
                <MyPostList
                    posts={posts}
                    mode="user"
                    loading={isLoading}
                />
            </div>
        </div>
    );
}

export default UserPage;
