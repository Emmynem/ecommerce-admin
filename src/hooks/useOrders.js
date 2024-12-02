import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { 
	acceptOrderDispute, denyOrderDispute, updateOrderPaid, updateOrderCancelled, updateOrderCompleted, updateOrderInTransit, updateOrderShipped 
} from "../api/orders";

const useUpdateOrderPaid = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateOrderPaid, setLoadingUpdateOrderPaid] = useState(false);
	const [removeUpdateOrderPaidModal, setRemoveUpdateOrderPaidModal] = useState(null);
	const [trackingNumber, setTrackingNumber] = useState(null);

	const [errorUpdateOrderPaid, setErrorUpdateOrderPaid] = useState(null);
	const [successUpdateOrderPaid, setSuccessUpdateOrderPaid] = useState(null);

	const handleUpdateOrderPaid = (e) => {
		e.preventDefault();

		if (!loadingUpdateOrderPaid) {
			if (!trackingNumber) {
				setErrorUpdateOrderPaid(null);
				setSuccessUpdateOrderPaid(null);
				setErrorUpdateOrderPaid("Tracking Number is required");
				setTimeout(function () {
					setErrorUpdateOrderPaid(null);
				}, 2500)
			} else {
				setLoadingUpdateOrderPaid(true);

				const updateOrderPaidRes = updateOrderPaid(cookie, {
					tracking_number: trackingNumber,
				})

				updateOrderPaidRes.then(res => {
					setLoadingUpdateOrderPaid(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateOrderPaid(error);
							setTimeout(function () {
								setErrorUpdateOrderPaid(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateOrderPaid(error);
							setTimeout(function () {
								setErrorUpdateOrderPaid(null);
							}, 2000)
						}
					} else {
						setErrorUpdateOrderPaid(null);
						setSuccessUpdateOrderPaid(`Order paid successfully!`);

						setTimeout(function () {
							setSuccessUpdateOrderPaid(null);
							setRemoveUpdateOrderPaidModal(true);
							setTrackingNumber(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateOrderPaid(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateOrderPaid, removeUpdateOrderPaidModal, errorUpdateOrderPaid, successUpdateOrderPaid, handleUpdateOrderPaid,
		setRemoveUpdateOrderPaidModal, setTrackingNumber, 
	};
};

const useUpdateOrderInTransit = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateOrderInTransit, setLoadingUpdateOrderInTransit] = useState(false);
	const [removeUpdateOrderInTransitModal, setRemoveUpdateOrderInTransitModal] = useState(null);
	const [trackingNumber, setTrackingNumber] = useState(null);

	const [errorUpdateOrderInTransit, setErrorUpdateOrderInTransit] = useState(null);
	const [successUpdateOrderInTransit, setSuccessUpdateOrderInTransit] = useState(null);

	const handleUpdateOrderInTransit = (e) => {
		e.preventDefault();

		if (!loadingUpdateOrderInTransit) {
			if (!trackingNumber) {
				setErrorUpdateOrderInTransit(null);
				setSuccessUpdateOrderInTransit(null);
				setErrorUpdateOrderInTransit("Tracking Number is required");
				setTimeout(function () {
					setErrorUpdateOrderInTransit(null);
				}, 2500)
			} else {
				setLoadingUpdateOrderInTransit(true);

				const updateOrderInTransitRes = updateOrderInTransit(cookie, {
					tracking_number: trackingNumber,
				})

				updateOrderInTransitRes.then(res => {
					setLoadingUpdateOrderInTransit(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateOrderInTransit(error);
							setTimeout(function () {
								setErrorUpdateOrderInTransit(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateOrderInTransit(error);
							setTimeout(function () {
								setErrorUpdateOrderInTransit(null);
							}, 2000)
						}
					} else {
						setErrorUpdateOrderInTransit(null);
						setSuccessUpdateOrderInTransit(`Order in transit successfully!`);

						setTimeout(function () {
							setSuccessUpdateOrderInTransit(null);
							setRemoveUpdateOrderInTransitModal(true);
							setTrackingNumber(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateOrderInTransit(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateOrderInTransit, removeUpdateOrderInTransitModal, errorUpdateOrderInTransit, successUpdateOrderInTransit, handleUpdateOrderInTransit,
		setRemoveUpdateOrderInTransitModal, setTrackingNumber, 
	};
};

const useUpdateOrderShipped = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateOrderShipped, setLoadingUpdateOrderShipped] = useState(false);
	const [removeUpdateOrderShippedModal, setRemoveUpdateOrderShippedModal] = useState(null);
	const [trackingNumber, setTrackingNumber] = useState(null);

	const [errorUpdateOrderShipped, setErrorUpdateOrderShipped] = useState(null);
	const [successUpdateOrderShipped, setSuccessUpdateOrderShipped] = useState(null);

	const handleUpdateOrderShipped = (e) => {
		e.preventDefault();

		if (!loadingUpdateOrderShipped) {
			if (!trackingNumber) {
				setErrorUpdateOrderShipped(null);
				setSuccessUpdateOrderShipped(null);
				setErrorUpdateOrderShipped("Tracking Number is required");
				setTimeout(function () {
					setErrorUpdateOrderShipped(null);
				}, 2500)
			} else {
				setLoadingUpdateOrderShipped(true);

				const updateOrderShippedRes = updateOrderShipped(cookie, {
					tracking_number: trackingNumber,
				})

				updateOrderShippedRes.then(res => {
					setLoadingUpdateOrderShipped(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateOrderShipped(error);
							setTimeout(function () {
								setErrorUpdateOrderShipped(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateOrderShipped(error);
							setTimeout(function () {
								setErrorUpdateOrderShipped(null);
							}, 2000)
						}
					} else {
						setErrorUpdateOrderShipped(null);
						setSuccessUpdateOrderShipped(`Order shipped successfully!`);

						setTimeout(function () {
							setSuccessUpdateOrderShipped(null);
							setRemoveUpdateOrderShippedModal(true);
							setTrackingNumber(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateOrderShipped(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateOrderShipped, removeUpdateOrderShippedModal, errorUpdateOrderShipped, successUpdateOrderShipped, handleUpdateOrderShipped,
		setRemoveUpdateOrderShippedModal, setTrackingNumber,
	};
};

const useUpdateOrderCompleted = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateOrderCompleted, setLoadingUpdateOrderCompleted] = useState(false);
	const [removeUpdateOrderCompletedModal, setRemoveUpdateOrderCompletedModal] = useState(null);
	const [trackingNumber, setTrackingNumber] = useState(null);

	const [errorUpdateOrderCompleted, setErrorUpdateOrderCompleted] = useState(null);
	const [successUpdateOrderCompleted, setSuccessUpdateOrderCompleted] = useState(null);

	const handleUpdateOrderCompleted = (e) => {
		e.preventDefault();

		if (!loadingUpdateOrderCompleted) {
			if (!trackingNumber) {
				setErrorUpdateOrderCompleted(null);
				setSuccessUpdateOrderCompleted(null);
				setErrorUpdateOrderCompleted("Tracking Number is required");
				setTimeout(function () {
					setErrorUpdateOrderCompleted(null);
				}, 2500)
			} else {
				setLoadingUpdateOrderCompleted(true);

				const updateOrderCompletedRes = updateOrderCompleted(cookie, {
					tracking_number: trackingNumber,
				})

				updateOrderCompletedRes.then(res => {
					setLoadingUpdateOrderCompleted(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateOrderCompleted(error);
							setTimeout(function () {
								setErrorUpdateOrderCompleted(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateOrderCompleted(error);
							setTimeout(function () {
								setErrorUpdateOrderCompleted(null);
							}, 2000)
						}
					} else {
						setErrorUpdateOrderCompleted(null);
						setSuccessUpdateOrderCompleted(`Order completed successfully!`);

						setTimeout(function () {
							setSuccessUpdateOrderCompleted(null);
							setRemoveUpdateOrderCompletedModal(true);
							setTrackingNumber(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateOrderCompleted(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateOrderCompleted, removeUpdateOrderCompletedModal, errorUpdateOrderCompleted, successUpdateOrderCompleted, handleUpdateOrderCompleted,
		setRemoveUpdateOrderCompletedModal, setTrackingNumber,
	};
};

const useUpdateOrderCancelled = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateOrderCancelled, setLoadingUpdateOrderCancelled] = useState(false);
	const [removeUpdateOrderCancelledModal, setRemoveUpdateOrderCancelledModal] = useState(null);
	const [trackingNumber, setTrackingNumber] = useState(null);

	const [errorUpdateOrderCancelled, setErrorUpdateOrderCancelled] = useState(null);
	const [successUpdateOrderCancelled, setSuccessUpdateOrderCancelled] = useState(null);

	const handleUpdateOrderCancelled = (e) => {
		e.preventDefault();

		if (!loadingUpdateOrderCancelled) {
			if (!trackingNumber) {
				setErrorUpdateOrderCancelled(null);
				setSuccessUpdateOrderCancelled(null);
				setErrorUpdateOrderCancelled("Tracking Number is required");
				setTimeout(function () {
					setErrorUpdateOrderCancelled(null);
				}, 2500)
			} else {
				setLoadingUpdateOrderCancelled(true);

				const updateOrderCancelledRes = updateOrderCancelled(cookie, {
					tracking_number: trackingNumber,
				})

				updateOrderCancelledRes.then(res => {
					setLoadingUpdateOrderCancelled(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateOrderCancelled(error);
							setTimeout(function () {
								setErrorUpdateOrderCancelled(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateOrderCancelled(error);
							setTimeout(function () {
								setErrorUpdateOrderCancelled(null);
							}, 2000)
						}
					} else {
						setErrorUpdateOrderCancelled(null);
						setSuccessUpdateOrderCancelled(`Order cancelled successfully!`);

						setTimeout(function () {
							setSuccessUpdateOrderCancelled(null);
							setRemoveUpdateOrderCancelledModal(true);
							setTrackingNumber(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateOrderCancelled(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateOrderCancelled, removeUpdateOrderCancelledModal, errorUpdateOrderCancelled, successUpdateOrderCancelled, handleUpdateOrderCancelled,
		setRemoveUpdateOrderCancelledModal, setTrackingNumber,
	};
};

const useAcceptOrderDispute = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingAcceptOrderDispute, setLoadingAcceptOrderDispute] = useState(false);
	const [removeAcceptOrderDisputeModal, setRemoveAcceptOrderDisputeModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);

	const [errorAcceptOrderDispute, setErrorAcceptOrderDispute] = useState(null);
	const [successAcceptOrderDispute, setSuccessAcceptOrderDispute] = useState(null);

	const handleAcceptOrderDispute = (e) => {
		e.preventDefault();

		if (!loadingAcceptOrderDispute) {
			if (!uniqueId) {
				setErrorAcceptOrderDispute(null);
				setSuccessAcceptOrderDispute(null);
				setErrorAcceptOrderDispute("Unique ID is required");
				setTimeout(function () {
					setErrorAcceptOrderDispute(null);
				}, 2500)
			} else if (!userUniqueId) {
				setErrorAcceptOrderDispute("User Unique Id is required");
				setTimeout(function () {
					setErrorAcceptOrderDispute(null);
				}, 2500)
			} else {
				setLoadingAcceptOrderDispute(true);

				const acceptOrderDisputeRes = acceptOrderDispute(cookie, {
					unique_id: uniqueId,
					user_unique_id: userUniqueId
				})

				acceptOrderDisputeRes.then(res => {
					setLoadingAcceptOrderDispute(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAcceptOrderDispute(error);
							setTimeout(function () {
								setErrorAcceptOrderDispute(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAcceptOrderDispute(error);
							setTimeout(function () {
								setErrorAcceptOrderDispute(null);
							}, 2000)
						}
					} else {
						setErrorAcceptOrderDispute(null);
						setSuccessAcceptOrderDispute(`Order dispute accepted successfully!`);

						setTimeout(function () {
							setSuccessAcceptOrderDispute(null);
							setRemoveAcceptOrderDisputeModal(true);
							setUniqueId(null);
							setUserUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingAcceptOrderDispute(false);
				})

			}
		}
	};

	return {
		cookie, loadingAcceptOrderDispute, removeAcceptOrderDisputeModal, errorAcceptOrderDispute, successAcceptOrderDispute, handleAcceptOrderDispute,
		setRemoveAcceptOrderDisputeModal, setUniqueId, setUserUniqueId,
	};
};

const useDenyOrderDispute = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDenyOrderDispute, setLoadingDenyOrderDispute] = useState(false);
	const [removeDenyOrderDisputeModal, setRemoveDenyOrderDisputeModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const [errorDenyOrderDispute, setErrorDenyOrderDispute] = useState(null);
	const [successDenyOrderDispute, setSuccessDenyOrderDispute] = useState(null);

	const handleFeedback = (e) => { e.preventDefault(); setFeedback(e.target.value); };

	const handleDenyOrderDispute = (e) => {
		e.preventDefault();

		if (!loadingDenyOrderDispute) {
			if (!uniqueId) {
				setErrorDenyOrderDispute(null);
				setSuccessDenyOrderDispute(null);
				setErrorDenyOrderDispute("Unique ID is required");
				setTimeout(function () {
					setErrorDenyOrderDispute(null);
				}, 2500)
			} else if (!userUniqueId) {
				setErrorDenyOrderDispute("User Unique Id is required");
				setTimeout(function () {
					setErrorDenyOrderDispute(null);
				}, 2500)
			} else if (!feedback) {
				setErrorDenyOrderDispute("Feedback is required");
				setTimeout(function () {
					setErrorDenyOrderDispute(null);
				}, 2500)
			} else if (feedback.length < 3) {
				setErrorDenyOrderDispute("Feedback minimum characters - 3");
				setTimeout(function () {
					setErrorDenyOrderDispute(null);
				}, 2500)
			} else if (feedback.length > 1000) {
				setErrorDenyOrderDispute("Feedback maximum characters - 1000");
				setTimeout(function () {
					setErrorDenyOrderDispute(null);
				}, 2500)
			} else {
				setLoadingDenyOrderDispute(true);

				const denyOrderDisputeRes = denyOrderDispute(cookie, {
					unique_id: uniqueId,
					user_unique_id: userUniqueId,
					feedback: feedback
				})

				denyOrderDisputeRes.then(res => {
					setLoadingDenyOrderDispute(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDenyOrderDispute(error);
							setTimeout(function () {
								setErrorDenyOrderDispute(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDenyOrderDispute(error);
							setTimeout(function () {
								setErrorDenyOrderDispute(null);
							}, 2000)
						}
					} else {
						setErrorDenyOrderDispute(null);
						setSuccessDenyOrderDispute(`Order dispute denied successfully!`);

						setTimeout(function () {
							setSuccessDenyOrderDispute(null);
							setRemoveDenyOrderDisputeModal(true);
							setUniqueId(null);
							setUserUniqueId(null);
							setFeedback(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDenyOrderDispute(false);
				})

			}
		}
	};

	return {
		cookie, loadingDenyOrderDispute, removeDenyOrderDisputeModal, errorDenyOrderDispute, successDenyOrderDispute, handleDenyOrderDispute,
		setRemoveDenyOrderDisputeModal, setUniqueId, setUserUniqueId, setFeedback, feedback, handleFeedback
	};
};

export { 
	useUpdateOrderPaid, useAcceptOrderDispute, useDenyOrderDispute, useUpdateOrderInTransit, useUpdateOrderShipped, 
	useUpdateOrderCompleted, useUpdateOrderCancelled
};
