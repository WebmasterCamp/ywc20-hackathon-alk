"use server";

import { db } from "@/db";
import { collection } from "@/db/schema";

export async function testServerAction() {
    const collections = await db.select().from(collection);
    return collections;
}
