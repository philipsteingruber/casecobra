"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Dropzone from "react-dropzone";

export default function Page() {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const onDropRejected = () => {
    console.log("rejected");
  };
  const onDropAccepted = () => {
    console.log("accepted");
  };

  return (
    <div
      className={cn(
        "relative my-16 flex h-full w-full flex-1 flex-col items-center justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl",
        { "bg-blue-900/10 ring-blue-900/25": isDragOver }
      )}
    >
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": ["jpeg"],
            "image/jpg": ["jpg"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="flex h-full w-full flex-1 flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              Drop your image here
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}
