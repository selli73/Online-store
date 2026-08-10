export interface ICreateProduct {
    name: string;
    price: number;
    stock: number;
    applicabilityToCars: string;
    partType: string;
    manufacturer: string | null;
    description: string | null;
}