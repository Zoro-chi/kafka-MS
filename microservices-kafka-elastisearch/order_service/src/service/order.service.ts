import { OrderLineItemType, OrderWithLineItems } from "../dto/orderRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { OrderRepositoryType } from "../repository/order.repository";
import { MessageType, OrderStatus } from "../types";

export const CreateOrder = async (
	userId: number,
	orderRepo: OrderRepositoryType,
	cartRepo: CartRepositoryType
) => {
	// find cart by customer id
	const cart = await cartRepo.findCart(userId);
	if (!cart) throw new Error("Cart not found");

	// calculate order amount
	let cartTotal = 0;
	let orderLineItems: OrderLineItemType[] = [];

	// create orderline items from cart items
	cart.lineItems.forEach((item) => {
		cartTotal = item.qty * Number(item.price);
		orderLineItems.push({
			productId: item.productId,
			itemName: item.itemName,
			qty: item.qty,
			price: Number(item.price),
		} as OrderLineItemType);
	});

	const orderNumber = Math.floor(Math.random() * 1000000);

	// create order with line items
	const orderInput: OrderWithLineItems = {
		orderNumber: orderNumber,
		txnId: null,
		customerId: userId,
		amount: cartTotal.toString(),
		orderItems: orderLineItems,
		status: OrderStatus.PENDING,
	};

	const order = await orderRepo.createOrder(orderInput);
	await cartRepo.clearCartData(userId);
	console.log("Order created", order);

	// fire event to catalog service to update stock
	// await cartRepo.publishOrderCreatedEvent(order, "ORDER_CREATED");

	// return success response

	return { message: "Order created successfully", orderId: orderNumber };
};

export const UpdateOrder = async (
	orderId: number,
	status: OrderStatus,
	orderRepo: OrderRepositoryType
) => {
	await orderRepo.updateOrder(orderId, status);

	// fire event to catalog service to update stock
	//TODO: Implement this
	if (status === OrderStatus.CANCELLED) {
		// await cartRepo.publishOrderCancelledEvent(order, "ORDER_CANCELLED");
	}

	return { message: "Order updated successfully" };
};

export const GetOrder = async (
	orderId: number,
	orderRepo: OrderRepositoryType
) => {
	const order = await orderRepo.findOrder(orderId);
	if (!order) throw new Error("Order not found");

	return order;
};

export const GetOrders = async (
	customerId: number,
	orderRepo: OrderRepositoryType
) => {
	const orders = await orderRepo.findOrdersByCustomerId(customerId);
	if (!Array.isArray(orders)) throw new Error("Orders not found");

	return orders;
};

export const DeleteOrder = async (
	orderId: number,
	orderRepo: OrderRepositoryType
) => {
	const result = await orderRepo.deleteOrder(orderId);
	return result;
};

export const HandleSubscription = async (message: MessageType) => {
	console.log("Message recieved by order service Kafka consumer", message);
};
