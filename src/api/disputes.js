import axios from 'axios';
import { config } from '../config';

const getDisputes = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/disputes/all?page=${page}&size=${size}`,
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

const getDisputesViaUser = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/disputes/via/order?page=${page}&size=${size}&order_unique_id=${payload.order_unique_id}`,
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

const getDispute = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/dispute?unique_id=${payload.unique_id}`,
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

export { getDisputes, getDisputesViaUser, getDispute };