import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { validateRequest } from "../utils/validator";
import {
	CartEditRequestInput,
	CartRequestInput,
	CartRequestSchema,
} from "../dto/cartRequest.dto";
import { RequestAuthourizer } from "./middleware";

const router = express.Router();

const repo = repository.CartRepository;

router.post(
	"/cart",
	RequestAuthourizer,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user;

			if (!user) {
				next(new Error("User not found"));
				return;
			}

			const err = validateRequest<CartRequestInput>(
				req.body,
				CartRequestSchema
			);
			if (err) return res.status(400).json({ err });

			const input: CartRequestInput = req.body;

			const response = await service.CreateCart(
				{ ...input, customerId: user.id },
				repo
			);
			return res.status(200).json({ response });
		} catch (error) {
			// return res.status(404).json({ error });
			next(error);
		}
	}
);

router.get(
	"/cart",
	RequestAuthourizer,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user;

			if (!user) {
				next(new Error("User not found"));
				return;
			}
			const response = await service.GetCart(user.id, repo);
			return res.status(200).json({ response });
		} catch (error) {
			next(error);
		}
	}
);

router.patch(
	"/cart/:lineItemId",
	RequestAuthourizer,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user;

			if (!user) {
				next(new Error("User not found"));
				return;
			}

			const lineItemId = req.params.lineItemId;
			const response = await service.UpdateCart(
				{ id: +lineItemId, qty: req.body.qty, customerId: user.id },
				repo
			);
			return res.status(200).json({ message: response });
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	"/cart/:lineItemId",
	RequestAuthourizer,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user;

			if (!user) {
				next(new Error("User not found"));
				return;
			}

			const lineItemId = req.params.lineItemId;
			const response = await service.DeleteCart(
				{ customerId: user.id, id: +lineItemId },
				repo
			);
			return res.status(200).json({ message: response });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
