import { Request, Response, NextFunction } from "express";
import { AuthorizeError, NotFoundError, ValidationError } from "./errors";
import { logger } from "../logger";
import { STATUS_CODES } from "./status-codes";

export const HandleErrorWithLogger = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let reportError = true;
	let status = STATUS_CODES.INTERNAL_ERROR;
	let data = { message: error.message };

	// Skip common / known errors
	[NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
		if (error instanceof typeOfError) {
			reportError = false;
			status = (error as any).status; // Ensure you are getting status from error instance
			data = { message: error.message };
		}
	});

	if (reportError) {
		// Error reporting tools implementation e.g., Cloudwatch, Sentry etc.
		logger.error(error);
	} else {
		logger.warn(error); // Ignore common errors caused by user
	}

	return res.status(status).json(data);
};

export const HandleUnCaughtException = async (error: Error) => {
	// Error report / monitoring tools
	logger.error(error);
	// Recover
	process.exit(1);
};
