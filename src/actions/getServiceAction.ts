"use server";

import { db } from "@/db";
import { service } from "@/db/schema";

export async function getServiceAction() {
    const services = await db.select().from(service);
    return services;
}
