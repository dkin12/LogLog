import {toast} from 'react-toastify';

export const useToast = () => {

    // 성공 알림 (초록색)
    const success = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
        });
    };

    // 에러 알림 (빨간색)
    const error = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
        });
    };

    // 정보 알림 (파란색/기본)
    const info = (message) => {
        toast.info(message, {
            position: "top-center",
            autoClose: 2000,
        });
    };

    // 경고 알림 (노란색)
    const warning = (message) => {
        toast.warn(message);
    }

    return {success, error, info, warning};
};