import noContents from "../../assets/images/noContents.png";
import "./EmptyState.css";

export default function EmptyState({ message = "작성된 글이 없습니다." }) {
    return (
        <div className="empty-state">
            <img src={noContents} alt="empty" />
            <p>{message}</p>
        </div>
    );
}
