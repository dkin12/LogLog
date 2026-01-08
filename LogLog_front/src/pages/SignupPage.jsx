import ReactMarkdown from "react-markdown";
import {TERMS_TEXT} from "../constants/terms";
import "./SignupPage.css";
import useSignupForm from "../hooks/useSignupForm";

export default function SignupPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
        nickname,
        setNickname,

        emailChecked,
        nicknameChecked,
        emailMessage,
        nicknameMessage,
        emailValid,
        nicknameValid,
        passwordMismatch,

        agree,
        setAgree,
        openTerms,
        setOpenTerms,

        handleCheckEmail,
        handleCheckNickname,
        handleSubmit,
    } = useSignupForm();

    return (
        <div className="signup-page">
            <h1 className="signup-title">
                <span className="title-light">新規</span>
                <span className="title-dark">登録</span>
            </h1>

            <form className="signup-form" onSubmit={handleSubmit}>
                {/* 이메일 */}
                <div className="field-row">
                    <div className="field">
                        <label>이메일</label>
                        <input
                            type="text"
                            value={email}
                            placeholder="이메일을 입력하세요"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailMessage && (
                            <p className={`error-msg ${emailValid ? "success" : ""}`}>
                                {emailMessage}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        className={`check-btn ${emailChecked ? "done" : ""}`}
                        onClick={handleCheckEmail}
                    >
                        {emailChecked ? "확인완료" : "중복확인"}
                    </button>
                </div>

                {/* 비밀번호 */}
                <div className="field">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="비밀번호를 입력하세요"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* 비밀번호 확인 */}
                <div className="field">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        placeholder="비밀번호를 한번 더 입력하세요"
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    {passwordMismatch && (
                        <p className="error-msg">비밀번호가 일치하지 않습니다.</p>
                    )}
                </div>

                {/* 닉네임 */}
                <div className="field-row">
                    <div className="field">
                        <label>닉네임</label>
                        <input
                            type="text"
                            value={nickname}
                            placeholder="닉네임을 입력하세요"
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        {nicknameMessage && (
                            <p className={`error-msg ${nicknameValid ? "success" : ""}`}>
                                {nicknameMessage}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        className={`check-btn ${nicknameChecked ? "done" : ""}`}
                        onClick={handleCheckNickname}
                    >
                        {nicknameChecked ? "확인완료" : "중복확인"}
                    </button>
                </div>

                {/* 약관 */}
                <div className="agree-box">
                    <div className="agree-header">
                        <p>서비스 이용에 대한 안내 사항을 읽고 동의합니다.</p>
                        <button
                            type="button"
                            className="terms-btn"
                            onClick={() => setOpenTerms(true)}
                        >
                            약관 보기
                        </button>
                    </div>

                    <div className="agree-radio">
                        <label>
                            <input
                                type="radio"
                                checked={agree}
                                onChange={() => setAgree(true)}
                            />
                            동의함
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={!agree}
                                onChange={() => setAgree(false)}
                            />
                            동의안함
                        </label>
                    </div>
                </div>

                {/* 회원가입 */}
                <button className="submit-btn">회원가입</button>
            </form>

            {/* 약관 모달 */}
            {openTerms && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenTerms(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-body">
                            <div className="terms-text">
                                <ReactMarkdown>{TERMS_TEXT}</ReactMarkdown>
                            </div>
                        </div>

                        <button
                            className="modal-close"
                            onClick={() => {
                                setAgree(true);
                                setOpenTerms(false);
                            }}
                        >
                            동의하고 닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}