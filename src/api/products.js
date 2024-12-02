import axios from 'axios';
import { config } from '../config';

const getProducts = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/products/all?page=${page}&size=${size}`,
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

const searchProducts = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/search/products?page=${page}&size=${size}&search=${payload.search}`,
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

const getProductsViaCategory = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/products/via/category?page=${page}&size=${size}&category_unique_id=${payload.category_unique_id}`,
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

const getProduct = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/product?unique_id=${payload.unique_id}`,
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

const addProduct = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/add/product`,
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

const addProductImages = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/add/product/images`,
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

const editProductName = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/product/name`,
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

const editProductCategory = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/product/category`,
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

const editProductDescription = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/product/description`,
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

const editProductPrices = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/product/prices`,
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

const editProductStock = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/product/stock`,
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

const editProductSpecification = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/product/specification`,
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

const deleteProduct = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/product`,
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

const deleteProductImage = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/product/image`,
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

export {
	getProducts, getProductsViaCategory, getProduct, searchProducts, addProduct, addProductImages, 
	editProductName, editProductCategory, editProductDescription, editProductPrices, editProductStock, 
	editProductSpecification, deleteProduct, deleteProductImage
};