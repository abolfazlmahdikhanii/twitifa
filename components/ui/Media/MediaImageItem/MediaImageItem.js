"use client";
import { Button } from "@heroui/react";
import { EllipsisVertical, X } from "lucide-react";
import Image from "next/image";
import { memo, useMemo } from "react";

const MediaImageItem = memo(
  ({ img, index, totalImages, onRemove, isPreview = false, blurUrl }) => {
    const objectUrl = useMemo(
      () => (isPreview ? URL.createObjectURL(img.file) : img),
      [img, isPreview],
    );

    const layoutClass = useMemo(
      () =>
        totalImages === 3 && index === 2
          ? "col-span-2 sm:col-span-1"
          : "",
      [totalImages, index],
    );

    const imageKey = useMemo(
      () => `${img.size}-${img.name}-${img.lastModified || index}`,
      [img.size, img.name, img.lastModified, index],
    );

    return (
      <div
        className={`relative group aspect-video ${layoutClass}`}
        key={isPreview ? imageKey : index}
      >
        {!isPreview ? (
          <Image
            src={`${objectUrl}?tr=w-900,q-95,f-webp`}
            alt={`تصویر ${index + 1}`}
            className="w-full h-full object-cover rounded-xl sm:rounded-3xl min-h-40 sm:min-h-63 max-h-96 sm:max-h-145.5 cursor-pointer overflow-hidden duration-700 ease-in-out"
            width={500}
            height={500}
            placeholder={blurUrl ? "blur" : "empty"}
            blurDataURL={blurUrl}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <Image
            src={objectUrl}
            alt={`تصویر ${index + 1}`}
            className="w-full h-full object-cover rounded-xl sm:rounded-3xl min-h-40 sm:min-h-63 max-h-72 sm:max-h-122.5 cursor-pointer overflow-hidden"
            width={300}
            height={300}
            loading="lazy"
            unoptimized
          />
        )}

        {isPreview && (
          <div className="absolute flex items-center justify-between left-0 px-2 sm:px-3 top-2.5 sm:top-3.25 w-full">
            <Button
              isIconOnly
              size="sm"
              className="bg-gray-600/80 size-7 sm:size-8 [&>svg]:size-3.5 sm:[&>svg]:size-4"
            >
              <EllipsisVertical />
            </Button>
            <Button
              isIconOnly
              size="sm"
              className="bg-gray-600/80 size-7 sm:size-8 [&>svg]:size-3.5 sm:[&>svg]:size-4"
              onPress={onRemove}
            >
              <X />
            </Button>
          </div>
        )}
      </div>
    );
  },
);

MediaImageItem.displayName = "MediaImageItem";
export default MediaImageItem;