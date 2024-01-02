import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AuthLayout = () => {
	const { isAuthenticated } = useContext(AuthContext);
	return <div>{isAuthenticated ? <Navigate to="/home" /> : <Outlet />}</div>;
};

export default AuthLayout;
