import React, { memo } from "react";
import MediaImageItem from "../MediaImageItem/MediaImageItem";
import MediaVideoItem from "../MediaVideoItem/MediaVideoItem";

const MediaGallery = memo(
  ({ medias = [], onRemove, isPreview = false, author = null }) => {
    const count = medias.length;

    const gridClass =
      count === 1
        ? "grid grid-cols-1"
        : count === 2
          ? "grid grid-cols-2"
          : count === 3
            ? "grid grid-cols-2 sm:grid-cols-3"
            : "grid grid-cols-2";

    return (
      <div className={`${gridClass} gap-1.5 sm:gap-2 mt-3 sm:mt-5 mb-4 sm:mb-6`}>
        {medias.map((media, i) =>
          media.mediaType === "image" ? (
            <MediaImageItem
              key={isPreview ? media.id : media._id}
              img={isPreview ? media : media.url}
              blurUrl={!isPreview ? media.blurDataUrl : null}
              index={i}
              totalImages={count}
              onRemove={() => isPreview && onRemove(media.id)}
              isPreview={isPreview}
            />
          ) : (
            <MediaVideoItem
              key={isPreview ? media.id : media._id}
              video={isPreview ? media : media.url}
              posterUrl={!isPreview && media.posterUrl}
              blurUrl={!isPreview ? media.blurDataUrl : null}
              time={!isPreview ? media.time : null}
              size={!isPreview ? media.size : null}
              index={i}
              totalVideo={count}
              onRemove={() => isPreview && onRemove(media.id)}
              isPreview={isPreview}
              author={author}
            />
          ),
        )}
      </div>
    );
  },
);

MediaGallery.displayName = "MediaGallery";

export default MediaGallery;