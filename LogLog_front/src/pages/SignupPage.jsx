import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { TERMS_TEXT } from "../constants/terms";
import "./SignupPage.css";

export default function SignupPage() {
    const [agree, setAgree] = useState(false);
    const [openTerms, setOpenTerms] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!agree) {
            alert("약관에 동의해주세요.");
            return;
        }

        // TODO: 회원가입 API
    };

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
                        <input type="text" placeholder="이메일을 입력하세요" />
                    </div>
                    <button type="button" className="check-btn">
                        중복확인
                    </button>
                </div>

                {/* 비밀번호 */}
                <div className="field">
                    <label>비밀번호</label>
                    <input type="password" placeholder="비밀번호를 입력하세요" />
                </div>

                {/* 비밀번호 확인 */}
                <div className="field">
                    <label>비밀번호 확인</label>
                    <input type="password" placeholder="비밀번호를 한번 더 입력하세요" />
                </div>

                {/* 닉네임 */}
                <div className="field-row">
                    <div className="field">
                        <label>닉네임</label>
                        <input type="text" placeholder="닉네임을 입력하세요" />
                    </div>
                    <button type="button" className="check-btn">
                        중복확인
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

            {openTerms && (
                <div className="modal-overlay" onClick={() => setOpenTerms(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-body">
                            <div className="terms-text">
                                <ReactMarkdown>
                                    {TERMS_TEXT}
                                </ReactMarkdown>
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