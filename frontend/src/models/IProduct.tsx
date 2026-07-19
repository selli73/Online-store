export default interface IProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    applicabilityToCars: string;
    partType: string;
    manufacturer: string | null;
    description: string | null;
    imageUrl: string | null;
    rating: number;
}