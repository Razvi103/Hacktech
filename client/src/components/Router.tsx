import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../layouts/Root";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import { useContext } from "react";
import UserContext from "../store/UserContext";

const visitorRouter = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <LoginPage />,
            },
        ],
    },
]);

const userRouter = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            // {
            //     path: "/documents",
            //     element: <DocumentsPage />
            // },
            // {
            //     path: "/request-referral",
            //     element: <RequestPage />,
            // },
        ],
    },
]);

export default function Router() {
    const userContext = useContext(UserContext);

    if (userContext !== null && userContext.token)
        return <RouterProvider router={userRouter} />;
    return <RouterProvider router={visitorRouter} />;
}
