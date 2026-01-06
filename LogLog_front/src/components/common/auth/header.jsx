import "./header.css";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="main-layout">
            <header className="header">
                <Link to="/" className="logo">ログログ</Link>
            </header>
        </div>

    );
}