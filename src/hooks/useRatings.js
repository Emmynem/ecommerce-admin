import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { addRating, deleteRating } from "../api/ratings";

const useAddRating = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingAddRating, setLoadingAddRating] = useState(false);
	const [removeAddRatingModal, setRemoveAddRatingModal] = useState(null);
	const [productUniqueId, setProductUniqueId] = useState(null);
	const [fullname, setFullname] = useState(null);
	const [rating, setRating] = useState(null);
	const [description, setDescription] = useState(null);

	const [errorAddRating, setErrorAddRating] = useState(null);
	const [successAddRating, setSuccessAddRating] = useState(null);

	const handleProductUniqueId = (e) => { e.preventDefault(); setProductUniqueId(e.target.value); };
	const handleFullname = (e) => { e.preventDefault(); setFullname(e.target.value); };
	const handleRating = (e) => { e.preventDefault(); setRating(e.target.value); };
	// const handleDescription = (contents) => { setDescription(contents); };
	const handleDescription = (e) => { e.preventDefault(); setDescription(e.target.value); };

	const handleAddRating = (e) => {
		e.preventDefault();

		if (!loadingAddRating) {
			if (!productUniqueId) {
				setErrorAddRating(null);
				setSuccessAddRating(null);
				setErrorAddRating("Product Unique Id is required");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (!fullname) {
				setErrorAddRating("Fullname is required");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (fullname.length < 3) {
				setErrorAddRating("Fullname minimum characters - 3");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (fullname.length > 150) {
				setErrorAddRating("Fullname maximum characters - 150");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (!rating) {
				setErrorAddRating("Rating is required");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (parseInt(rating) < 1) {
				setErrorAddRating("Rating minimum is 1");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (parseInt(rating) > 5) {
				setErrorAddRating("Rating maximum is 5");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (!description) {
				setErrorAddRating("Description is required");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (description.length < 3) {
				setErrorAddRating("Description minimum characters - 3");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else if (description.length > 3000) {
				setErrorAddRating("Description maximum characters - 3000");
				setTimeout(function () {
					setErrorAddRating(null);
				}, 2500)
			} else {
				setLoadingAddRating(true);

				const addRatingRes = addRating(cookie, {
					product_unique_id: productUniqueId,
					ratings: [
						{
							fullname: fullname,
							rating: rating,
							description: description
						}
					]
				})

				addRatingRes.then(res => {
					setLoadingAddRating(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddRating(error);
							setTimeout(function () {
								setErrorAddRating(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddRating(error);
							setTimeout(function () {
								setErrorAddRating(null);
							}, 2000)
						}
					} else {
						setErrorAddRating(null);
						setSuccessAddRating(`Rating added successfully!`);

						setTimeout(function () {
							setSuccessAddRating(null);
							setRemoveAddRatingModal(true);
							setProductUniqueId(null);
							setFullname(null);
							setDescription(null);
							setRating(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingAddRating(false);
				})

			}
		}
	};

	return {
		cookie, productUniqueId, fullname, description, rating, productUniqueId, loadingAddRating, setRemoveAddRatingModal, errorAddRating, 
		successAddRating, handleAddRating, removeAddRatingModal, handleProductUniqueId, handleFullname, handleDescription, handleRating, 
		setFullname, setDescription, setRating, setProductUniqueId
	};
};

const useDeleteRating = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteRating, setLoadingDeleteRating] = useState(false);
	const [removeDeleteRatingModal, setRemoveDeleteRatingModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteRating, setErrorDeleteRating] = useState(null);
	const [successDeleteRating, setSuccessDeleteRating] = useState(null);

	const handleDeleteRating = () => {

		if (!loadingDeleteRating) {
			if (!uniqueId) {
				setErrorDeleteRating(null);
				setSuccessDeleteRating(null);
				setErrorDeleteRating("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteRating(null);
				}, 2500)
			} else {
				setLoadingDeleteRating(true);

				const deleteRatingRes = deleteRating(cookie, {
					unique_id: uniqueId
				})

				deleteRatingRes.then(res => {
					setLoadingDeleteRating(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteRating(error);
							setTimeout(function () {
								setErrorDeleteRating(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteRating(error);
							setTimeout(function () {
								setErrorDeleteRating(null);
							}, 2000)
						}
					} else {
						setErrorDeleteRating(null);
						setSuccessDeleteRating(`Rating deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteRating(null);
							setRemoveDeleteRatingModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteRating(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteRating, removeDeleteRatingModal, errorDeleteRating, successDeleteRating, handleDeleteRating,
		setRemoveDeleteRatingModal, setUniqueId
	};
};

export { useDeleteRating, useAddRating };
