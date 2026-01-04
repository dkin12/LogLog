export default function ErrorMessage({ message = '오류 발생' }) {
    return (
        <div style={{ color: 'red', marginTop: '1rem' }}>
            {message}
        </div>
    );
}

