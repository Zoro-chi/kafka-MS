import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { validateRequest } from "../utils/validator";
import {
	CartEditRequestInput,
	CartRequestInput,
	CartRequestSchema,
} from "../dto/cartRequest.dto";

const router = express.Router();

const repo = repository.CartRepository;

const authMiddlewear = (req: Request, res: Response, next: NextFunction) => {
	//Todo: Implement Auth Middlewear using JWT

	const isValidUser = true;
	if (!isValidUser) {
		return res.status(403).json({ message: "Unauthorized" });
	}
	next();
};

router.post(
	"/cart",
	authMiddlewear,
	async (req: Request, res: Response, _: NextFunction) => {
		try {
			const err = validateRequest<CartRequestInput>(
				req.body,
				CartRequestSchema
			);
			if (err) return res.status(400).json({ err });

			const response = await service.CreateCart(
				req.body as CartRequestInput,
				repo
			);
			return res.status(200).json({ response });
		} catch (error) {
			return res.status(404).json({ error });
		}
	}
);

router.get("/cart", async (req: Request, res: Response, _: NextFunction) => {
	// Todo: customer id comes from parsed JWT token
	const response = await service.GetCart(req.body.customerId, repo);
	return res.status(200).json({ response });
});

router.patch(
	"/cart/:lineItemId",
	async (req: Request, res: Response, _: NextFunction) => {
		const lineItemId = req.params.lineItemId;
		const response = await service.UpdateCart(
			{ id: +lineItemId, qty: req.body.qty },
			repo
		);
		return res.status(200).json({ message: response });
	}
);

router.delete(
	"/cart/:lineItemId",
	async (req: Request, res: Response, _: NextFunction) => {
		const lineItemId = req.params.lineItemId;
		const response = await service.DeleteCart(+lineItemId, repo);
		return res.status(200).json({ message: response });
	}
);

export default router;
