"use server";

import { getDb } from "@/db";
import { service } from "@/db/schema";

export async function getServiceAction() {
    const db = getDb();
    const services = await db.select().from(service);
    return services;
}
