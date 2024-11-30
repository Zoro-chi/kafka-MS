import express, { NextFunction, Request, Response } from "express";

import { MessageBroker } from "../utils/broker";
import { OrderEvent, OrderStatus } from "../types";
import { RequestAuthourizer } from "./middleware";
import * as service from "../service/order.service";
import { OrderRepository } from "../repository/order.repository";
import { CartRepository } from "../repository/cart.repository";

const router = express.Router();

const orderRepo = OrderRepository;
const cartRepo = CartRepository;

router.post(
	"/orders",
	RequestAuthourizer,
	async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			next(new Error("User not found"));
			return;
		}
		const response = await service.CreateOrder(user.id, orderRepo, cartRepo);
		return res.status(200).json(response);
	}
);

router.get(
	"/orders",
	async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			next(new Error("User not found"));
			return;
		}
		const response = await service.GetOrders(user.id, orderRepo);
		return res.status(200).json(response);
	}
);

router.get(
	"/orders/:id",
	async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			next(new Error("User not found"));
			return;
		}
		const response = await service.GetOrder(user.id, orderRepo);
		return res.status(200).json(response);
	}
);

// This is only going to call from microservice not user
router.patch(
	"/orders/:id",
	async (req: Request, res: Response, next: NextFunction) => {
		// Security check for microservice calls only
		const orderId = parseInt(req.params.id);
		const status = req.body.status as OrderStatus;
		const response = await service.UpdateOrder(orderId, status, orderRepo);
		return res.status(200).json(response);
	}
);

router.delete(
	"/orders/:id",
	async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			next(new Error("User not found"));
			return;
		}
		const orderId = parseInt(req.params.id);
		const response = await service.DeleteOrder(orderId, orderRepo);
		return res.status(200).json(response);
	}
);

export default router;
