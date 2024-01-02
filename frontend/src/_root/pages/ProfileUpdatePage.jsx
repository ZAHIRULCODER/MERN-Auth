import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { UPDATE_ACCOUNT_DETAILS } from "../../constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProfileUpdatePage = () => {
	const navigate = useNavigate();
	const { user, checkAuth } = useContext(AuthContext);
	const [email, setEmail] = useState(user?.email || "");
	const [fullName, setFullName] = useState(user?.fullName || "");

	const UpdateProfileSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			// Check authentication status before allowing profile update
			const isAuthenticated = await checkAuth();

			if (!isAuthenticated) {
				toast.error("You are not authenticated. Please log in.");
				navigate("/auth/login");
				return;
			}

			const response = await axios.patch(
				UPDATE_ACCOUNT_DETAILS,
				{
					fullName,
					email,
				},
				{
					withCredentials: true,
				}
			);

			const { data } = response;

			if (data.statusCode === 200 && data.success === true) {
				toast.success(data.message);
				navigate("/home");
			}
		} catch (error) {
			console.error(`Error updating profile: ${error}`);
			if (error.response.status === 401) {
				toast.error("You are not authorized to update this account.");
			} else {
				toast.error("An error occurred. Please try again.");
			}
		}
	};

	return (
		<main className="flex justify-center items-center h-screen bg-gray-100">
			<form
				onSubmit={UpdateProfileSubmitHandler}
				className="rounded-lg border shadow-sm w-full max-w-lg mx-4">
				<div className="flex flex-col space-y-1.5 p-6">
					<h3 className="text-2xl font-semibold leading-none tracking-tight">
						Update Profile
					</h3>
					<p className="text-sm text-muted-foreground">
						Update your Account information.
					</p>
				</div>
				<div className="p-6 space-y-4">
					<div className="space-y-2">
						<label
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							htmlFor="email">
							Email
						</label>
						<input
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="Enter your email"
							type="email"
						/>
					</div>
					<div className="space-y-2">
						<label
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							htmlFor="name">
							Full Name
						</label>
						<input
							id="fullName"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="Enter your full name"
						/>
					</div>
				</div>
				<div className="flex items-center p-6">
					<button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-black hover:bg-gray-700 text-white h-10 px-4 py-2 ml-auto">
						Update Profile
					</button>
				</div>
			</form>
		</main>
	);
};

export default ProfileUpdatePage;
