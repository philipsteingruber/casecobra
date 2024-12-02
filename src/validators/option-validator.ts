import { PRODUCT_PRICES } from "@/config/products";

export const COLORS = [
  { label: "Black", value: "black", twbg: "bg-zinc-900", twborder: "border-zinc-900" },
  {
    label: "Blue",
    value: "blue",
    twbg: "bg-blue-950",
    twborder: "border-blue-950",
  },
  { label: "Rose", value: "rose", twbg: "bg-rose-950", twborder: "border-rose-950" },
] as const;

export const MODELS = {
  name: "models",
  options: [
    { label: "iPhone 14", value: "iphone14" },
    { label: "iPhone 15", value: "iphone15" },
    { label: "iPhone 16", value: "iphone16" },
  ],
} as const;

export const MATERIALS = {
  name: "material",
  options: [
    {
      label: "Silicone",
      value: "silicone",
      description: undefined,
      price: PRODUCT_PRICES.material.silicone,
    },
    {
      label: "Soft polycarbonate",
      value: "polycarbonate",
      description: "Scratch-resistant coating",
      price: PRODUCT_PRICES.material.polycarbonate,
    },
  ],
};

export const FINISHES = {
  name: "finish",
  options: [
    {
      label: "Smooth Finish",
      value: "smooth",
      description: undefined,
      price: PRODUCT_PRICES.finish.smooth,
    },
    {
      label: "Textured Finish",
      value: "textured",
      description: "Soft, grippy texture",
      price: PRODUCT_PRICES.finish.textured,
    },
  ],
};
