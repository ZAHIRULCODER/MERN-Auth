import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_USER } from "../../constants";
import axios from "axios";
import toast from "react-hot-toast";
import AuthContext from "../../context/AuthContext";

const LoginForm = () => {
	const navigate = useNavigate();
	const { isLoading, checkAuth } = useContext(AuthContext);

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[id]: value,
			};
		});
	};

	const LoginSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			// Check authentication status before making the login request
			const isAuthenticated = await checkAuth();

			if (isAuthenticated) {
				toast.success("You are already logged in.");
				navigate("/home");
				return;
			}

			if (
				formData.username === "" ||
				formData.email === "" ||
				formData.password === ""
			) {
				toast.error("All fields are required");
				return;
			}
			const response = await axios.post(LOGIN_USER, formData, {
				withCredentials: true,
			});
			const { data } = response;
			if (data && data.statusCode === 200 && data.success === true) {
				toast.success(data.message);
				navigate("/home");
			}
		} catch (error) {
			console.error(`Error registering user: ${error}`);
			if (error.response.status === 404) {
				toast.error("User with that email or username does not exist.");
			} else if (error.response.status === 401) {
				toast.error("Invalid credentials.");
			} else if (error.response.status === 400) {
				toast.error("Username and Email is required.");
			}
		}
	};

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
			<div className="w-96 space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Log In</h1>
					<p className="text-gray-500">
						Enter your credentials to log into your account.
					</p>
				</div>
				<div className="rounded-lg border bg-white shadow-md">
					<div className="p-6">
						<form onSubmit={LoginSubmitHandler} className="space-y-4">
							<div className="space-y-2">
								<label
									className="text-sm font-medium"
									htmlFor="usernameOrEmail">
									Username
								</label>
								<input
									value={formData.username}
									onChange={handleChange}
									id="username"
									type="text"
									className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring focus:border-primary"
									placeholder="Enter your username"
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium" htmlFor="email">
									Email
								</label>
								<input
									value={formData.email}
									onChange={handleChange}
									id="email"
									type="text"
									className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring focus:border-primary"
									placeholder="Enter your email"
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium" htmlFor="password">
									Password
								</label>
								<input
									value={formData.password}
									onChange={handleChange}
									id="password"
									type="password"
									className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring focus:border-primary"
									placeholder="Enter your password"
									required
								/>
							</div>
							<button
								disabled={isLoading}
								className="w-full bg-primary text-white rounded-md py-2 bg-black hover:bg-gray-700"
								type="submit">
								{isLoading ? "LOADING..." : "LOG IN"}
							</button>
						</form>
					</div>
				</div>
				<div className="text-center">
					<p className="text-sm text-gray-600">
						<Link
							to="/auth/register"
							className="text-primary underline font-bold">
							Don't have an account? Register
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
};

export default LoginForm;
