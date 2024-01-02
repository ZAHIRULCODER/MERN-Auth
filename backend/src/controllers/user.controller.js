import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshTokens } from "../utils/generateAccessAndRefreshTokens.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
	// Get user details from the request body (sent from the frontend)
	const { username, email, fullName, password } = req.body;

	// Validate user details ensure they are not empty
	if (username === "" || email === "" || fullName === "" || password === "") {
		throw new ApiError(400, "All fields are required");
	}

	// Check if the user already exists in the database by verifying email and username uniqueness
	const existingUser = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (existingUser) {
		throw new ApiError(409, "User with username or email already exists");
	}

	// Create a user object based on the received user details
	const user = await User.create({
		username: username.toLowerCase(),
		email,
		fullName,
		password,
	});

	// Remove sensitive information like password and refresh token from the user object
	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	// Check if the user creation in the database was successful
	if (!createdUser) {
		throw new ApiError(500, "Something went wrong while registering the user");
	}

	// Return a success response if the user creation was successful
	return res
		.status(201)
		.json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
	const { username, email, password } = req.body;

	if (!(username && email)) {
		throw new ApiError(400, "Username and Email is required");
	}

	const user = await User.findOne({
		$and: [{ username }, { email }],
	});

	if (!user) {
		throw new ApiError(404, "User does not Exist");
	}

	const isPasswordValid = await user.isPasswordCorrect(password);

	if (!isPasswordValid) {
		throw new ApiError(401, "Invalid Credentials");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
		user._id
	);

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{ user: loggedInUser, accessToken, refreshToken },
				"User logged in successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				refreshToken: null,
			},
		},
		{ new: true }
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	const incomingRefreshToken =
		req.cookies.refreshToken || req.body.refreshToken;

	if (!incomingRefreshToken) {
		throw new ApiError(401, "Unauthorized request");
	}

	try {
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		const user = await User.findById(decodedToken?._id);

		if (!user) {
			throw new ApiError(401, "Invalid Refresh token");
		}

		if (incomingRefreshToken !== user.refreshToken) {
			throw new ApiError(401, "Refresh token is expired or used");
		}

		const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
			user._id
		);

		const options = {
			httpOnly: true,
			secure: true,
		};

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json(
				new ApiResponse(
					200,
					{ accessToken, refreshToken },
					"Access token refreshed successfully"
				)
			);
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid Refresh token");
	}
});

const getCurrentUser = asyncHandler(async (req, res) => {
	return res
		.status(200)
		.json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
	const { fullName, email } = req.body;

	if (!fullName || !email) {
		throw new ApiError(400, "All fields are required");
	}

	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				fullName,
				email,
			},
		},
		{ new: true }
	).select("-password");

	if (!user) {
		throw new ApiError(500, "Something went wrong while updating the user");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, user, "Account details updated successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		throw new ApiError(400, "All fields are required");
	}

	const user = await User.findById(req.user._id);

	const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

	if (!isPasswordCorrect) {
		throw new ApiError(401, "current password is incorrect");
	}

	user.password = newPassword;

	await user.save({ validateBeforeSave: false });

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
	registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	getCurrentUser,
	updateAccountDetails,
	changeCurrentPassword,
};
