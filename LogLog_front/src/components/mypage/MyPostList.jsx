import React from "react";
import "./MyPostList.css";

function MyPostList({ posts = [], mode = "posts" }) {
    return (
        <section className="mypost-section">
            <h3 className="mypost-title">
                {mode === "comments" ? "내가 쓴 댓글" : "내가 쓴 글"}
            </h3>

            <ul className="mypost-list">
                {posts.length === 0 ? (
                    <li className="mypost-empty">
                        아직 작성한 {mode === "comments" ? "댓글이" : "글이"} 없습니다.
                    </li>
                ) : (
                    posts.map(post => (
                        <li
                            key={post.id}
                            className="mypost-item"
                            onClick={() => {
                                window.location.href = `/posts/${post.id}`;
                            }}
                        >
                            <div className="mypost-main">
                                <span className="mypost-title-text">
                                    {post.title}
                                </span>
                            </div>

                            <div className="mypost-meta">
                                <span>{post.categoryName}</span>
                                <span>·</span>
                                <span>{post.createdAt}</span>
                                <span>·</span>
                                <span className={`status ${post.status}`}>
                                    {post.status === "PUBLISHED"
                                        ? "공개"
                                        : "비공개"}
                                </span>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
}

export default MyPostList;
