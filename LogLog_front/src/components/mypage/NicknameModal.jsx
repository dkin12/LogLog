import React, {useEffect, useState} from "react";
import {updateNickname} from "../../api/userApi.js";
import "./NicknameModal.css";

function NicknameModal({open, onClose, user, onSuccess}) {
    const [nickname, setNickname] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (open && user?.nickname) {
            setNickname(user.nickname);
            setError("");
            setSuccess(false);
        }
    }, [open, user]);

    if (!open) return null;

    const handleSubmit = async () => {
        if (nickname.trim().length < 2) {
            setError("닉네임은 2자 이상이어야 합니다.");
            return;
        }

        if (nickname === user.nickname) {
            onClose();
            return;
        }

        setLoading(true);

        let updatedUser;
        try {
            updatedUser = await updateNickname(nickname.trim());
        } catch (e) {
            setError("닉네임 변경에 실패했습니다.");
            setLoading(false);
            return;
        }

        // 성공 처리
        onSuccess?.(updatedUser);
        setSuccess(true);

        // 성공 메시지 보여주고 자동 닫힘
        setTimeout(() => {
            setSuccess(false);
            setLoading(false);
            onClose();
        }, 1200);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2 className="modal-title">닉네임 변경</h2>

                <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={10}
                    disabled={loading}
                />

                {error && <p className="error">{error}</p>}
                {success && <p className="success">닉네임이 변경되었습니다.</p>}

                <div className="modal-actions">
                    <button onClick={onClose} disabled={loading}>
                        취소
                    </button>
                    <button
                        className="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NicknameModal;
