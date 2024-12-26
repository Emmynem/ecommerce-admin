import axios from 'axios';
import { config } from '../config';

const getRatings = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/ratings/all?page=${page}&size=${size}`,
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

const getRatingsViaOrder = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/ratings/via/order?page=${page}&size=${size}&order_unique_id=${payload.order_unique_id}`,
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

const getRatingsViaProduct = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/ratings/via/product?page=${page}&size=${size}&product_unique_id=${payload.product_unique_id}`,
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

const getRating = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/rating?unique_id=${payload.unique_id}`,
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

const deleteRating = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/rating`,
			{
				data: {
					key,
					...payload
				}
			},
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

export { getRatings, getRatingsViaOrder, getRatingsViaProduct, getRating, deleteRating };