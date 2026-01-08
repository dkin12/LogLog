import React from 'react';

export default function MyPageFrame({sidebar, children}) {
    return (
        <div className="mypage-frame">
            {sidebar && (
                <aside className="mypage-sidebar">
                    {sidebar}
                </aside>
            )}
            <div className="mypage-main">
                {children}
            </div>
        </div>
    );
}