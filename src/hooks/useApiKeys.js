import { useState } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { addApiKey, deleteApiKey, disableApiKey, enableApiKey } from "../api/apiKeys";

const useAddApiKey = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingAddApiKey, setLoadingAddApiKey] = useState(false);
	const [removeAddApiKeyModal, setRemoveAddApiKeyModal] = useState(null);
	const [alias, setAlias] = useState(null);
	const [type, setType] = useState(null);

	const [errorAddApiKey, setErrorAddApiKey] = useState(null);
	const [successAddApiKey, setSuccessAddApiKey] = useState(null);

	const handleAlias = (e) => { e.preventDefault(); setAlias(e.target.value); };
	const handleType = (e) => { e.preventDefault(); setType(e.target.value); };

	const handleAddApiKey = (e) => {
		e.preventDefault();

		if (!loadingAddApiKey) {
			if (!alias) {
				setErrorAddApiKey(null);
				setSuccessAddApiKey(null);
				setErrorAddApiKey("Alias is required");
				setTimeout(function () {
					setErrorAddApiKey(null);
				}, 2500)
			} else if (alias.length < 3) {
				setErrorAddApiKey("Alias minimum characters - 3");
				setTimeout(function () {
					setErrorAddApiKey(null);
				}, 2500)
			} else if (alias.length > 150) {
				setErrorAddApiKey("Alias maximum characters - 150");
				setTimeout(function () {
					setErrorAddApiKey(null);
				}, 2500)
			} else if (!type) {
				setErrorAddApiKey("Type is required");
				setTimeout(function () {
					setErrorAddApiKey(null);
				}, 2500)
			} else {
				setLoadingAddApiKey(true);

				const addApiKeyRes = addApiKey(cookie, {
					alias: alias,
					type: type
				})

				addApiKeyRes.then(res => {
					setLoadingAddApiKey(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddApiKey(error);
							setTimeout(function () {
								setErrorAddApiKey(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddApiKey(error);
							setTimeout(function () {
								setErrorAddApiKey(null);
							}, 2000)
						}
					} else {
						setErrorAddApiKey(null);
						setSuccessAddApiKey(`API Key added successfully!`);

						setTimeout(function () {
							setSuccessAddApiKey(null);
							setRemoveAddApiKeyModal(true);
							setAlias("");
							setType(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingAddApiKey(false);
				})

			}
		}
	};

	return {
		cookie, alias, type, loadingAddApiKey, setRemoveAddApiKeyModal, errorAddApiKey, successAddApiKey,
		setType, handleAddApiKey, handleAlias, handleType, setAlias, removeAddApiKeyModal
	};
};

const useDisableApiKey = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDisableApiKey, setLoadingDisableApiKey] = useState(false);
	const [removeDisableApiKeyModal, setRemoveDisableApiKeyModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDisableApiKey, setErrorDisableApiKey] = useState(null);
	const [successDisableApiKey, setSuccessDisableApiKey] = useState(null);

	const handleDisableApiKey = () => {

		if (!loadingDisableApiKey) {
			if (!uniqueId) {
				setErrorDisableApiKey(null);
				setSuccessDisableApiKey(null);
				setErrorDisableApiKey("Unique ID is required");
				setTimeout(function () {
					setErrorDisableApiKey(null);
				}, 2500)
			} else {
				setLoadingDisableApiKey(true);

				const disableApiKeyRes = disableApiKey(cookie, {
					unique_id: uniqueId
				})

				disableApiKeyRes.then(res => {
					setLoadingDisableApiKey(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDisableApiKey(error);
							setTimeout(function () {
								setErrorDisableApiKey(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDisableApiKey(error);
							setTimeout(function () {
								setErrorDisableApiKey(null);
							}, 2000)
						}
					} else {
						setErrorDisableApiKey(null);
						setSuccessDisableApiKey(`API Key Disabled successfully!`);

						setTimeout(function () {
							setSuccessDisableApiKey(null);
							setRemoveDisableApiKeyModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDisableApiKey(false);
				})

			}
		}
	};

	return {
		cookie, loadingDisableApiKey, removeDisableApiKeyModal, errorDisableApiKey, successDisableApiKey, handleDisableApiKey,
		setRemoveDisableApiKeyModal, setUniqueId
	};
};

const useEnableApiKey = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingEnableApiKey, setLoadingEnableApiKey] = useState(false);
	const [removeEnableApiKeyModal, setRemoveEnableApiKeyModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorEnableApiKey, setErrorEnableApiKey] = useState(null);
	const [successEnableApiKey, setSuccessEnableApiKey] = useState(null);

	const handleEnableApiKey = () => {

		if (!loadingEnableApiKey) {
			if (!uniqueId) {
				setErrorEnableApiKey(null);
				setSuccessEnableApiKey(null);
				setErrorEnableApiKey("Unique ID is required");
				setTimeout(function () {
					setErrorEnableApiKey(null);
				}, 2500)
			} else {
				setLoadingEnableApiKey(true);

				const enableApiKeyRes = enableApiKey(cookie, {
					unique_id: uniqueId
				})

				enableApiKeyRes.then(res => {
					setLoadingEnableApiKey(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorEnableApiKey(error);
							setTimeout(function () {
								setErrorEnableApiKey(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorEnableApiKey(error);
							setTimeout(function () {
								setErrorEnableApiKey(null);
							}, 2000)
						}
					} else {
						setErrorEnableApiKey(null);
						setSuccessEnableApiKey(`API Key Enabled successfully!`);

						setTimeout(function () {
							setSuccessEnableApiKey(null);
							setRemoveEnableApiKeyModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingEnableApiKey(false);
				})

			}
		}
	};

	return {
		cookie, loadingEnableApiKey, removeEnableApiKeyModal, errorEnableApiKey, successEnableApiKey, handleEnableApiKey,
		setRemoveEnableApiKeyModal, setUniqueId
	};
};

const useDeleteApiKey = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteApiKey, setLoadingDeleteApiKey] = useState(false);
	const [removeDeleteApiKeyModal, setRemoveDeleteApiKeyModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteApiKey, setErrorDeleteApiKey] = useState(null);
	const [successDeleteApiKey, setSuccessDeleteApiKey] = useState(null);

	const handleDeleteApiKey = () => {

		if (!loadingDeleteApiKey) {
			if (!uniqueId) {
				setErrorDeleteApiKey(null);
				setSuccessDeleteApiKey(null);
				setErrorDeleteApiKey("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteApiKey(null);
				}, 2500)
			} else {
				setLoadingDeleteApiKey(true);

				const deleteApiKeyRes = deleteApiKey(cookie, {
					unique_id: uniqueId
				})

				deleteApiKeyRes.then(res => {
					setLoadingDeleteApiKey(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteApiKey(error);
							setTimeout(function () {
								setErrorDeleteApiKey(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteApiKey(error);
							setTimeout(function () {
								setErrorDeleteApiKey(null);
							}, 2000)
						}
					} else {
						setErrorDeleteApiKey(null);
						setSuccessDeleteApiKey(`API Key deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteApiKey(null);
							setRemoveDeleteApiKeyModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteApiKey(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteApiKey, removeDeleteApiKeyModal, errorDeleteApiKey, successDeleteApiKey, handleDeleteApiKey,
		setRemoveDeleteApiKeyModal, setUniqueId
	};
};

export { useAddApiKey, useDisableApiKey, useEnableApiKey, useDeleteApiKey };