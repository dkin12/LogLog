import { motion } from "framer-motion";

const CATEGORY_COLORS = {
    일상: "var(--folder-1)",
    기록: "var(--folder-2)",
    정보: "var(--folder-3)",
    취미: "var(--folder-4)",
    리뷰: "var(--folder-5)",
    생각: "var(--folder-6)",
    여행: "var(--folder-7)",
    공지: "var(--folder-8)",
};

const item = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
};

export default function FolderCard({ category, onClick }) {
    const bgColor =
        CATEGORY_COLORS[category.categoryName] ?? "var(--primary-soft)";

    return (
        <motion.button
            type="button"
            className="folder"
            onClick={onClick}
            variants={item}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
        >
            {/* 탭 */}
            <motion.div
                className="folder-tab"
                style={{ backgroundColor: bgColor }}
                variants={{ hover: { y: -7, scaleX: 1.05 } }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
            />

            {/* 본체 */}
            <motion.div
                className="folder-body"
                style={{
                    background: `linear-gradient(
                        180deg,
                        ${bgColor} 0%,
                        color-mix(in srgb, ${bgColor} 80%, #000 5%) 80%
                      )`,
                }}
                variants={{ hover: { y: -9 } }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
                <h3 className="folder-title">{category.categoryName}</h3>

                <p className="folder-sub">기록 보러가기 →</p>
            </motion.div>
        </motion.button>
    );
}
