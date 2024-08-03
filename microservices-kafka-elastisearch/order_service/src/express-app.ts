import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { Consumer, Producer } from "kafkajs";

import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { MessageBroker } from "./utils/broker";

export const ExpressApp = async () => {
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(httpLogger);

	// 1st step: Connect producer and consumer
	const producer = await MessageBroker.connectProducer<Producer>();
	producer.on("producer.connect", () => console.log("Producer connected"));

	const consumer = await MessageBroker.connectConsumer<Consumer>();
	consumer.on("consumer.connect", () => console.log("Consumer connected"));

	// 2nd step: subscribe to topic or publish message
	await MessageBroker.subscribe((message) => {
		console.log("consumer recieved message");
		console.log("message recieved", message);
	}, "OrderEvents");

	// ROUTES
	app.use(orderRoutes);
	app.use(cartRoutes);

	app.use("/", (req: Request, res: Response, _: NextFunction) => {
		return res.status(200).json({ message: "Health check is ok" });
	});

	app.use(HandleErrorWithLogger);

	return app;
};
