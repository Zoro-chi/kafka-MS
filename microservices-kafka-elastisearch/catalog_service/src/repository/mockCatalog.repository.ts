import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { ProductModel } from "../models/product.model";

export class MockCatalogRepository implements ICatalogRepository {
	create(data: ProductModel): Promise<ProductModel> {
		const mockProduct = {
			id: 777,
			...data,
		} as ProductModel;
		return Promise.resolve(mockProduct);
	}
	update(data: ProductModel): Promise<ProductModel> {
		return Promise.resolve(data as unknown as ProductModel);
	}
	delete(id: unknown): unknown {
		return Promise.resolve(id);
	}
	find(limit: number, offset: number): Promise<ProductModel[]> {
		return Promise.resolve([]);
	}
	findOne(id: number): Promise<ProductModel> {
		return Promise.resolve({ id } as unknown as ProductModel);
	}
}
