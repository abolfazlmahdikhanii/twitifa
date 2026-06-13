import { getBlurFromUrl } from "@/utils/post";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const BlurImage = ({ imageUrl, index }) => {
  const [blur, setBlur] = useState(null);

  useEffect(() => {
    getBlurFromUrl(imageUrl).then((res)=>setBlur(res));
  }, [imageUrl]);
  return (
    <Image
      src={imageUrl}
      alt={`تصویر ${index + 1}`}
      className={`w-full h-full object-cover rounded-3xl min-h-63 max-h-122.5 cursor-pointer overflow-hidden duration-700 ease-in-out `}
      width={300}
      height={300}
      placeholder="blur"
      blurDataURL={blur}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
    />
  );
};

export default BlurImage;
