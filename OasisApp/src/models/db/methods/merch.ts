import {IMerchAPI, IMerchItem} from "@/models/merch";
import {db} from "@/models/db";
import {merchSchema} from "@/models/db/schema";
import {eq} from "drizzle-orm";
import {useFastStore} from "@/state/fast/fast";

export async function CacheMerch(data: IMerchAPI[]) {
    const res = await db.delete(merchSchema)
    console.log(`[Cache Deletion result]: ${res}`)

    for (const i of data) {
        const res = await db.insert(merchSchema)
            .values({
                id: i.id,
                merch_id: i.id,
                name: i.name,
                image_url: i.image_url,
                back_image_url: i.back_image_url,
                blur_hash: i.blur_hash,
                price: i.price,
            }).catch((err) => {
                console.error(`[Cache write fail]: Failed to cache merch ${err}`)
            })
        console.log(`[Cache result]: ${res?.changes}`)
    }
    const writeMerch = async ()  => {

    }
}



export async function GetCachedMerch(): Promise<IMerchAPI[] | null> {
    // check if data is cached
    const merchItems = await db.select()
        .from(merchSchema)
    if (!merchItems || merchItems.length === 0) {
        return null;
    } // no cache present
    return merchItems.map(i => ({
        id: i.id,
        name: i.name,
        image_url: i.image_url,
        blur_hash: i.blur_hash,
        back_image_url: i.back_image_url,
        price: i.price,
        sizes: null,
    }))
}

export async function ClearMerchCache() {
    await db.delete(merchSchema)
}

export async function AddMerchToCartMMKV(ID: number) {
    const data = await db.select()
        .from(merchSchema)
    console.log(data)
    console.log("ID: " + ID)
    const price = data.find(i => i.merch_id === ID)?.price
    console.log("Price: " + price)
    if (price === undefined) {
        throw new Error("Couldn't add item: Price not found for merch ID: " + ID)
    }
    useFastStore.getState()
        .AddMerchToCart({ id: ID, name: "", price, quantity: 1 })
}

export async function RemoveMerchFromCartMMKV(ID: number) {
    useFastStore.getState()
        .RemoveMerchFromCart(ID)
}