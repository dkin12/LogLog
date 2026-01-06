import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function AuthorLink({
                        userId,
                        nickname,
                        currentUserId,
                        className = '',
                    }) {
    const isMe = currentUserId === userId;

    const to = isMe ? '/mypage' : `/users/${userId}`;

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
