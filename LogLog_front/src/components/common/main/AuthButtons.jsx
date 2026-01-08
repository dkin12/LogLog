import {Link} from "react-router-dom";
import "./AuthButtons.css";

export default function AuthButtons() {
    return (
        <div className="auth-buttons">
            <Link to="/signup" className="btn signup">
                회원가입
            </Link>
            <Link to="/login" className="btn login">
                로그인
            </Link>
        </div>
    );
}
