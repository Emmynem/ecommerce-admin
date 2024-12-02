import axios from 'axios';
import { config } from '../config';

const getUsers = async function (key, page, size) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/users`,
			{
				page,
				size
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

const getUser = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/user`,
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

const getUserViaEmail = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/user/via/email`,
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

const grantUserAccess = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/user/access/grant`,
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

const suspendUserAccess = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/user/access/suspend`,
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

const revokeUserAccess = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/user/access/revoke`,
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
	getUsers, getUser, getUserViaEmail, grantUserAccess, suspendUserAccess, revokeUserAccess
};