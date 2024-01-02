import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../_root/RootLayout";
import HomePage from "../_root/pages/HomePage";
import AuthLayout from "../_auth/AuthLayout";
import LoginForm from "../_auth/forms/LoginForm";
import RegisterForm from "../_auth/forms/RegisterForm";
import AuthProvider from "../context/AuthProvider";
import ProfileUpdatePage from "../_root/pages/ProfileUpdatePage";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<AuthProvider>
				<RootLayout />
			</AuthProvider>
		),
		errorElement: <h1>404 Not Found</h1>,
		children: [
			{
				path: "home",
				index: true,
				element: <HomePage />,
			},
			{
				path: "profile/:id",
				element: <ProfileUpdatePage />,
			},
		],
	},
	{
		path: "/auth",
		element: (
			<AuthProvider>
				<AuthLayout />
			</AuthProvider>
		),
		children: [
			{
				path: "login",
				element: <LoginForm />,
			},
			{
				path: "register",
				element: <RegisterForm />,
			},
		],
	},
]);

export default router;
