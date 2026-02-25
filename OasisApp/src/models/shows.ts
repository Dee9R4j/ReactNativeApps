export interface IShowsDetails {
    id: number,
    name: string,
    description: string | null,
    artists: string | null,
    venue: string | null,
    event_time: Date,
    is_live: boolean,
    price: number,
}

export interface IShowsCart {
    id: number,
    quantity: number,
}

export interface IShowsUserDetails extends IShowsCart{
    scanned: number
}
