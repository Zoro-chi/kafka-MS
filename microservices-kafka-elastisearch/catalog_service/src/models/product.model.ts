export class ProductModel {
	constructor(
		public readonly name: string,
		public readonly description: string,
		public readonly price: number,
		public readonly stock: number,
		public readonly id?: number
	) {}
}
