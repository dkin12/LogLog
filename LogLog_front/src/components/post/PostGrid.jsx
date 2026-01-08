import "./PostGrid.css";

export default function PostGrid({children}) {
    return <div className="post-list-wrapper">
        <div className="post-grid">{children}</div>
    </div>;
}