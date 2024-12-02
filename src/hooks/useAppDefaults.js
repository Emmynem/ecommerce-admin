import { useState } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { addAppDefault, deleteAppDefault, editAppDefault } from "../api/appDefaults";

const useAddAppDefault = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingAddAppDefault, setLoadingAddAppDefault] = useState(false);
	const [removeAddAppDefaultModal, setRemoveAddAppDefaultModal] = useState(null);
	const [criteria, setCriteria] = useState(null);
	const [dataType, setDataType] = useState(null);
	const [value, setValue] = useState(null);

	const [errorAddAppDefault, setErrorAddAppDefault] = useState(null);
	const [successAddAppDefault, setSuccessAddAppDefault] = useState(null);

	const app_defaults_data_type = ["STRING", "INTEGER", "BIGINT", "BOOLEAN", "ARRAY", "MAP"];

	const validate_app_default_type = (app_default) => {
		if (!app_defaults_data_type.includes(app_default)) return false;
		return true;
	};

	const validate_app_default_value = (value, data_type) => {
		if (data_type === "BOOLEAN" && (typeof value === "boolean" || (value === "TRUE" || value === "FALSE"))) return true
		else if (data_type === "STRING" && typeof value === "string") return true
		else if (data_type === "INTEGER" && (typeof value === "number" || typeof parseInt(value) === "number")) return true
		else if (data_type === "BIGINT" && (typeof value === "bigint" || typeof parseInt(value) === "bigint")) return true
		else if (data_type === "ARRAY" && Array.isArray(JSON.parse(value)) && JSON.parse(value).length !== 0) return true
		else if (data_type === "MAP" && typeof JSON.parse(value) === "object") return true
		else return false
	};

	const handleCriteria = (e) => { e.preventDefault(); setCriteria(e.target.value); };
	const handleDataType = (e) => { e.preventDefault(); setDataType(e.target.value); if (e.target.value === "ARRAY") setValue(JSON.stringify(["first_value"])); if (e.target.value === "MAP") setValue(JSON.stringify({"first_key": "first_value"})); };
	const handleValue = (e) => { e.preventDefault(); setValue(e.target.value); };

	const handleAddAppDefault = (e) => {
		e.preventDefault();

		if (!loadingAddAppDefault) {
			if (!criteria) {
				setErrorAddAppDefault(null);
				setSuccessAddAppDefault(null);
				setErrorAddAppDefault("Criteria is required");
				setTimeout(function () {
					setErrorAddAppDefault(null);
				}, 2500)
			} else if (criteria.length < 3) {
				setErrorAddAppDefault("Criteria maximum characters - 3");
				setTimeout(function () {
					setErrorAddAppDefault(null);
				}, 2500)
			} else if (criteria.length > 50) {
				setErrorAddAppDefault("Criteria maximum characters - 50");
				setTimeout(function () {
					setErrorAddAppDefault(null);
				}, 2500)
			} else if (!dataType) {
				setErrorAddAppDefault("Data Type is required");
				setTimeout(function () {
					setErrorAddAppDefault(null);
				}, 2500)
			} else if (!validate_app_default_type(dataType)) {
				setErrorAddAppDefault("Invalid data type");
				setTimeout(function () {
					setErrorAddAppDefault(null);
				}, 2500)
			} else if (!value) {
				setErrorAddAppDefault("Value is required");
				setTimeout(function () {
					setErrorAddAppDefault(null);
				}, 2500)
			} else if (!validate_app_default_value(value, dataType)) {
				setErrorAddAppDefault("Invalid data type value");
				setTimeout(function () {
					setErrorAddAppDefault(null);
				}, 2500)
			} else {
				setLoadingAddAppDefault(true);

				const addAppDefaultRes = addAppDefault(cookie, {
					criteria: criteria,
					data_type: dataType,
					value: dataType === "ARRAY" || dataType === "MAP" ? JSON.parse(value) : dataType === "BOOLEAN" ? (value === "TRUE" ? true : false) : dataType === "STRING" ? value : parseInt(value)
				})

				addAppDefaultRes.then(res => {
					setLoadingAddAppDefault(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddAppDefault(error);
							setTimeout(function () {
								setErrorAddAppDefault(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddAppDefault(error);
							setTimeout(function () {
								setErrorAddAppDefault(null);
							}, 2000)
						}
					} else {
						setErrorAddAppDefault(null);
						setSuccessAddAppDefault(`App Default added successfully!`);

						setTimeout(function () {
							setSuccessAddAppDefault(null);
							setRemoveAddAppDefaultModal(true);
						}, 2500)
					}
				}).catch(err => {
					setLoadingAddAppDefault(false);
				})

			}
		}
	};

	return {
		cookie, criteria, dataType, value, loadingAddAppDefault, setRemoveAddAppDefaultModal, errorAddAppDefault, successAddAppDefault, handleValue, 
		setDataType, setValue, handleAddAppDefault, handleCriteria, handleDataType, setCriteria, removeAddAppDefaultModal, app_defaults_data_type
	};
};

const useEditAppDefault = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingEditAppDefault, setLoadingEditAppDefault] = useState(false);
	const [removeEditAppDefaultModal, setRemoveEditAppDefaultModal] = useState(null);
	const [criteria, setCriteria] = useState(null);
	const [dataType, setDataType] = useState(null);
	const [value, setValue] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorEditAppDefault, setErrorEditAppDefault] = useState(null);
	const [successEditAppDefault, setSuccessEditAppDefault] = useState(null);

	const app_defaults_data_type = ["STRING", "INTEGER", "BIGINT", "BOOLEAN", "ARRAY", "MAP"];

	const validate_app_default_type = (app_default) => {
		if (!app_defaults_data_type.includes(app_default)) return false;
		return true;
	};

	const validate_app_default_value = (value, data_type) => {
		if (data_type === "BOOLEAN" && (typeof value === "boolean" || (value === "TRUE" || value === "FALSE"))) return true
		else if (data_type === "STRING" && typeof value === "string") return true
		else if (data_type === "INTEGER" && (typeof value === "number" || typeof parseInt(value) === "number")) return true
		else if (data_type === "BIGINT" && (typeof value === "bigint" || typeof parseInt(value) === "bigint")) return true
		else if (data_type === "ARRAY" && Array.isArray(JSON.parse(value)) && JSON.parse(value).length !== 0) return true
		else if (data_type === "MAP" && typeof JSON.parse(value) === "object") return true
		else return false
	};

	const handleCriteria = (e) => { e.preventDefault(); setCriteria(e.target.value); };
	const handleDataType = (e) => { e.preventDefault(); setDataType(e.target.value); };
	const handleValue = (e) => { e.preventDefault(); setValue(e.target.value); };

	const handleEditAppDefault = (e) => {
		e.preventDefault();

		if (!loadingEditAppDefault) {
			if (!uniqueId) {
				setErrorEditAppDefault(null);
				setSuccessEditAppDefault(null);
				setErrorEditAppDefault("Unique ID is required");
				setTimeout(function () {
					setErrorEditAppDefault(null);
				}, 2500)
			} else if (!criteria) {
				setErrorEditAppDefault("Criteria is required");
				setTimeout(function () {
					setErrorEditAppDefault(null);
				}, 2500)
			} else if (criteria.length < 3) {
				setErrorEditAppDefault("Criteria maximum characters - 3");
				setTimeout(function () {
					setErrorEditAppDefault(null);
				}, 2500)
			} else if (criteria.length > 50) {
				setErrorEditAppDefault("Criteria maximum characters - 50");
				setTimeout(function () {
					setErrorEditAppDefault(null);
				}, 2500)
			} else if (!dataType) {
				setErrorEditAppDefault("Data Type is required");
				setTimeout(function () {
					setErrorEditAppDefault(null);
				}, 2500)
			} else if (!validate_app_default_type(dataType)) {
				setErrorEditAppDefault("Invalid data type");
				setTimeout(function () {
					setErrorEditAppDefault(null);
				}, 2500)
			} else if (!value) {
				setErrorEditAppDefault("Value is required");
				setTimeout(function () {
					setErrorEditAppDefault(null);
				}, 2500)
			} else if (!validate_app_default_value(value, dataType)) {
				setErrorEditAppDefault("Invalid data type value");
				setTimeout(function () {
					setErrorEditAppDefault(null);
				}, 2500)
			} else {
				setLoadingEditAppDefault(true);

				const editAppDefaultRes = editAppDefault(cookie, {
					unique_id: uniqueId,
					criteria: criteria,
					data_type: dataType,
					value: dataType === "ARRAY" || dataType === "MAP" ? JSON.parse(value) : dataType === "BOOLEAN" ? (value === "TRUE" ? true : false) : dataType === "STRING" ? value : parseInt(value)
				})

				editAppDefaultRes.then(res => {
					setLoadingEditAppDefault(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorEditAppDefault(error);
							setTimeout(function () {
								setErrorEditAppDefault(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorEditAppDefault(error);
							setTimeout(function () {
								setErrorEditAppDefault(null);
							}, 2000)
						}
					} else {
						setErrorEditAppDefault(null);
						setSuccessEditAppDefault(`App Default edited successfully!`);

						setTimeout(function () {
							setSuccessEditAppDefault(null);
							setRemoveEditAppDefaultModal(true);
						}, 2500)
					}
				}).catch(err => {
					setLoadingEditAppDefault(false);
				})

			}
		}
	};

	return {
		cookie, criteria, dataType, value, loadingEditAppDefault, setRemoveEditAppDefaultModal, errorEditAppDefault, successEditAppDefault, handleValue, 
		setDataType, setValue, handleEditAppDefault, handleCriteria, handleDataType, setCriteria, removeEditAppDefaultModal, setUniqueId, app_defaults_data_type
	};
};

const useDeleteAppDefault = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteAppDefault, setLoadingDeleteAppDefault] = useState(false);
	const [removeDeleteAppDefaultModal, setRemoveDeleteAppDefaultModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteAppDefault, setErrorDeleteAppDefault] = useState(null);
	const [successDeleteAppDefault, setSuccessDeleteAppDefault] = useState(null);

	const handleDeleteAppDefault = () => {

		if (!loadingDeleteAppDefault) {
			if (!uniqueId) {
				setErrorDeleteAppDefault(null);
				setSuccessDeleteAppDefault(null);
				setErrorDeleteAppDefault("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteAppDefault(null);
				}, 2500)
			} else {
				setLoadingDeleteAppDefault(true);

				const deleteAppDefaultRes = deleteAppDefault(cookie, {
					unique_id: uniqueId
				})

				deleteAppDefaultRes.then(res => {
					setLoadingDeleteAppDefault(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteAppDefault(error);
							setTimeout(function () {
								setErrorDeleteAppDefault(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteAppDefault(error);
							setTimeout(function () {
								setErrorDeleteAppDefault(null);
							}, 2000)
						}
					} else {
						setErrorDeleteAppDefault(null);
						setSuccessDeleteAppDefault(`App Default deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteAppDefault(null);
							setRemoveDeleteAppDefaultModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteAppDefault(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteAppDefault, removeDeleteAppDefaultModal, errorDeleteAppDefault, successDeleteAppDefault, handleDeleteAppDefault,
		setRemoveDeleteAppDefaultModal, setUniqueId
	};
};

export { useAddAppDefault, useEditAppDefault, useDeleteAppDefault };