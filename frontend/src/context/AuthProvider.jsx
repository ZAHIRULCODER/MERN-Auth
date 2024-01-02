import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CURRENT_USER } from "../constants";

const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuth = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(CURRENT_USER, {
				withCredentials: true,
			});
			setUser(response.data.data);
			setIsAuthenticated(true);
			return true;
		} catch (error) {
			setIsAuthenticated(false);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuth().then((isAuthenticated) => {
			if (!isAuthenticated) {
				navigate("/auth/register");
			}
		});
	}, [navigate, user]);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				isAuthenticated,
				setIsAuthenticated,
				isLoading,
				setIsLoading,
				checkAuth,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
