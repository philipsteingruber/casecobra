"use server";

import { db } from "@/db";
import { CaseColor, CaseFinish, CaseMaterial, PhoneModel } from "@prisma/client";

export type saveConfigurationArgs = {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
  configId: string;
};

export async function uploadConfigurationToDb({
  color,
  finish,
  material,
  model,
  configId,
}: saveConfigurationArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: {
      color,
      finish,
      material,
      model,
    },
  });
}
