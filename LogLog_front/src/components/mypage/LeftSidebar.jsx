import React from "react";
import "./LeftSidebar.css";
import {HiChartBar, HiDocumentText, HiChatBubbleLeft, HiCog} from "react-icons/hi2";

function LeftSidebar({mode, onMenuChange}) {
    return (
        <aside className="sidebar">
            <ul className="sidebar-menu">
                <li
                    className={mode === "grass" ? "active" : ""}
                    onClick={() => {
                        onMenuChange("grass");
                        document
                            .getElementById("grass")
                            ?.scrollIntoView({behavior: "smooth"});
                    }}
                >
                    <HiChartBar/>
                    <span>활동</span>
                </li>

                <li
                    className={mode === "posts" ? "active" : ""}
                    onClick={() => onMenuChange("posts")}
                >
                    <HiDocumentText/>
                    <span>게시글</span>
                </li>

                <li
                    className={mode === "comments" ? "active" : ""}
                    onClick={() => onMenuChange("comments")}
                >
                    <HiChatBubbleLeft/>
                    <span>댓글</span>
                </li>

                <div className="sidebar-divider"/>

                <li
                    className={mode === "settings" ? "active" : ""}
                    onClick={() => onMenuChange("settings")}
                >
                    <HiCog/>
                    <span>설정</span>
                </li>
            </ul>
        </aside>
    );
}

export default LeftSidebar;
