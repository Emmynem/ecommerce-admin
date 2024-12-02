import axios from 'axios';
import { config } from '../config';

const getAnalytics = async function (key) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/analytics`,
			{
				headers: {
					'ecommerce-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error };
	}
};

export { getAnalytics };