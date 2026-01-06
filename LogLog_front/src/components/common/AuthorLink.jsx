import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function AuthorLink({
                        userId,
                        nickname,
                        currentUserId,
                        className = '',
                    }) {
    const isMe = Number(currentUserId) === Number(userId);

    const to = isMe
        ? '/mypage'               // 본인 → 기존 마이페이지
        : `/mypage/${userId}`;    // 타인 → UserPage

    return (
        <Link
            to={to}
            className={`author-link ${className}`}
        >
            <FaUserCircle className="author-icon" />
            <span className="author-name">{nickname}</span>
        </Link>
    );
}

export default AuthorLink;
