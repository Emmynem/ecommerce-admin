import axios from 'axios';
import { config } from '../config';

const getCarts = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/carts?page=${page}&size=${size}`,
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

const getCartsViaUser = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/carts/via/user?page=${page}&size=${size}&user_unique_id=${payload.user_unique_id}`,
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

export { getCarts, getCartsViaUser };