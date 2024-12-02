import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCookie from './useCookie';
import { login } from "../api/auth";
import { config } from "../config";

const useLogin = () => {

	const [loading, setLoading] = useState(false);
	const [remember_me, setRememberMe] = useState(false);
	const [key, setKey] = useState(null);
	const [errorLogin, setErrorLogin] = useState(null);
	const [successLogin, setSuccessLogin] = useState(null);

	const { cookie, updateCookie } = useCookie(config.key, "");

	const navigate = useNavigate();

	const handleRememberMe = (e) => { e.preventDefault(); setRememberMe(!remember_me); };
	const handleKey = (e) => { e.preventDefault(); setKey(e.target.value) };

	const handleKeySubmit = (e) => {
		e.preventDefault();

		if (!loading) {
			if (key.length === 0) {
				setErrorLogin("Key is required");
				setTimeout(function () {
					setErrorLogin(null);
				}, 2500)
			} else {
				setLoading(true);
				const keyLoginRes = login(key);

				keyLoginRes.then(res => {
					console.log(res)
					setLoading(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorLogin(error);
							setTimeout(function () {
								setErrorLogin(null);
							}, 2500)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorLogin(error);
							setTimeout(function () {
								setErrorLogin(null);
							}, 2500)
						}
					} else {
						setSuccessLogin("Login successful!");
						updateCookie(key, (remember_me ? 7 : 1));

						setTimeout(function () {
							setSuccessLogin(null);
							navigate(`/internal/dashboard`);
							window.location.reload(true);
						}, 2000);
					}
				}).catch(err => {
					setLoading(false);
				})
			}
		}
	};

	return {
		key, remember_me, cookie, loading, handleKey, errorLogin, successLogin, handleRememberMe, handleKeySubmit,
	};
};

export { useLogin };