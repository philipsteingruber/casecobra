"use server";

import { BASE_PRICE } from "@/config/products";
import { db } from "@/db";
import { FINISHES, MATERIALS } from "@/validators/option-validator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function createCheckoutSession({ configId }: { configId: string }) {
  const configuration = await db.configuration.findUnique({ where: { id: configId } });
  if (!configuration) {
    throw new Error("No such configuration");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { finish, material } = configuration;
  const finishPrice = FINISHES.selectableOptions.find(
    (selectableOption) => selectableOption.value === finish
  )!.price;
  const materialPrice = MATERIALS.selectableOptions.find(
    (selectableOption) => selectableOption.value === material
  )!.price;

  const totalPrice = BASE_PRICE + finishPrice + materialPrice;
}
