const IK_BASE = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export const getIKPoster = (posterUrl, width = 800) => {
  if (!posterUrl) return null;
  if (!posterUrl.startsWith("https://ik.imagekit.io")) return posterUrl;
  return `${posterUrl}?tr=w-${width},q-95,f-webp`;
};

export const getIKVideo = (videoUrl, quality = 80) => {
  if (!videoUrl) return null;
  if (!videoUrl.startsWith("https://ik.imagekit.io")) return videoUrl;
  return `${videoUrl}?tr=q-${quality}`;
};

export const getIKBlur = (posterUrl) => {
  if (!posterUrl) return null;
  return `${posterUrl}?tr=w-20,h-20,bl-30,q-10`;
};
