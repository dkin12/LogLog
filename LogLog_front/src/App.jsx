import "./App.css";

import { RouterProvider } from "react-router";
import { router } from './router/AppRouter.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
    return <>
        {
            <RouterProvider router={router} />
        }

        {
            <ToastContainer
                position="top-right" // 알림 위치 (top-right, top-center, bottom-right 등)
                autoClose={3000}     // 3초 뒤 자동 닫힘
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        }
    </>


}

export default App;