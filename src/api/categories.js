import axios from 'axios';
import { config } from '../config';

const getCategories = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/category/all?page=${page}&size=${size}`,
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

const getCategory = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/category?unique_id=${payload.unique_id}`,
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

const addCategory = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/category/add`,
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

const editCategoryName = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/category/edit/name`,
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

const editCategoryImage = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/category/edit/image`,
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

const deleteCategory = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/category`,
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

export { getCategories, getCategory, addCategory, editCategoryName, editCategoryImage, deleteCategory };