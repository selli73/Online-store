export default interface IProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    applicabilityToCars: string;
    partType: string;
    maufacturer: string;
    description: string;
    imageUrl: string | null;
    rating: number;
}