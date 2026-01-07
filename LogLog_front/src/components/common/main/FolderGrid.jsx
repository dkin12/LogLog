import { motion } from "framer-motion";
import FolderCard from "./FolderCard";
import "./FolderGrid.css";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.09,
            delayChildren: 0.05,
        },
    },
};

export default function FolderGrid({ categories, onSelect }) {
    return (
        <motion.div
            className="folder-grid"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {categories.map((cat, idx) => (
                <FolderCard
                    key={cat.categoryId}
                    category={cat}
                    index={idx}
                    onClick={() => onSelect(cat.categoryId)}
                />
            ))}
        </motion.div>
    );
}
