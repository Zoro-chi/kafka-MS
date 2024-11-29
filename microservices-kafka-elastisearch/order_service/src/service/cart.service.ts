import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { AuthorizeError, logger, NotFoundError } from "../utils";
import { getProductDetails, getStockDetails } from "../utils/broker";

export const CreateCart = async (
	input: CartRequestInput & { customerId: number },
	repo: CartRepositoryType
) => {
	// Get product details from catalog service
	const product = await getProductDetails(input.productId);
	logger.info(product);

	if (product.stock < input.qty) throw new NotFoundError("Out of Stock");

	// Find if the product is already in the cart
	const lineItem = await repo.findCartByProductId(
		input.customerId,
		input.productId
	);
	if (lineItem) {
		return await repo.updateCart(lineItem.id, lineItem.qty + input.qty);
	}

	return await repo.createCart(input.customerId, {
		productId: product.id,
		price: product.price.toString(),
		qty: input.qty,
		itemName: product.name,
		variant: product.variant,
	} as CartLineItem);
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
	// Get customer cart
	const cart = await repo.findCart(id);
	if (!cart) throw new NotFoundError("Cart not found");

	// List all the items in the cart
	const lineItems = cart.lineItems;
	if (!lineItems.length) throw new NotFoundError("Cart items not found");

	// Verify with inventory if the product is still available
	const stockDetails = await getStockDetails(
		lineItems.map((item) => item.productId)
	);
	if (Array.isArray(stockDetails) && stockDetails.length) {
		// Update the cart with latest stock availability
		lineItems.forEach((item) => {
			const stockItem = stockDetails.find(
				(stock) => stock.id === item.productId
			);
			if (stockItem) {
				item.availability = stockItem.stock;
			}
		});

		// Update the cart with latest stock availability
		cart.lineItems = lineItems;
	}

	// Return the updated cart with latest stock availability
	return cart;
};

const AuthorizedCart = async (
	lineItemId: number,
	customerId: number,
	repo: CartRepositoryType
) => {
	const cart = await repo.findCart(customerId);
	if (!cart) throw new NotFoundError("Cart not found");

	const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
	if (!lineItem)
		throw new AuthorizeError("You are not authorized to edit this cart");

	return lineItem;
};

export const UpdateCart = async (
	input: CartEditRequestInput & { customerId: number },
	repo: CartRepositoryType
) => {
	await AuthorizedCart(input.id, input.customerId, repo);
	const data = await repo.updateCart(input.id, input.qty);
	return data;
};

export const DeleteCart = async (
	input: { id: number; customerId: number },
	repo: CartRepositoryType
) => {
	await AuthorizedCart(input.id, input.customerId, repo);
	const data = await repo.deleteCart(input.id);
	return data;
};
