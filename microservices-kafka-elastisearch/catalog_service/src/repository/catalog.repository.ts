import { PrismaClient } from "@prisma/client";
import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { ProductModel } from "../models/product.model";
import { NotFoundError } from "../utils";

export class CatalogRepository implements ICatalogRepository {
	_prisma: PrismaClient;

	constructor() {
		this._prisma = new PrismaClient();
	}

	async create(data: ProductModel): Promise<ProductModel> {
		return this._prisma.product.create({
			data,
		});
	}
	async update(data: ProductModel): Promise<ProductModel> {
		return this._prisma.product.update({
			where: { id: data.id },
			data,
		});
	}
	async delete(id: unknown) {
		return this._prisma.product.delete({
			where: { id: id as number },
		});
	}
	async find(limit: number, offset: number): Promise<ProductModel[]> {
		return this._prisma.product.findMany({
			take: limit,
			skip: offset,
		});
	}
	async findOne(id: number): Promise<ProductModel> {
		const product = await this._prisma.product.findFirst({
			where: { id },
		});
		if (product) {
			return Promise.resolve(product);
		}
		throw new NotFoundError("product not found");
	}
}
