"use client";
// "bg-zinc-900 border-zinc-900 bg-blue-950 border-blue-950 bg-rose-950 border-rose-950";

import Phone from "@/components/Home/Phone";
import { Button } from "@/components/ui/button";
import { BASE_PRICE } from "@/config/products";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS, FINISHES, MATERIALS, MODELS } from "@/validators/option-validator";
import { Configuration } from "@prisma/client";
import { ArrowRight, Check } from "lucide-react";

export default function DesignPreview({ configuration }: { configuration: Configuration }) {
  const { color, model, material, finish, croppedImageUrl } = configuration;
  const modelLabel = MODELS.selectableOptions.find(
    (supportedModel) => supportedModel.value === model
  )!.label;

  const materialLabel = MATERIALS.selectableOptions.find(
    (supportedMaterial) => supportedMaterial.value === material
  )!.label;
  const materialPrice = MATERIALS.selectableOptions.find(
    (selectableOption) => selectableOption.value === material
  )!.price;

  const finishLabel = FINISHES.selectableOptions.find(
    (supportedFinish) => supportedFinish.value === finish
  )!.label;
  const finishPrice = FINISHES.selectableOptions.find(
    (selectableOption) => selectableOption.value === finish
  )!.price;

  const totalPrice = BASE_PRICE + materialPrice + finishPrice;

  const twbg = COLORS.selectableOptions.find(
    (supportedColor: (typeof COLORS.selectableOptions)[number]) => supportedColor.value === color
  )!.twbg;

  return (
    <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
      <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
        <Phone className={cn(`${twbg}`)} imgSrc={croppedImageUrl!} />
      </div>
      <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900">Your {modelLabel} case</h3>
        <div className="mt-3 flex items-center gap-1.5 text-base">
          <Check className="size-4 text-green-500" /> In stock and ready to ship
        </div>
      </div>
      <div className="sm:col-span-12 md:col-span-9 text-base">
        <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
          <div>
            <p className="font-medium text-zinc-950">Highlights</p>
            <ol className="mt-3 text-zinc-700 list-disc list-inside">
              <li>Wireless charging compatible</li>
              <li>TPU shock absorption</li>
              <li>Packaging made from recycled materials</li>
              <li>5 year warranty</li>
            </ol>
          </div>

          <div>
            <p className="font-medium text-zinc-950">Materials</p>
            <ol className="mt-3 text-zinc-700 list-disc list-inside">
              <li>High-quality durable material</li>
              <li>Scratch- and fingerprint resistant coating</li>
            </ol>
          </div>
        </div>
        <div className="mt-8">
          <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8 ">
            <div className="flow-root text-sm">
              <div className="flex items-center justify-between py-1 mt-2">
                <p className="text-gray-600">Base price</p>
                <p className="font-medium text-gray-900">{formatPrice(BASE_PRICE / 100)}</p>
              </div>
              {finish !== "smooth" ? (
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">{finishLabel}</p>
                  <p className="font-medium text-gray-900">{formatPrice(finishPrice / 100)}</p>
                </div>
              ) : null}
              {material !== "silicone" ? (
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">{materialLabel}</p>
                  <p className="font-medium text-gray-900">{formatPrice(materialPrice / 100)}</p>
                </div>
              ) : null}
              <div className="my-2 h-px bg-gray-200" aria-hidden />
              <div className="flex items-center justify-between py-2">
                <p className="font-semibold text-gray-900">Order total</p>
                <p className="font-semibold text-gray-900">{formatPrice(totalPrice / 100)}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end pb-12">
            <Button className="px-4 sm:px-6 lg:px-8">
              Check out <ArrowRight className="size-4 ml-1.5 inline" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
