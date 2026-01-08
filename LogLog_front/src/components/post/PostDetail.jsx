import React from 'react';
import {useParams, useOutletContext} from 'react-router';
import {useQuery} from '@tanstack/react-query';
import {detailPost} from "../../api/postsApi.js";
import Loader from "../common/Loader.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import PostDetailContent from './PostDetailContent.jsx';
import "./PostDetail.css";

function PostDetail() {
    const {id} = useParams();
    const postId = Number(id);
    const {user} = useOutletContext();

    const {data: post, isLoading, isError} = useQuery({
        queryKey: ['log_posts', postId],
        queryFn: () => detailPost(postId),
    });

    if (isLoading) return <Loader/>;
    if (isError)
        return <ErrorMessage message="게시글을 불러오는 데 실패했습니다."/>;

    return (
        <div className="post-detail-page page-scroll">
            <div className="post-detail-card">
                <PostDetailContent post={post} currentUser={user}/>
            </div>
        </div>
    );
}

export default PostDetail;