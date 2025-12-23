import "./App.css";

import { RouterProvider } from "react-router";
import { router } from './router/AppRouter.jsx'

function App() {
    return <RouterProvider router={router} />;
}

export default App;