import { motion } from "framer-motion";
import { HiOutlineFolderOpen } from "react-icons/hi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategoryPreview } from "../../../api/postsApi";
import "./FolderCard.css";

const defaultColors = [
    "#F4E3D7", "#DDEAE3", "#E3E2F5", "#F0DDEA",
    "#F5F1D8", "#DFEBF7", "#E0F1EF", "#F2DDD7",
];

export default function FolderCard({ category, index, onClick }) {
    const bg = category.color || defaultColors[index % defaultColors.length];
    const queryClient = useQueryClient();

    const { data: preview = [] } = useQuery({
        queryKey: ["categoryPreview", category.categoryId],
        queryFn: () => fetchCategoryPreview(category.categoryId),
        enabled: false,
    });

    const handleHover = () => {
        queryClient.fetchQuery({
            queryKey: ["categoryPreview", category.categoryId],
            queryFn: () => fetchCategoryPreview(category.categoryId),
        });
    };

    return (
        <motion.button
            className="folder"
            whileHover={{y: -6, rotate: -1}}
            whileTap={{scale: 0.95}}
            onHoverStart={handleHover}
            onClick={onClick}
        >
            {/* 폴더 위에서 튀어나오는 preview */}
            <div className="folder-preview">
                {preview.map(p => (
                    <div key={p.postId} className="preview-file">
                        <span className="preview-title">{p.title}</span>
                    </div>
                ))}
            </div>

            <span className="folder-tab" style={{background: bg}}/>

            <div className="folder-body" style={{background: bg}}>
                <h3 className="folder-title">
                    <HiOutlineFolderOpen size={18}/> {category.categoryName}
                </h3>
                <p className="folder-sub">기록 보러가기 →</p>
            </div>
        </motion.button>
    );
}
