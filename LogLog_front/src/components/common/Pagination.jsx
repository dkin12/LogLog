import "./Pagination.css";

export default function Pagination({page, totalPages, onChange}) {
    return (
        <div className="pagination">
            {/* 이전 */}
            <button
                className="page-btn arrow"
                disabled={page === 0}
                onClick={() => onChange(page - 1)}
            >
                &lt;
            </button>

            {/* 페이지 번호 */}
            <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={`page-btn ${i === page ? "active" : ""}`}
                        onClick={() => onChange(i)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* 다음 */}
            <button
                className="page-btn arrow"
                disabled={page === totalPages - 1}
                onClick={() => onChange(page + 1)}
            >
                &gt;
            </button>
        </div>
    );
}
