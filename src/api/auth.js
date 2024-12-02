import axios from 'axios';
import { config } from '../config';

const login = async function (key) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/auth/admin/signin`,
			{

			},
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

export { login };