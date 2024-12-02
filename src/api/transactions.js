import axios from 'axios';
import { config } from '../config';

const getTransactions = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/transactions?page=${page}&size=${size}`,
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getTransactionsViaUser = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/transactions/via/user?page=${page}&size=${size}&user_unique_id=${payload.user_unique_id}`,
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getTransactionsViaType = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/transactions/via/type?page=${page}&size=${size}&type=${payload.type}`,
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getTransactionsViaReference = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/transactions/via/reference?page=${page}&size=${size}&reference=${payload.reference}`,
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const filterTransactions = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/filter/transactions?page=${page}&size=${size}&start_date=${payload.start_date}&end_date=${payload.end_date}`,
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getTransactionsViaStatus = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/transactions/via/transaction/status?page=${page}&size=${size}&transaction_status=${payload.transaction_status}`,
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const completeUserDeposit = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/user/transaction/complete/deposit`,
			{
				...payload
			},
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const completeUserWithdrawal = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/user/transaction/complete/withdrawal`,
			{
				...payload
			},
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

export {
	getTransactions, getTransactionsViaType, getTransactionsViaStatus, getTransactionsViaUser, filterTransactions, 
	completeUserDeposit, completeUserWithdrawal, getTransactionsViaReference
};