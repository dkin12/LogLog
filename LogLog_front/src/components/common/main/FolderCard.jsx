import { motion } from "framer-motion";
import { HiOutlineFolderOpen } from "react-icons/hi";

const defaultColors = [
    "#F4E3D7",
    "#DDEAE3",
    "#E3E2F5",
    "#F0DDEA",
    "#F5F1D8",
    "#DFEBF7",
    "#E0F1EF",
    "#F2DDD7",
];

const item = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 380,
            damping: 26,
        },
    },
};

export default function FolderCard({ category, index, onClick }) {
    const bg = category.color || defaultColors[index % defaultColors.length];

    return (
        <motion.button
            className="folder"
            variants={item}
            whileHover={{ y: -6, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
        >
            <span className="folder-tab" style={{ background: bg }} />
            <div className="folder-body" style={{ background: bg }}>
                <h3 className="folder-title">{category.categoryName}</h3>
                <p className="folder-sub">기록 보러가기 →</p>
            </div>
        </motion.button>
    );
}
