import { ProductModel } from "../models/product.model";

export interface ICatalogRepository {
	create(data: ProductModel): Promise<ProductModel>;
	update(data: ProductModel): Promise<ProductModel>;
	delete(id: unknown): unknown;
	find(limit: number, offset: number): Promise<ProductModel[]>;
	findOne(id: number): Promise<ProductModel>;
}
