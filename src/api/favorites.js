import axios from 'axios';
import { config } from '../config';

const getFavorites = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/favorites/all?page=${page}&size=${size}`,
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

const getFavoritesViaUser = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/favorites/via/user?page=${page}&size=${size}&user_unique_id=${payload.user_unique_id}`,
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

export { getFavorites, getFavoritesViaUser };