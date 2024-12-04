"use client";

import HandleComponent from "@/components/Configure/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BASE_PRICE } from "@/config/products";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS, FINISHES, MATERIALS, MODELS } from "@/validators/option-validator";
import { Description, Radio, RadioGroup } from "@headlessui/react";
import { ArrowRight, CheckIcon, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}
// "bg-zinc-900 border-zinc-900 bg-blue-950 border-blue-950 bg-rose-950 border-rose-950";

export default function DesignConfigurator({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) {
  const defaultX = 150;
  const defaultY = 205;
  const renderRatio = 4;

  const [options, setOptions] = useState<{
    color: (typeof COLORS.selectableOptions)[number];
    model: (typeof MODELS.selectableOptions)[number];
    material: (typeof MATERIALS.selectableOptions)[number];
    finish: (typeof FINISHES.selectableOptions)[number];
  }>({
    color: COLORS.selectableOptions[0],
    model: MODELS.selectableOptions[MODELS.selectableOptions.length - 1],
    material: MATERIALS.selectableOptions[0],
    finish: FINISHES.selectableOptions[0],
  });

  const { toast } = useToast();
  const [renderedDimensions, setRenderedDimensions] = useState({
    width: imageDimensions.width / renderRatio,
    height: imageDimensions.height / renderRatio,
  });
  const [renderedPosition, setRenderedPosition] = useState({
    x: defaultX,
    y: defaultY,
  });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  const phoneWidth = 896;
  const phoneHeight = 1831;
  const aspectRatioClass = `aspect-[${phoneWidth}/${phoneHeight}]`;

  function base64ToBlob(base64Data: string, mimeType: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let index = 0; index < byteNumbers.length; index++) {
      byteNumbers[index] = byteCharacters.charCodeAt(index);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  async function submitConfiguration() {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = (renderedPosition.y = topOffset);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx!.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimensions.width,
        renderedDimensions.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "File upload failed",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="relative mb-20 mt-20 grid grid-cols-1 pb-20 lg:grid-cols-3">
      <div
        className="relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-2 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        ref={containerRef}
      >
        <div className={`pointer-events-none relative w-60 bg-opacity-50 ${aspectRatioClass}`}>
          <AspectRatio
            ratio={phoneWidth / phoneHeight}
            className={`pointer-events-none relative z-30 w-full ${aspectRatioClass}`}
            ref={phoneCaseRef}
          >
            <Image
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-30 select-none"
              fill
            />
          </AspectRatio>
          <div className="absolute inset-0 bottom-px left-[3px] right-[3px] top-px z-30 rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]"></div>
          <div
            className={cn(
              "absolute inset-0 bottom-px left-[3px] right-[3px] top-px rounded-[32px]",
              `${options.color.twbg}`
            )}
          />
        </div>
        <Rnd
          default={{
            x: defaultX,
            y: defaultY,
            height: imageDimensions.height / renderRatio,
            width: imageDimensions.width / renderRatio,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topLeft: <HandleComponent />,
            topRight: <HandleComponent />,
          }}
          resizeHandleClasses={{
            bottomRight: "z-50",
            bottomLeft: "z-50",
            topLeft: "z-50",
            topRight: "z-50",
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimensions({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y }: { x: number; y: number } = data;
            setRenderedPosition({ x, y });
          }}
          className="absolute z-20 border-[3px] border-primary"
        >
          <div className="relative h-full w-full">
            <Image src={imageUrl} fill alt="your image" className="pointer-events-none" />
          </div>
        </Rnd>
      </div>
      <div className="col-span-full flex h-[37.5rem] w-full flex-col bg-white lg:col-span-1">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white"
          />
          <div className="px-8 pb-12 pt-8">
            <h2 className="text-3xl font-bold tracking-tight">Customize your case</h2>
            <div className="my-6 h-px w-full bg-zinc-200"></div>
            <div className="relative mt-4 flex h-full flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.selectableOptions.map((color) => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={({ focus, checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 focus:outline-none focus:ring-0 active:outline-none active:ring-0",
                            {
                              [`${color.twborder}`]: focus || checked,
                            }
                          )
                        }
                      >
                        <span
                          className={`${color.twbg} h-8 w-8 rounded-full border border-black border-opacity-10`}
                        />
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
                <div className="relative flex w-full flex-col gap-3">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.selectableOptions.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex cursor-default items-center gap-1 p-1.5 text-sm hover:bg-zinc-100",
                            {
                              "bg-zinc-100": model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({
                              ...prev,
                              model,
                            }));
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 size-4",
                              model.label === options.model.label ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <RadioGroup
                  key={MATERIALS.optionsName}
                  value={options.material}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      material: val,
                    }));
                  }}
                >
                  <Label>Material</Label>
                  <div className="mt-3 space-y-4">
                    {MATERIALS.selectableOptions.map((option) => (
                      <Radio
                        key={option.value}
                        value={option}
                        className={({ focus, checked }) =>
                          cn(
                            "relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between",
                            { "border-primary": focus || checked }
                          )
                        }
                      >
                        <span className="flex items-center">
                          <span className="flex flex-col text-sm">
                            <RadioGroup.Label as="span" className="font-medium text-gray-900">
                              {option.label}
                            </RadioGroup.Label>
                            {option.description ? (
                              <Description as="span" className="text-gray-500">
                                <span className="block sm:inline">{option.description}</span>
                              </Description>
                            ) : null}
                          </span>
                        </span>
                        <Description
                          as="span"
                          className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                        >
                          <span
                            className={cn("font-medium text-gray-900 opacity-20", {
                              "opacity-100": option.price > 0,
                            })}
                          >
                            {formatPrice(option.price / 100)}
                          </span>
                        </Description>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <RadioGroup
                  key={FINISHES.optionsName}
                  value={options.finish}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      finish: val,
                    }));
                  }}
                >
                  <Label>Finish</Label>
                  <div className="mt-3 space-y-4">
                    {FINISHES.selectableOptions.map((option) => (
                      <Radio
                        key={option.value}
                        value={option}
                        className={({ focus, checked }) =>
                          cn(
                            "relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between",
                            { "border-primary": focus || checked }
                          )
                        }
                      >
                        <span className="flex items-center">
                          <span className="flex flex-col text-sm">
                            <RadioGroup.Label as="span" className="font-medium text-gray-900">
                              {option.label}
                            </RadioGroup.Label>
                            {option.description ? (
                              <Description as="span" className="text-gray-500">
                                <span className="block sm:inline">{option.description}</span>
                              </Description>
                            ) : null}
                          </span>
                        </span>
                        <Description
                          as="span"
                          className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                        >
                          <span
                            className={cn("font-medium text-gray-900 opacity-20", {
                              "opacity-100": option.price > 0,
                            })}
                          >
                            {formatPrice(option.price / 100)}
                          </span>
                        </Description>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="h-16 w-full bg-white px-8">
          <div className="h-px w-full bg-zinc-200" aria-hidden="true" />
          <div className="flex h-full w-full items-center justify-end">
            <div className="flex w-full items-center justify-between gap-6">
              <p className="whitespace-nowrap font-medium">
                Subtotal:{" "}
                {formatPrice((BASE_PRICE + options.finish.price + options.material.price) / 100)}
              </p>
              <Button onClick={submitConfiguration}>
                Continue
                <ArrowRight className="ml-1.5 inline size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
