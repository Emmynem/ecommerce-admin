import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addBanner, deleteBanner, editBannerDetails, editBannerImage } from "../api/banners";
import { uploadFile } from "../api/clouder";

const useAddBanner = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingAddBanner, setLoadingAddBanner] = useState(false);
	const [removeAddBannerModal, setRemoveAddBannerModal] = useState(null);
	const [name, setName] = useState(null);
	const [link, setLink] = useState(null);
	const [selectedAddBanner, setSelectedAddBanner] = useState("");
	const [uploadingAddBannerPercentage, setUploadingAddBannerPercentage] = useState(0);

	const [errorAddBanner, setErrorAddBanner] = useState(null);
	const [successAddBanner, setSuccessAddBanner] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };
	const handleLink = (e) => { e.preventDefault(); setLink(e.target.value); };

	const handleAddBanner = (e) => {
		e.preventDefault();

		if (!loadingAddBanner) {
			if (!name) {
				setErrorAddBanner(null);
				setSuccessAddBanner(null);
				setErrorAddBanner("Name is required");
				setTimeout(function () {
					setErrorAddBanner(null);
				}, 2500)
			} else if (name.length > 500) {
				setErrorAddBanner("Name maximum characters - 500");
				setTimeout(function () {
					setErrorAddBanner(null);
				}, 2500)
			} else if (!link) {
				setErrorAddBanner("Link is required");
				setTimeout(function () {
					setErrorAddBanner(null);
				}, 2500)
			} else if (link.length > 500) {
				setErrorAddBanner("Link maximum characters - 500");
				setTimeout(function () {
					setErrorAddBanner(null);
				}, 2500)
			} else if (!allowed_extensions.includes(selectedAddBanner.type)) {
				setErrorAddBanner("Invalid image format (.png, .jpg, .jpeg & .webp)");
				setTimeout(function () {
					setErrorAddBanner(null);
				}, 2000)
			} else if (selectedAddBanner.size > maximum_file_size) {
				setErrorAddBanner("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddBanner(null);
				}, 2000)
			} else {
				setLoadingAddBanner(true);

				const formdata = new FormData();
				formdata.append("file_path", "banners");
				formdata.append("file", selectedAddBanner);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingAddBanner(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddBanner(error);
							setTimeout(function () {
								setErrorAddBanner(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddBanner(error);
							setTimeout(function () {
								setErrorAddBanner(null);
							}, 2000)
						}
					} else {
						setErrorAddBanner(null);
						setUploadingAddBannerPercentage(0);
						setSuccessAddBanner(`Banner Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const addBannerRes = addBanner(cookie, {
							name, link, image, image_type, image_public_id
						})

						addBannerRes.then(res => {
							setLoadingAddBanner(false);
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setErrorAddBanner(error);
									setTimeout(function () {
										setErrorAddBanner(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setErrorAddBanner(error);
									setTimeout(function () {
										setErrorAddBanner(null);
									}, 2000)
								}
							} else {
								setErrorAddBanner(null);
								setUploadingAddBannerPercentage(0);
								setSuccessAddBanner(`Banner added successfully!`);

								setTimeout(function () {
									setSuccessAddBanner(null);
									setRemoveAddBannerModal(true);
								}, 2500)
							}
						}).catch(err => {
							setUploadingAddBannerPercentage(0);
							setLoadingAddBanner(false);
						})

					}
				}).catch(err => {
					setUploadingAddBannerPercentage(0);
					setLoadingAddBanner(false);
				})
			}
		}
	};

	return {
		cookie, name, link, loadingAddBanner, setRemoveAddBannerModal, errorAddBanner, successAddBanner, removeAddBannerModal, setSelectedAddBanner,
		handleAddBanner, handleName, setName, handleLink, setLink, uploadingAddBannerPercentage, selectedAddBanner,
	};
};

const useUpdateBannerDetails = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateBannerDetails, setLoadingUpdateBannerDetails] = useState(false);
	const [removeUpdateBannerDetailsModal, setRemoveUpdateBannerDetailsModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [name, setName] = useState(null);
	const [link, setLink] = useState(null);

	const [errorUpdateBannerDetails, setErrorUpdateBannerDetails] = useState(null);
	const [successUpdateBannerDetails, setSuccessUpdateBannerDetails] = useState(null);

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };
	const handleLink = (e) => { e.preventDefault(); setLink(e.target.value); };

	const handleUpdateBannerDetails = (e) => {
		e.preventDefault();

		if (!loadingUpdateBannerDetails) {
			if (!uniqueId) {
				setErrorUpdateBannerDetails(null);
				setSuccessUpdateBannerDetails(null);
				setErrorUpdateBannerDetails("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateBannerDetails(null);
				}, 2500)
			} else if (!name) {
				setErrorUpdateBannerDetails("Name is required");
				setTimeout(function () {
					setErrorUpdateBannerDetails(null);
				}, 2500)
			} else if (name.length > 500) {
				setErrorUpdateBannerDetails("Name maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateBannerDetails(null);
				}, 2500)
			} else if (!link) {
				setErrorUpdateBannerDetails("Link is required");
				setTimeout(function () {
					setErrorUpdateBannerDetails(null);
				}, 2500)
			} else if (link.length > 500) {
				setErrorUpdateBannerDetails("Link maximum characters - 500");
				setTimeout(function () {
					setErrorUpdateBannerDetails(null);
				}, 2500)
			} else {
				setLoadingUpdateBannerDetails(true);

				const editBannerDetailsRes = editBannerDetails(cookie, {
					unique_id: uniqueId,
					name, 
					link
				})

				editBannerDetailsRes.then(res => {
					setLoadingUpdateBannerDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateBannerDetails(error);
							setTimeout(function () {
								setErrorUpdateBannerDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateBannerDetails(error);
							setTimeout(function () {
								setErrorUpdateBannerDetails(null);
							}, 2000)
						}
					} else {
						setErrorUpdateBannerDetails(null);
						setSuccessUpdateBannerDetails(`Banner details edited!`);

						setTimeout(function () {
							setSuccessUpdateBannerDetails(null);
							setRemoveUpdateBannerDetailsModal(true);
							setUniqueId(null);
							setName(null);
							setLink(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateBannerDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateBannerDetails, removeUpdateBannerDetailsModal, errorUpdateBannerDetails, successUpdateBannerDetails, handleUpdateBannerDetails,
		setRemoveUpdateBannerDetailsModal, setUniqueId, setName, name, handleName, setLink, link, handleLink
	};
};

const useUploadBannerImage = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingBannerImage, setLoadingBannerImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeBannerImageModal, setRemoveBannerImageModal] = useState(null);
	const [selectedBannerImage, setSelectedBannerImage] = useState("");
	const [uploadingBannerImagePercentage, setUploadingBannerImagePercentage] = useState(0);

	const [errorBannerImage, setErrorBannerImage] = useState(null);
	const [successBannerImage, setSuccessBannerImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadBannerImage = (e) => {
		e.preventDefault();

		if (!loadingBannerImage) {
			if (!uniqueId) {
				setErrorBannerImage(null);
				setSuccessBannerImage(null);
				setErrorBannerImage("Unique ID is required");
				setTimeout(function () {
					setErrorBannerImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedBannerImage.type)) {
				setErrorBannerImage("Invalid image format (.png, .jpg, .jpeg & .webp)");
				setTimeout(function () {
					setErrorBannerImage(null);
				}, 2000)
			} else if (selectedBannerImage.size > maximum_file_size) {
				setErrorBannerImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorBannerImage(null);
				}, 2000)
			} else {
				setLoadingBannerImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "banners");
				formdata.append("file", selectedBannerImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingBannerImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorBannerImage(error);
							setTimeout(function () {
								setErrorBannerImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorBannerImage(error);
							setTimeout(function () {
								setErrorBannerImage(null);
							}, 2000)
						}
					} else {
						setErrorBannerImage(null);
						setUploadingBannerImagePercentage(0);
						setSuccessBannerImage(`Banner Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const editBannerImageRes = editBannerImage(cookie, {
							unique_id: uniqueId, image, image_type, image_public_id
						})

						editBannerImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingBannerImagePercentage(0);
									setLoadingBannerImage(false);
									setErrorBannerImage(error);
									setTimeout(function () {
										setErrorBannerImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingBannerImagePercentage(0);
									setLoadingBannerImage(false);
									setErrorBannerImage(error);
									setTimeout(function () {
										setErrorBannerImage(null);
									}, 2000)
								}
							} else {
								setErrorBannerImage(null);
								setUploadingBannerImagePercentage(0);
								setSuccessBannerImage(`Banner Image edited successfully!`);

								setTimeout(function () {
									setLoadingBannerImage(false);
									setSuccessBannerImage(null);
									setRemoveBannerImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingBannerImagePercentage(0);
							setLoadingBannerImage(false);
						})
					}
				}).catch(err => {
					setUploadingBannerImagePercentage(0);
					setLoadingBannerImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingBannerImage, errorBannerImage, successBannerImage, handleUploadBannerImage, uniqueId, setSelectedBannerImage,
		setUniqueId, uploadingBannerImagePercentage, selectedBannerImage, removeBannerImageModal, setRemoveBannerImageModal
	};
};

const useDeleteBanner = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteBanner, setLoadingDeleteBanner] = useState(false);
	const [removeDeleteBannerModal, setRemoveDeleteBannerModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteBanner, setErrorDeleteBanner] = useState(null);
	const [successDeleteBanner, setSuccessDeleteBanner] = useState(null);

	const handleDeleteBanner = () => {

		if (!loadingDeleteBanner) {
			if (!uniqueId) {
				setErrorDeleteBanner(null);
				setSuccessDeleteBanner(null);
				setErrorDeleteBanner("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteBanner(null);
				}, 2500)
			} else {
				setLoadingDeleteBanner(true);

				const deleteBannerRes = deleteBanner(cookie, {
					unique_id: uniqueId
				})

				deleteBannerRes.then(res => {
					setLoadingDeleteBanner(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteBanner(error);
							setTimeout(function () {
								setErrorDeleteBanner(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteBanner(error);
							setTimeout(function () {
								setErrorDeleteBanner(null);
							}, 2000)
						}
					} else {
						setErrorDeleteBanner(null);
						setSuccessDeleteBanner(`Banner deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteBanner(null);
							setRemoveDeleteBannerModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteBanner(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteBanner, removeDeleteBannerModal, errorDeleteBanner, successDeleteBanner, handleDeleteBanner,
		setRemoveDeleteBannerModal, setUniqueId
	};
};

export { useAddBanner, useUpdateBannerDetails, useUploadBannerImage, useDeleteBanner };
