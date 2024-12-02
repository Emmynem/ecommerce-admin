import { useState } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { 
	completeUserDeposit, completeUserWithdrawal
} from "../api/transactions";

const useCompleteUserDeposit = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingCompleteUserDeposit, setLoadingCompleteUserDeposit] = useState(false);
	const [removeCompleteUserDepositModal, setRemoveCompleteUserDepositModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [userDepositUniqueId, setUserDepositUniqueId] = useState(null);

	const [errorCompleteUserDeposit, setErrorCompleteUserDeposit] = useState(null);
	const [successCompleteUserDeposit, setSuccessCompleteUserDeposit] = useState(null);

	const handleCompleteUserDeposit = () => {

		if (!loadingCompleteUserDeposit) {
			if (!userUniqueId) {
				setErrorCompleteUserDeposit(null);
				setSuccessCompleteUserDeposit(null);
				setErrorCompleteUserDeposit("User Unique ID is required");
				setTimeout(function () {
					setErrorCompleteUserDeposit(null);
				}, 2500)
			} else if (!userDepositUniqueId) {
				setErrorCompleteUserDeposit("Unique ID is required");
				setTimeout(function () {
					setErrorCompleteUserDeposit(null);
				}, 2500)
			} else {
				setLoadingCompleteUserDeposit(true);

				const completeUserDepositRes = completeUserDeposit(cookie, {
					user_unique_id: userUniqueId,
					unique_id: userDepositUniqueId
				})

				completeUserDepositRes.then(res => {
					setLoadingCompleteUserDeposit(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCompleteUserDeposit(error);
							setTimeout(function () {
								setErrorCompleteUserDeposit(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCompleteUserDeposit(error);
							setTimeout(function () {
								setErrorCompleteUserDeposit(null);
							}, 2000)
						}
					} else {
						setErrorCompleteUserDeposit(null);
						setSuccessCompleteUserDeposit(`Transaction completed successfully!`);

						setTimeout(function () {
							setSuccessCompleteUserDeposit(null);
							setRemoveCompleteUserDepositModal(true);
							setUserUniqueId(null);
							setUserDepositUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingCompleteUserDeposit(false);
				})

			}
		}
	};

	return {
		cookie, loadingCompleteUserDeposit, removeCompleteUserDepositModal, userDepositUniqueId, errorCompleteUserDeposit, successCompleteUserDeposit,
		handleCompleteUserDeposit, setRemoveCompleteUserDepositModal, setUserDepositUniqueId, setUserUniqueId
	};
};

const useCompleteUserWithdrawal = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingCompleteUserWithdrawal, setLoadingCompleteUserWithdrawal] = useState(false);
	const [removeCompleteUserWithdrawalModal, setRemoveCompleteUserWithdrawalModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [userWithdrawalUniqueId, setUserWithdrawalUniqueId] = useState(null);

	const [errorCompleteUserWithdrawal, setErrorCompleteUserWithdrawal] = useState(null);
	const [successCompleteUserWithdrawal, setSuccessCompleteUserWithdrawal] = useState(null);

	const handleCompleteUserWithdrawal = () => {

		if (!loadingCompleteUserWithdrawal) {
			if (!userUniqueId) {
				setErrorCompleteUserWithdrawal(null);
				setSuccessCompleteUserWithdrawal(null);
				setErrorCompleteUserWithdrawal("User Unique ID is required");
				setTimeout(function () {
					setErrorCompleteUserWithdrawal(null);
				}, 2500)
			} else if (!userWithdrawalUniqueId) {
				setErrorCompleteUserWithdrawal("Unique ID is required");
				setTimeout(function () {
					setErrorCompleteUserWithdrawal(null);
				}, 2500)
			} else {
				setLoadingCompleteUserWithdrawal(true);

				const completeUserWithdrawalRes = completeUserWithdrawal(cookie, {
					user_unique_id: userUniqueId,
					unique_id: userWithdrawalUniqueId
				})

				completeUserWithdrawalRes.then(res => {
					setLoadingCompleteUserWithdrawal(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorCompleteUserWithdrawal(error);
							setTimeout(function () {
								setErrorCompleteUserWithdrawal(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorCompleteUserWithdrawal(error);
							setTimeout(function () {
								setErrorCompleteUserWithdrawal(null);
							}, 2000)
						}
					} else {
						setErrorCompleteUserWithdrawal(null);
						setSuccessCompleteUserWithdrawal(`Transaction completed successfully!`);

						setTimeout(function () {
							setSuccessCompleteUserWithdrawal(null);
							setRemoveCompleteUserWithdrawalModal(true);
							setUserUniqueId(null);
							setUserWithdrawalUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingCompleteUserWithdrawal(false);
				})

			}
		}
	};

	return {
		cookie, loadingCompleteUserWithdrawal, removeCompleteUserWithdrawalModal, userWithdrawalUniqueId, errorCompleteUserWithdrawal, successCompleteUserWithdrawal,
		handleCompleteUserWithdrawal, setRemoveCompleteUserWithdrawalModal, setUserWithdrawalUniqueId, setUserUniqueId
	};
};

export { 
	useCompleteUserDeposit, useCompleteUserWithdrawal
};