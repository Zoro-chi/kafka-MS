import Ajv, { Schema } from "ajv";

const ajv = new Ajv();

export const validateRequest = <T>(requestBody: unknown, schema: Schema) => {
	const validatedData = ajv.compile<T>(schema);

	if (validatedData(requestBody)) return false;

	const errors = validatedData.errors?.map((err) => err.message);

	return errors && errors[0];
};
