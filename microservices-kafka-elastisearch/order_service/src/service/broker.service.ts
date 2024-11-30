import { Consumer, Producer } from "kafkajs";

import { MessageBroker } from "../utils/broker";
import { HandleSubscription } from "./order.service";
import { OrderEvent } from "../types";

// Initialize the broker
export const InitializeBroker = async () => {
	const producer = await MessageBroker.connectProducer<Producer>();
	producer.on("producer.connect", () =>
		console.log("Producer connected successfully")
	);

	const consumer = await MessageBroker.connectConsumer<Consumer>();
	consumer.on("consumer.connect", () =>
		console.log("Consumer connected successfully")
	);

	// Keep listening to consumer events
	// Perform actions based on events
	await MessageBroker.subscribe(HandleSubscription, "OrderEvents");
};

// Publish dedicated events based on usecases
export const SendCreateOrderMessage = async (data: any) => {
	await MessageBroker.publish({
		event: OrderEvent.CREATE_ORDER,
		topic: "CatalogEvents",
		headers: {},
		message: data,
	});
};

export const SendOrderCancelledMessage = async (data: any) => {
	await MessageBroker.publish({
		event: OrderEvent.CANCEL_ORDER,
		topic: "CatalogEvents",
		headers: {},
		message: data,
	});
};
