import axios from 'axios';
import { config } from '../config';

const getOrders = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/orders?page=${page}&size=${size}`,
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

const getOrdersViaUser = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/orders/via/user?page=${page}&size=${size}&user_unique_id=${payload.user_unique_id}`,
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

const getOrdersViaProduct = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/orders/via/product?page=${page}&size=${size}&product_unique_id=${payload.product_unique_id}`,
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

const getOrdersViaTracking = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/orders/via/tracking?page=${page}&size=${size}&tracking_number=${payload.tracking_number}`,
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

const getOrdersViaDeliveryStatus = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/orders/via/delivery/status?page=${page}&size=${size}&delivery_status=${payload.delivery_status}`,
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

const getOrdersViaPaid = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/orders/paid?page=${page}&size=${size}&paid=${payload.paid === "true" ? 1 : 0}`,
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

const getOrdersViaShipped = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/orders/shipped?page=${page}&size=${size}&shipped=${payload.shipped === "true" ? 1 : 0}`,
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

const getOrdersViaDisputed = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/orders/disputed?page=${page}&size=${size}&disputed=${payload.disputed === "true" ? 1 : 0}`,
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

const getOrder = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/order?unique_id=${payload.unique_id}`,
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

const updateOrderPaid = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/user/order/pay`,
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

const updateOrderInTransit = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/user/order/shipping`,
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

const updateOrderShipped = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/user/order/shipped`,
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

const updateOrderCompleted = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/user/order/completed`,
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

const updateOrderCancelled = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/user/order/cancel`,
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

const acceptOrderDispute = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/order/dispute/accept`,
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

const denyOrderDispute = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/order/dispute/deny`,
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
	getOrders, getOrdersViaUser, getOrdersViaProduct, getOrdersViaTracking, getOrdersViaDeliveryStatus, getOrdersViaPaid, 
	getOrdersViaShipped, getOrdersViaDisputed, getOrder, updateOrderPaid, acceptOrderDispute, denyOrderDispute, updateOrderInTransit, 
	updateOrderCompleted, updateOrderShipped, updateOrderCancelled
};