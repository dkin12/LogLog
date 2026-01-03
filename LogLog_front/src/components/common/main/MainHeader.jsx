import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import UserDropdown from "./UserDropdown";
import "./MainHeader.css";

export default function MainHeader({ isLogin, user }) {
    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">ログログ</Link>
            </div>

            <div className="header-actions">
                <SearchBar/>

                {!isLogin ? (
                    <AuthButtons/>
                ) : (
                    <UserDropdown user={user}/>
                )}
            </div>
        </header>
    );
}