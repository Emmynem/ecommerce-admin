import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addCategory, deleteCategory, editCategoryName, editCategoryImage } from "../api/categories";
import { uploadFile } from "../api/clouder";

const useAddCategory = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingAddCategory, setLoadingAddCategory] = useState(false);
	const [removeAddCategoryModal, setRemoveAddCategoryModal] = useState(null);
	const [name, setName] = useState(null);
	const [selectedAddCategory, setSelectedAddCategory] = useState("");
	const [uploadingAddCategoryPercentage, setUploadingAddCategoryPercentage] = useState(0);

	const [errorAddCategory, setErrorAddCategory] = useState(null);
	const [successAddCategory, setSuccessAddCategory] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP"];
	const maximum_file_size = 20 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };

	const handleAddCategory = (e) => {
		e.preventDefault();

		if (!loadingAddCategory) {
			if (!name) {
				setErrorAddCategory(null);
				setSuccessAddCategory(null);
				setErrorAddCategory("Name is required");
				setTimeout(function () {
					setErrorAddCategory(null);
				}, 2500)
			} else if (name.length > 200) {
				setErrorAddCategory("Name maximum characters - 200");
				setTimeout(function () {
					setErrorAddCategory(null);
				}, 2500)
			} else if (!allowed_extensions.includes(selectedAddCategory.type)) {
				setErrorAddCategory("Invalid image format (.png, .jpg, .jpeg & .webp)");
				setTimeout(function () {
					setErrorAddCategory(null);
				}, 2000)
			} else if (selectedAddCategory.size > maximum_file_size) {
				setErrorAddCategory("File too large (max 20mb)");
				setTimeout(function () {
					setErrorAddCategory(null);
				}, 2000)
			} else {
				setLoadingAddCategory(true);

				const formdata = new FormData();
				formdata.append("file_path", "categories");
				formdata.append("file", selectedAddCategory);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingAddCategory(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddCategory(error);
							setTimeout(function () {
								setErrorAddCategory(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddCategory(error);
							setTimeout(function () {
								setErrorAddCategory(null);
							}, 2000)
						}
					} else {
						setErrorAddCategory(null);
						setUploadingAddCategoryPercentage(0);
						setSuccessAddCategory(`Category Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const addCategoryRes = addCategory(cookie, {
							name, image, image_type, image_public_id
						})

						addCategoryRes.then(res => {
							setLoadingAddCategory(false);
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setErrorAddCategory(error);
									setTimeout(function () {
										setErrorAddCategory(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setErrorAddCategory(error);
									setTimeout(function () {
										setErrorAddCategory(null);
									}, 2000)
								}
							} else {
								setErrorAddCategory(null);
								setUploadingAddCategoryPercentage(0);
								setSuccessAddCategory(`Category added successfully!`);

								setTimeout(function () {
									setSuccessAddCategory(null);
									setRemoveAddCategoryModal(true);
								}, 2500)
							}
						}).catch(err => {
							setUploadingAddCategoryPercentage(0);
							setLoadingAddCategory(false);
						})

					}
				}).catch(err => {
					setUploadingAddCategoryPercentage(0);
					setLoadingAddCategory(false);
				})
			}
		}
	};

	return {
		cookie, name, loadingAddCategory, setRemoveAddCategoryModal, errorAddCategory, successAddCategory, removeAddCategoryModal, setSelectedAddCategory,
		handleAddCategory, handleName, setName, uploadingAddCategoryPercentage, selectedAddCategory,
	};
};

const useUpdateCategoryName = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateCategoryName, setLoadingUpdateCategoryName] = useState(false);
	const [removeUpdateCategoryNameModal, setRemoveUpdateCategoryNameModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [name, setName] = useState(null);

	const [errorUpdateCategoryName, setErrorUpdateCategoryName] = useState(null);
	const [successUpdateCategoryName, setSuccessUpdateCategoryName] = useState(null);

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };

	const handleUpdateCategoryName = (e) => {
		e.preventDefault();

		if (!loadingUpdateCategoryName) {
			if (!uniqueId) {
				setErrorUpdateCategoryName(null);
				setSuccessUpdateCategoryName(null);
				setErrorUpdateCategoryName("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateCategoryName(null);
				}, 2500)
			} else if (!name) {
				setErrorUpdateCategoryName("Name is required");
				setTimeout(function () {
					setErrorUpdateCategoryName(null);
				}, 2500)
			} else if (name.length > 200) {
				setErrorUpdateCategoryName("Name maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateCategoryName(null);
				}, 2500)
			} else {
				setLoadingUpdateCategoryName(true);

				const editCategoryNameRes = editCategoryName(cookie, {
					unique_id: uniqueId,
					name
				})

				editCategoryNameRes.then(res => {
					setLoadingUpdateCategoryName(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateCategoryName(error);
							setTimeout(function () {
								setErrorUpdateCategoryName(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateCategoryName(error);
							setTimeout(function () {
								setErrorUpdateCategoryName(null);
							}, 2000)
						}
					} else {
						setErrorUpdateCategoryName(null);
						setSuccessUpdateCategoryName(`Category name edited!`);

						setTimeout(function () {
							setSuccessUpdateCategoryName(null);
							setRemoveUpdateCategoryNameModal(true);
							setUniqueId(null);
							setName(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateCategoryName(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateCategoryName, removeUpdateCategoryNameModal, errorUpdateCategoryName, successUpdateCategoryName, handleUpdateCategoryName,
		setRemoveUpdateCategoryNameModal, setUniqueId, setName, name, handleName
	};
};

const useUploadCategoryImage = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingCategoryImage, setLoadingCategoryImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeCategoryImageModal, setRemoveCategoryImageModal] = useState(null);
	const [selectedCategoryImage, setSelectedCategoryImage] = useState("");
	const [uploadingCategoryImagePercentage, setUploadingCategoryImagePercentage] = useState(0);

	const [errorCategoryImage, setErrorCategoryImage] = useState(null);
	const [successCategoryImage, setSuccessCategoryImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP"];
	const maximum_file_size = 20 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadCategoryImage = (e) => {
		e.preventDefault();

		if (!loadingCategoryImage) {
			if (!uniqueId) {
				setErrorCategoryImage(null);
				setSuccessCategoryImage(null);
				setErrorCategoryImage("Unique ID is required");
				setTimeout(function () {
					setErrorCategoryImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedCategoryImage.type)) {
				setErrorCategoryImage("Invalid image format (.png, .jpg, .jpeg & .webp)");
				setTimeout(function () {
					setErrorCategoryImage(null);
				}, 2000)
			} else if (selectedCategoryImage.size > maximum_file_size) {
				setErrorCategoryImage("File too large (max 20mb)");
				setTimeout(function () {
					setErrorCategoryImage(null);
				}, 2000)
			} else {
				setLoadingCategoryImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "categories");
				formdata.append("file", selectedCategoryImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingCategoryImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCategoryImage(error);
							setTimeout(function () {
								setErrorCategoryImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCategoryImage(error);
							setTimeout(function () {
								setErrorCategoryImage(null);
							}, 2000)
						}
					} else {
						setErrorCategoryImage(null);
						setUploadingCategoryImagePercentage(0);
						setSuccessCategoryImage(`Category Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editCategoryImageRes = editCategoryImage(cookie, {
							unique_id: uniqueId, image, image_type, image_public_id
						})

						editCategoryImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingCategoryImagePercentage(0);
									setLoadingCategoryImage(false);
									setErrorCategoryImage(error);
									setTimeout(function () {
										setErrorCategoryImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingCategoryImagePercentage(0);
									setLoadingCategoryImage(false);
									setErrorCategoryImage(error);
									setTimeout(function () {
										setErrorCategoryImage(null);
									}, 2000)
								}
							} else {
								setErrorCategoryImage(null);
								setUploadingCategoryImagePercentage(0);
								setSuccessCategoryImage(`Category Image edited successfully!`);

								setTimeout(function () {
									setLoadingCategoryImage(false);
									setSuccessCategoryImage(null);
									setRemoveCategoryImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingCategoryImagePercentage(0);
							setLoadingCategoryImage(false);
						})
					}
				}).catch(err => {
					setUploadingCategoryImagePercentage(0);
					setLoadingCategoryImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingCategoryImage, errorCategoryImage, successCategoryImage, handleUploadCategoryImage, uniqueId, setSelectedCategoryImage,
		setUniqueId, uploadingCategoryImagePercentage, selectedCategoryImage, removeCategoryImageModal, setRemoveCategoryImageModal
	};
};

const useDeleteCategory = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteCategory, setLoadingDeleteCategory] = useState(false);
	const [removeDeleteCategoryModal, setRemoveDeleteCategoryModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteCategory, setErrorDeleteCategory] = useState(null);
	const [successDeleteCategory, setSuccessDeleteCategory] = useState(null);

	const handleDeleteCategory = () => {

		if (!loadingDeleteCategory) {
			if (!uniqueId) {
				setErrorDeleteCategory(null);
				setSuccessDeleteCategory(null);
				setErrorDeleteCategory("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteCategory(null);
				}, 2500)
			} else {
				setLoadingDeleteCategory(true);

				const deleteCategoryRes = deleteCategory(cookie, {
					unique_id: uniqueId
				})

				deleteCategoryRes.then(res => {
					setLoadingDeleteCategory(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteCategory(error);
							setTimeout(function () {
								setErrorDeleteCategory(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteCategory(error);
							setTimeout(function () {
								setErrorDeleteCategory(null);
							}, 2000)
						}
					} else {
						setErrorDeleteCategory(null);
						setSuccessDeleteCategory(`Category deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteCategory(null);
							setRemoveDeleteCategoryModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteCategory(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteCategory, removeDeleteCategoryModal, errorDeleteCategory, successDeleteCategory, handleDeleteCategory,
		setRemoveDeleteCategoryModal, setUniqueId
	};
};

export { useAddCategory, useUpdateCategoryName, useUploadCategoryImage, useDeleteCategory };
