import axios from 'axios';
import { config } from '../config';

const getBanners = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/banner/all?page=${page}&size=${size}`,
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

const getBanner = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/banner?unique_id=${payload.unique_id}`,
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

const addBanner = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/banner/add`,
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

const editBannerDetails = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/banner/edit/details`,
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

const editBannerImage = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/banner/edit/image`,
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

const deleteBanner = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/banner`,
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

export { getBanners, getBanner, addBanner, editBannerDetails, editBannerImage, deleteBanner };