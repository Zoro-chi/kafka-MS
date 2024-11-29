import axios from "axios";

import { logger } from "../logger";
import { APIError, AuthorizeError, NotFoundError } from "../error";
import { Product } from "../../dto/product.dto";
import { User } from "../../dto/User.Model";

const CATALOG_BASE_URL =
	process.env.CATALOG_BASE_URL || "http://localhost:9001";

const AUTH_SERVICE_BASE_URL =
	process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9000";

export const getProductDetails = async (productId: number) => {
	try {
		const response = await axios.get(
			`${CATALOG_BASE_URL}/products/${productId}`
		);

		return response.data as Product;
	} catch (error) {
		logger.error(error);
		throw new NotFoundError("Product not found");
	}
};

export const getStockDetails = async (ids: number[]) => {
	try {
		const response = await axios.post(`${CATALOG_BASE_URL}/products/stock`, {
			ids,
		});
		return response.data as Product[];
	} catch (error) {
		logger.error(error);
		throw new NotFoundError("Error getting stock details");
	}
};

export const validateUser = async (token: string) => {
	try {
		const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/auth/validate`, {
			headers: {
				Authorization: token,
			},
		});
		console.log("response: ", response.data);

		if (response.status !== 200) {
			throw new AuthorizeError("User not authorized");
		}
		return response.data as User;
	} catch (error) {
		logger.error(error);
		throw new AuthorizeError("User not authorized");
	}
};
