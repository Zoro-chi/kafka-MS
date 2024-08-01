import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post("/order", async (req: Request, res: Response, _: NextFunction) => {
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
