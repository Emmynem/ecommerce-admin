import { useState, useEffect } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getAnalytics as GetAnalytics } from "../api/analytics";

const useGetAnalytics = () => {
	const { cookie, forceLogout } = useCookie(config.key, "");

	const [analytics, setAnalytics] = useState(null);

	async function getAnalytics() {
		const response = await GetAnalytics(cookie);
		setAnalytics(response.data);
		// if (response.response_code === 403) forceLogout();
	}

	useEffect(() => {
		if (analytics === null) {
			getAnalytics();
		}
	}, [analytics]);

	return { analytics, setAnalytics, getAnalytics }
};

export { useGetAnalytics };