import { EditorContent } from "@tiptap/react";
import { memo } from "react";
import PollForm from "../../Polls/PollForm";
import MediaGallery from "../../ui/Media/MediaGallery/MediaGallery";

const MediaGalleryMemo = memo(MediaGallery);

const PostEditorArea = ({
  editor,
  hasPoll,
  mediaUrl,
  setPollData,
  setHasPoll,
  removeSelectedMedia,
  isEdit,
  isReply,
}) => (
  <div className={`${!isEdit || !isReply ? "mb-2 sm:mb-3" : ""}`}>
    <div
      className={`${!isEdit || !isReply ? "min-h-12" : "min-h-26"} relative`}
    >
      <EditorContent editor={editor} />
    </div>

    {hasPoll && (
      <PollForm
        onPollDataChange={setPollData}
        onRemovePoll={() => {
          setPollData(null);
          setHasPoll(false);
        }}
      />
    )}

    {mediaUrl.length > 0 && (
      <MediaGalleryMemo
        medias={mediaUrl}
        onRemove={removeSelectedMedia}
        isPreview={true}
      />
    )}
  </div>
);

export default PostEditorArea;
