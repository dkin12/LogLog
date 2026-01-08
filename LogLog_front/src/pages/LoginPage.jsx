import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {login} from "../api/authApi";
import "./LoginPage.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await login({email, password});

            // JWT 저장
            localStorage.setItem("accessToken", res.accessToken);

            // 로그인 성공 → 메인
            navigate("/");
        } catch (err) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    };

    return (
        <div className="login-wrapper">
            <h1 className="login-title">
                <span className="title-light">ログ</span>
                <span className="title-dark">イン</span>
            </h1>

            <form className="login-form" onSubmit={handleSubmit}>
                <label>이메일</label>
                <input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>비밀번호</label>
                <input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error-text">{error}</p>}

                <button type="submit">로그인</button>

                <div className="login-links">
                    <span className="signup-text">아직 계정이 없으신가요?</span>
                    <Link to="/signup" className="signup-link">
                        회원가입
                    </Link>
                </div>
            </form>
        </div>
    );
}
