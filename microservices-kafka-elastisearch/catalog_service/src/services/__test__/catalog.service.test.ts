import { faker } from "@faker-js/faker";

import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { ProductModel } from "../../models/product.model";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { CatalogService } from "../catalog.service";
import { ProductFactory } from "../../utils/fixtures";

const mockProduct = (rest: any) => {
	return {
		name: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		stock: faker.number.int({ min: 10, max: 100 }),
		...rest,
	};
};

describe("CatalogService", () => {
	let repository: ICatalogRepository;

	beforeEach(() => {
		repository = new MockCatalogRepository();
	});

	afterEach(() => {
		repository = {} as MockCatalogRepository;
	});

	describe("createProduct", () => {
		test("should create a product", async () => {
			const service = new CatalogService(repository);
			const requestBody = mockProduct({
				price: +faker.commerce.price(),
			});
			const result = await service.createProduct(requestBody);
			expect(result).toMatchObject({
				id: expect.any(Number),
				name: expect.any(String),
				description: expect.any(String),
				price: expect.any(Number),
				stock: expect.any(Number),
			});
		});

		test("should throw error unable to create product", async () => {
			const service = new CatalogService(repository);
			const requestBody = mockProduct({
				price: +faker.commerce.price(),
			});

			jest
				.spyOn(repository, "create")
				.mockImplementationOnce(() => Promise.resolve({} as ProductModel));

			await expect(service.createProduct(requestBody)).rejects.toThrow(
				"unable to create product"
			);
		});

		test("should throw error product already exists", async () => {
			const service = new CatalogService(repository);
			const requestBody = mockProduct({
				price: +faker.commerce.price(),
			});

			jest
				.spyOn(repository, "create")
				.mockImplementationOnce(() =>
					Promise.reject(new Error("product already exists"))
				);

			await expect(service.createProduct(requestBody)).rejects.toThrow(
				"product already exists"
			);
		});
	});

	describe("updateProduct", () => {
		test("should update a product", async () => {
			const service = new CatalogService(repository);
			const requestBody = mockProduct({
				price: +faker.commerce.price(),
				id: faker.number.int({ min: 1, max: 1000 }),
			});
			const result = await service.updateProduct(requestBody);
			expect(result).toMatchObject(requestBody);
		});

		test("should throw error product does not exist", async () => {
			const service = new CatalogService(repository);

			jest
				.spyOn(repository, "update")
				.mockImplementationOnce(() =>
					Promise.reject(new Error("product does not exist"))
				);

			await expect(service.updateProduct({})).rejects.toThrow(
				"product does not exist"
			);
		});
	});

	describe("getProducts", () => {
		test("should get products by offset and limit", async () => {
			const service = new CatalogService(repository);
			const randomLimit = faker.number.int({ min: 10, max: 50 });
			const products = ProductFactory.buildList(randomLimit);

			jest
				.spyOn(repository, "find")
				.mockImplementationOnce(() => Promise.resolve(products));

			const result = await service.getProducts(randomLimit, 0);

			expect(result.length).toEqual(randomLimit);
			expect(result).toMatchObject(products);
		});

		test("should throw error product does not exist", async () => {
			const service = new CatalogService(repository);

			jest
				.spyOn(repository, "update")
				.mockImplementationOnce(() =>
					Promise.reject(new Error("product does not exist"))
				);

			await expect(service.updateProduct({})).rejects.toThrow(
				"product does not exist"
			);
		});

		test("should throw error unable to get products", async () => {
			const service = new CatalogService(repository);

			jest
				.spyOn(repository, "find")
				.mockImplementationOnce(() =>
					Promise.reject(new Error("unable to get products"))
				);

			await expect(service.getProducts(0, 0)).rejects.toThrow(
				"unable to get products"
			);
		});
	});

	describe("getProduct", () => {
		test("should get a product by id", async () => {
			const service = new CatalogService(repository);
			const product = ProductFactory.build();

			jest
				.spyOn(repository, "findOne")
				.mockImplementationOnce(() => Promise.resolve(product));

			const result = await service.getProduct(product.id!);

			expect(result).toMatchObject(product);
		});

		test("should throw error product does not exist", async () => {
			const service = new CatalogService(repository);

			jest
				.spyOn(repository, "findOne")
				.mockImplementationOnce(() =>
					Promise.reject(new Error("product does not exist"))
				);

			await expect(service.getProduct(0)).rejects.toThrow(
				"product does not exist"
			);
		});
	});

	describe("deleteProduct", () => {
		test("should delete a product by id", async () => {
			const service = new CatalogService(repository);
			const product = ProductFactory.build();

			jest
				.spyOn(repository, "delete")
				.mockImplementationOnce(() => Promise.resolve({ id: product.id }));

			const result = await service.deleteProduct(product.id!);

			expect(result).toMatchObject({ id: product.id });
		});

		test("should throw error product does not exist", async () => {
			const service = new CatalogService(repository);

			jest
				.spyOn(repository, "delete")
				.mockImplementationOnce(() =>
					Promise.reject(new Error("product does not exist"))
				);

			await expect(service.deleteProduct(0)).rejects.toThrow(
				"product does not exist"
			);
		});
	});
});
