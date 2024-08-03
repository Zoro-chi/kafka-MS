import express, { NextFunction, Request, Response } from "express";
import { MessageBroker } from "../utils/broker";
import { OrderEvent } from "../types";

const router = express.Router();

router.post("/order", async (req: Request, res: Response, _: NextFunction) => {
	// Order create logic

	// 3rd step: Publish message
	await MessageBroker.publish({
		topic: "OrderEvents",
		headers: { token: req.headers.authorization },
		event: OrderEvent.CREATE_ORDER,
		message: {
			orderId: 1,
			items: [
				{
					productId: 1,
					quantity: 1,
				},
				{
					productId: 2,
					quantity: 2,
				},
			],
		},
	});
	return res.status(200).json({ message: "order route is working" });
});

router.get("/order", async (req: Request, res: Response, _: NextFunction) => {
	return res.status(200).json({ message: "order route is working" });
});

router.get(
	"/order/:id",
	async (req: Request, res: Response, _: NextFunction) => {
		return res.status(200).json({ message: "order route is working" });
	}
);

router.delete(
	"/order/:id",
	async (req: Request, res: Response, _: NextFunction) => {
		return res.status(200).json({ message: "order route is working" });
	}
);

export default router;
