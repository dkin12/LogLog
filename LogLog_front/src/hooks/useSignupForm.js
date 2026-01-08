import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {signup} from "../api/authApi";
import {checkEmail, checkNickname} from "../api/userApi.js"

export default function useSignupForm() {
    const navigate = useNavigate();

    // 이메일 형식 확인
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // 입력값
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [nickname, setNickname] = useState("");

    // 중복확인 상태
    const [emailChecked, setEmailChecked] = useState(false);
    const [nicknameChecked, setNicknameChecked] = useState(false);

    // 중복확인 메시지
    const [emailMessage, setEmailMessage] = useState("");
    const [nicknameMessage, setNicknameMessage] = useState("");

    // 성공/실패 구분
    const [emailValid, setEmailValid] = useState(null);
    const [nicknameValid, setNicknameValid] = useState(null);

    // 비밀번호 확인
    const passwordMismatch =
        passwordConfirm.length > 0 && password !== passwordConfirm;

    // 약관
    const [agree, setAgree] = useState(false);
    const [openTerms, setOpenTerms] = useState(false);

    /* ====================== 중복확인 ====================== */

    const handleCheckEmail = async () => {
        if (!email) {
            setEmailMessage("이메일을 입력하세요.");
            setEmailValid(false);
            return;
        }

        if (!isValidEmail(email)) {
            setEmailMessage("이메일 형식이 올바르지 않습니다.");
            setEmailValid(false);
            return;
        }

        try {
            await checkEmail(email);
            setEmailChecked(true);
            setEmailMessage("사용 가능한 이메일입니다.");
            setEmailValid(true);

            setTimeout(() => {
                setEmailMessage("");
                setEmailValid(null);
            }, 2000);
        } catch {
            setEmailChecked(false);
            setEmailMessage("이미 사용 중인 이메일입니다.");
            setEmailValid(false);
        }
    };

    const handleCheckNickname = async () => {
        if (!nickname) {
            setNicknameMessage("닉네임을 입력하세요.");
            setNicknameValid(false);
            return;
        }

        try {
            await checkNickname(nickname);
            setNicknameChecked(true);
            setNicknameMessage("사용 가능한 닉네임입니다.");
            setNicknameValid(true);
        } catch {
            setNicknameChecked(false);
            setNicknameMessage("이미 사용 중인 닉네임입니다.");
            setNicknameValid(false);
        }
    };

    /* ====================== submit ====================== */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            alert("이메일 형식이 올바르지 않습니다.");
            return;
        }

        if (!emailChecked || !nicknameChecked) {
            alert("이메일과 닉네임 중복확인을 완료해주세요.");
            return;
        }

        if (password !== passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!agree) {
            alert("약관에 동의해주세요.");
            return;
        }

        try {
            await signup({
                email,
                password,
                passwordConfirm,
                nickname,
            });
            alert("회원가입이 완료되었습니다.");
            navigate("/login");
        } catch {
            alert("회원가입에 실패했습니다.");
        }
    };

    return {
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
    };
}