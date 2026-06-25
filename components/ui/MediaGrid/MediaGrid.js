"use client";
import useResponsiveHeight from "@/hooks/useResponsiveHeight";
import MediaImageItem from "../Media/MediaImageItem/MediaImageItem";
import MediaVideoItem from "../Media/MediaVideoItem/MediaVideoItem";

const MediaGrid = ({ row }) => {
  const isNormal = row.type === "normal";
  const height = useResponsiveHeight(row.height);

  const gridClass = isNormal
    ? "grid grid-cols-3"
    : "grid grid-cols-3 grid-rows-2";

  return (
    <div
      className={`${gridClass} gap-0.5 sm:gap-0.75`}
      style={{ height: `${height}px` }}
    >
      {row.items.map((item, idx) => {
        if (!item) return <div key={`empty-${idx}`} className="bg-gray-800" />;

        let spanClass = "";
        if (row.type === "left-large" && idx === 0) spanClass = "row-span-2";
        if (row.type === "right-large" && idx === 2) spanClass = "row-span-2";

        return (
          <div
            key={item._id}
            className={`relative ${spanClass} overflow-hidden rounded-sm sm:rounded-none`}
            style={{ height: "100%" }}
          >
            {item.media.mediaType === "image" ? (
              <MediaImageItem
                key={item.media._id}
                img={item.media.url}
                blurUrl={item.media.blurDataUrl}
                index={idx}
                totalImages={row.items.length}
              />
            ) : (
              <MediaVideoItem
                key={item.media._id}
                video={item.media.url}
                posterUrl={item.media.posterUrl}
                blurUrl={item.media.blurDataUrl}
                time={item.media.time}
                size={item.media.size}
                index={idx}
                totalVideo={row.items.length}
                author={item.author}
                postId={item.postId}
                isGrid
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
