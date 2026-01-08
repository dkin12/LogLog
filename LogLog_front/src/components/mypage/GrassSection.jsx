import React, { useEffect, useRef, useState } from "react";
import { api } from "../../api/api";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "./GrassSection.css";

export default function GrassSection({ user, isMe }) {
    const wrapperRef = useRef(null);

    const [mode, setMode] = useState("recent");
    const [year, setYear] = useState(null);
    const [grassData, setGrassData] = useState([]);
    const [years, setYears] = useState([]);

    const ownerId = user?.id;
    if (!user) return null;

    /* =========================
       연도 목록
       ========================= */
    useEffect(() => {
        if (!ownerId) return;

        const url = isMe
            ? "/api/mypage/grass/years"
            : `/api/users/${ownerId}/grass/years`;

        api.get(url)
            .then(res => {
                const list = res.data.map(Number);
                setYears(list);
                if (list.length > 0 && year === null) {
                    setYear(list[0]);
                }
            })
            .catch(console.error);
    }, [ownerId, isMe]);

    /* =========================
       잔디 데이터
       ========================= */
    useEffect(() => {
        if (!ownerId) return;
        if (mode === "year" && year === null) return;

        const url = isMe
            ? mode === "recent"
                ? "/api/mypage/grass/recent"
                : `/api/mypage/grass?year=${year}`
            : mode === "recent"
                ? `/api/users/${ownerId}/grass/recent`
                : `/api/users/${ownerId}/grass?year=${year}`;

        api.get(url)
            .then(res => {
                setGrassData(
                    mode === "recent"
                        ? buildGrass(res.data)
                        : buildGrass(res.data, year)
                );
            })
            .catch(console.error);
    }, [mode, year, ownerId, isMe]);

    /* =========================
       오른쪽 스크롤 고정
       ========================= */
    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.scrollLeft =
                wrapperRef.current.scrollWidth;
        }
    }, [grassData]);

    return (
        <section className="grass-section">
            <h2>
                {user.nickname} 님의 잔디
                <Tooltip title="하루 동안의 활동 기록을 잔디 형태로 표시합니다.">
                    <HelpOutlineIcon
                        fontSize="small"
                        style={{ marginLeft: 6 }}
                    />
                </Tooltip>
            </h2>

            <div className="grass-container">
                {/* ===== 잔디 메인 ===== */}
                <div className="grass-main">
                    <div className="grass-wrapper" ref={wrapperRef}>
                        <div className="grass-grid">
                            {grassData.map(d => (
                                <Tooltip title={`${d.date} · ${d.count}회`} arrow>
                                    <div
                                        className="grass-cell"
                                        style={{ backgroundColor: getColor(d.count) }}
                                    />
                                </Tooltip>
                            ))}
                        </div>
                        <div className="grass-spacer" />
                    </div>

                    {/* ===== Legend ===== */}
                    <div className="grass-legend">
                        <span>Less</span>
                        {[0, 1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className="legend-box"
                                style={{ background: getColor(i) }}
                            />
                        ))}
                        <span>More</span>
                    </div>
                </div>

                {/* ===== 연도 선택 ===== */}
                <div className="grass-years">
                    <button
                        className={mode === "recent" ? "active" : ""}
                        onClick={() => setMode("recent")}
                    >
                        최근 1년
                    </button>

                    {years.map(y => (
                        <button
                            key={y}
                            className={
                                mode === "year" && year === y
                                    ? "active"
                                    : ""
                            }
                            onClick={() => {
                                setMode("year");
                                setYear(y);
                            }}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================
   util
   ========================= */

function buildGrass(apiData, year) {
    const map = {};
    apiData.forEach(d => {
        map[d.date] = d.count;
    });

    let start, end;

    if (year) {
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31);
    } else {
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 364);
    }

    const result = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toLocaleDateString("sv-SE");
        result.push({ date: key, count: map[key] || 0 });
    }
    return result;
}

function getColor(count) {
    if (count === 0) return "#ebedf0";
    if (count === 1) return "#c6e48b";
    if (count === 2) return "#7bc96f";
    if (count === 3) return "#239a3b";
    return "#196127";
}
