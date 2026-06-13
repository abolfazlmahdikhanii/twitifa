import React, { memo } from "react";
import MediaImageItem from "../MediaImageItem/MediaImageItem";
import MediaVideoItem from "../MediaVideoItem/MediaVideoItem";

const MediaGallery = memo(
  ({ medias = [], onRemove, isPreview = false, author = null }) => {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 mt-5 mb-6">
        {medias.map((media, i) =>
          media.mediaType === "image" ? (
            <MediaImageItem
              key={isPreview ? media.id : media._id}
              img={isPreview ? media : media.url}
              blurUrl={!isPreview ? media.blurDataUrl : null}
              index={i}
              totalImages={medias.length}
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
              totalVideo={medias.length}
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
