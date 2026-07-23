import type IProduct from "./IProduct";

export interface ICartItem {
    id: string;
    quantity: number;
    product: IProduct
}

export interface ICart {
    id: string;
    items: ICartItem[]; 
}