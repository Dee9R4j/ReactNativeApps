export interface IMerchItem {
    details: IMerchAPI;
    bought: number;
    collected: number;
}
export interface IMerchBought {
    id: number;
    bought: number;
    collected: number;
}

export interface IMerchAPI {
    id: number;
    name: string;
    image_url: string;
    back_image_url: string;
    blur_hash: string;
    price: number;
}

export interface IMerchCart {
    id: number;
    quantity: number;
    price: number;
}