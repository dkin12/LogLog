import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import "./WriteFloatingButton.css";

export default function WriteFloatingButton({ isLogin }) {
    const navigate = useNavigate();

    if (!isLogin) return null;

    return (
        <button
            className="write-fab"
            onClick={() => navigate("/posts/write")}
        >
            <FaPlus/>
        </button>
    );
}
