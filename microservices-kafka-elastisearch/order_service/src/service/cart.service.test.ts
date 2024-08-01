import { CartRepositoryType } from "../types/repository.type";
import * as Repository from "../repository/cart.repository";
import { CreateCart } from "../service/cart.service";

describe("CartService", () => {
	let repo: CartRepositoryType;

	beforeEach(() => {
		repo = Repository.CartRepository;
	});

	afterEach(() => {
		repo = {} as CartRepositoryType;
	});

	it("should create a cart and return correct data", async () => {
		const mockCart = {
			title: "Smartphone",
			price: 1500,
		};

		jest
			.spyOn(Repository.CartRepository, "create")
			.mockImplementationOnce(() =>
				Promise.resolve({ message: "Cart created", input: mockCart })
			);

		const res = await CreateCart(mockCart, repo);

		expect(res).toEqual({
			message: "Cart created",
			input: mockCart,
		});
	});
});
