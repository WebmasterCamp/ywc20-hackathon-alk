"use server";

import { getDb } from "@/db";
import { collection } from "@/db/schema";

export async function testServerAction() {
    const db = getDb();
    const collections = await db.select().from(collection);
    return collections;
}
