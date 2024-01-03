import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { REGISTER_USER } from "../../constants";
import toast from "react-hot-toast";
import AuthContext from "../../context/AuthContext";

const RegisterForm = () => {
	const navigate = useNavigate();
	const { isLoading, checkAuth } = useContext(AuthContext);

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		fullName: "",
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

	const RegisterSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			// Check authentication status before allowing registration
			const isAuthenticated = await checkAuth();

			if (isAuthenticated) {
				toast.success("You are already logged in. Redirecting to home...");
				navigate("/home");
				return;
			}

			if (
				formData.username === "" ||
				formData.email === "" ||
				formData.fullName === "" ||
				formData.password === ""
			) {
				toast.error("All fields are required");
				return;
			}
			const response = await axios.post(REGISTER_USER, formData, {
				withCredentials: true,
			});
			const { data } = response;
			if (data && data.statusCode === 200 && data.success === true) {
				toast.success(data.message);
				navigate("/auth/login");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error(`Error registering user: ${error}`);
			if (error.response.status === 409) {
				toast.error("User with that email or username already exists.");
			} else if (error.response.status === 400) {
				toast.error("All fields are required.");
			} else {
				toast.error(
					"Something went wrong while registering the user. Please try again"
				);
			}
		}
	};

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
			<div className="w-96 space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Create an Account</h1>
					<p className="text-gray-500">
						Enter your details to register for a new account.
					</p>
				</div>
				<div className="rounded-lg border bg-white shadow-md">
					<div className="p-6">
						<form onSubmit={RegisterSubmitHandler} className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium" htmlFor="username">
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
									type="email"
									className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring focus:border-primary"
									placeholder="Enter your email"
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium" htmlFor="fullName">
									Full Name
								</label>
								<input
									value={formData.fullName}
									onChange={handleChange}
									id="fullName"
									type="text"
									className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring focus:border-primary"
									placeholder="Enter your full name"
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
								className="w-full bg-primary text-white bg-black hover:bg-gray-700 rounded-md py-2"
								type="submit">
								{isLoading ? "LOADING..." : "REGISTER"}
							</button>
						</form>
					</div>
				</div>
				<div className="text-center">
					<p className="text-sm text-gray-600">
						<Link to="/auth/login" className="text-primary underline font-bold">
							Already have an account? Log in
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
};

export default RegisterForm;
