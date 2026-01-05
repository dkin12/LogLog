import React, { useEffect, useState, useRef } from "react";
import { api } from "../../api/api";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "./GrassSection.css";

export default function GrassSection({ user }) {
    const [mode, setMode] = useState("recent"); // recent | year
    const [year, setYear] = useState(null);
    const [grassData, setGrassData] = useState([]);
    const [years, setYears] = useState([]);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });
    const wrapperRef = useRef(null);

    // --- fetch 함수 ---
    const fetchGrass = () => {
        const request =
            mode === "recent"
                ? api.get("/api/mypage/grass/recent")
                : api.get(`/api/mypage/grass?year=${year}`);

        request
            .then(res => setGrassData(mode === "recent" ? buildGrass(res.data) : buildGrass(res.data, year)))
            .catch(console.error);
    };

    // --- mount 시 연도 리스트 fetch ---
    useEffect(() => {
        api.get("/api/mypage/grass/years")
            .then(res => setYears(res.data))
            .catch(console.error);
    }, []);

    // --- recent mode + 날짜 변화 감지 ---
    useEffect(() => {
        fetchGrass();
    }, [mode, year, new Date().getFullYear(), new Date().getMonth(), new Date().getDate()]);

    // --- scroll to end ---
    useEffect(() => {
        if (wrapperRef.current) wrapperRef.current.scrollLeft = wrapperRef.current.scrollWidth;
    }, [grassData]);

    return (
        <section className="grass-section">
            <h2>{user?.nickname} 님의 잔디</h2>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px", color: "#555" }}>이만큼 자랐어요!</span>
                <Tooltip title="블로그를 올린 만큼 잔디를 더 채울 수 있습니다!" arrow placement="right">
                    <HelpOutlineIcon fontSize="small" style={{ cursor: "pointer", color: "#888" }} />
                </Tooltip>
            </div>

            <div className="grass-container">
                <div className="grass-main">
                    <div className="grass-wrapper" ref={wrapperRef}>
                        <div className="grass-grid">
                            {grassData.map(day => (
                                <div
                                    key={day.date}
                                    className="grass-cell"
                                    style={{ backgroundColor: getColor(day.count) }}
                                    onMouseEnter={e => setTooltip({ visible: true, x: e.clientX, y: e.clientY, text: `${day.date} · ${day.count}회` })}
                                    onMouseMove={e => setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))}
                                    onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
                                />
                            ))}
                            <div className="grass-spacer" />
                        </div>
                    </div>

                    <div className="grass-legend">
                        <span>Less</span>
                        {COLORS.map((color, idx) => <div key={idx} className="legend-box" style={{ backgroundColor: color }} />)}
                        <span>More</span>
                    </div>
                </div>

                <div className="grass-years">
                    <button
                        className={mode === "recent" ? "active" : ""}
                        onClick={() => { setMode("recent"); setYear(null); }}
                    >
                        최근 1년
                    </button>
                    {years.map(y => (
                        <button
                            key={y}
                            className={mode === "year" && year === y ? "active" : ""}
                            onClick={() => { setMode("year"); setYear(y); }}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            {tooltip.visible && (
                <div className="grass-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                    {tooltip.text}
                </div>
            )}
        </section>
    );
}

// --- utils ---
function buildGrass(apiData, year) {
    const map = {};
    apiData.forEach(d => map[d.date] = d.count);

    let start, end;
    if (year) {
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31);
    } else {
        end = new Date(); // 오늘
        start = new Date();
        start.setDate(end.getDate() - 364);
    }

    const result = [];
    for (let d = new Date(start.getTime()); d <= end; d.setDate(d.getDate() + 1)) {
        // Local 기준 YYYY-MM-DD
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

const COLORS = ["#ebedf0","#c6e48b","#7bc96f","#239a3b","#196127"];
