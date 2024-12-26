import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { deleteRating } from "../api/ratings";

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

export { useDeleteRating };
