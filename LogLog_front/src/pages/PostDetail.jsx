import React, {useEffect, useState} from 'react';
import { useParams, useNavigate,useOutletContext } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {getMe} from "../api/authApi.js";
import {deletePosts, detailPost} from "../api/postsApi.js";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import PostDetailContent from '../components/post/PostDetailContent';

function PostDetail() {
    const { id } = useParams();
    const postId = Number(id);


    const { user } = useOutletContext();

    // 데이터 가져오기
    const { data: post, isLoading, isError } = useQuery({
        queryKey: ['log_posts', postId],
        queryFn: () => detailPost(postId)
    });

    if(isLoading) return <Loader/>
    if(isError) return <ErrorMessage message = "게시글을 불러오는 데 실패했습니다."/>

    return (
        <div className="layout-content">
            <PostDetailContent post = {post} currentUser={user} />
        </div>
    )


}


export default PostDetail;