import {db} from "@/models/db/index";
import {
    cartSchema,
    categoriesSchema, menuItemsSchema,
    merchSchema,
    notificationsSchema, orderItemsRelations, orderItemsSchema, ordersRelations,
    ordersSchema, stallsSchema,
    stallTotalsSchema
} from "@/models/db/schema";
import {useFastStore} from "@/state/fast/fast";

export async function WipeSQLite() {
    const DBDeletePromises = [
        db.delete(cartSchema),
        db.delete(categoriesSchema),
        db.delete(cartSchema),
        db.delete(merchSchema),
        db.delete(stallTotalsSchema),
        db.delete(notificationsSchema),
        db.delete(ordersSchema),
        db.delete(orderItemsSchema),
        db.delete(stallsSchema),
        db.delete(menuItemsSchema),
        db.delete(merchSchema)
    ]
    await Promise.all(DBDeletePromises);
    console.log("Wiped SQLite");
}

import { mmkvStorage } from "@/state/fast/mmkv";

export function WipeMMKVCache() {
    useFastStore.getState().ClearN2OTickets()
    useFastStore.getState().ClearMerchCart()
    useFastStore.getState().ClearUserMerchData()
    useFastStore.getState().clearCart()
    mmkvStorage.delete("dummy_mock_orders_v1")
}

export async function LogoutWipeData() {
    await WipeSQLite()
    WipeMMKVCache()
}