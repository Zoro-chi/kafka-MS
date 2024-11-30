import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { InitializeBroker } from "./service/broker.service";

export const ExpressApp = async () => {
	const app = express();

	// Middleware
	app.use(cors());
	app.use(express.json());
	app.use(httpLogger);

	// Initialize the broker
	await InitializeBroker();

	// ROUTES
	app.use(orderRoutes);
	app.use(cartRoutes);

	app.use("/", (req: Request, res: Response, _: NextFunction) => {
		return res.status(200).json({ message: "Health check is ok" });
	});

	app.use(HandleErrorWithLogger);

	return app;
};
