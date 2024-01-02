import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { LOGOUT_USER } from "../../constants";
import axios from "axios";
import { toast } from "react-hot-toast";

const HomePage = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const LogoutHandler = async () => {
		try {
			const response = await axios.post(
				LOGOUT_USER,
				{},
				{ withCredentials: true }
			);
			const { data } = response;
			if (data.statusCode === 200 && data.success === true) {
				toast.success(data.message);
				navigate("/auth/register");
			}
		} catch (error) {
			console.error(`Error logging out user: ${error}`);
		}
	};

	return (
		<main className="flex flex-col items-center justify-center  p-6">
			<header className="self-end mb-6">
				<button
					onClick={LogoutHandler}
					className="inline-flex items-center justify-center rounded-md text-sm font-medium  h-10 px-4 py-2 border border-input bg-black text-white hover:bg-gray-700 ">
					Logout
				</button>
			</header>
			<div className="rounded-lg border shadow-sm max-w-xl w-full">
				<div className="p-6 space-y-2">
					<div className="space-y-1">
						<label
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							htmlFor="name">
							Username
						</label>
						<p id="name" className="text-gray-600 dark:text-gray-300">
							{user?.username}
						</p>
					</div>
					<div className="space-y-1">
						<label
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							htmlFor="name">
							Email
						</label>
						<p id="name" className="text-gray-600 dark:text-gray-300">
							{user?.email}
						</p>
					</div>
					<div className="space-y-1">
						<label
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							htmlFor="name">
							Full Name
						</label>
						<p id="name" className="text-gray-600 dark:text-gray-300">
							{user?.fullName}
						</p>
					</div>
				</div>
				<div className="flex justify-end p-3">
					<button className="inline-flex items-center justify-center rounded-md text-sm font-medium  h-10 px-4 py-2 border border-input bg-black text-white hover:bg-gray-700 ">
						<Link to={`/profile/${user?._id}`}>Edit Profile</Link>
					</button>
				</div>
			</div>
		</main>
	);
};

export default HomePage;
