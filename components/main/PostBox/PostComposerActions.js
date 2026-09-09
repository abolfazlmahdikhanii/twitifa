import { Button } from "@heroui/react";
import { Loader2 } from "lucide-react";
import Icon from "../../ui/Icon/Icon";

const MediaActionButton = ({
  icon,
  onPress,
  isLoading = false,
  disabled = false,
}) => (
  <Button
    isIconOnly
    variant="ghost"
    className="text-[#6366F1] mt-2 sm:mt-3 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6.5 sm:[&>svg]:h-6.5 px-3 sm:px-5.5 py-3 sm:py-5.5"
    onPress={onPress}
    isDisabled={disabled}
    isPending={isLoading}
  >
    {isLoading ? <Loader2 className="animate-spin" /> : icon}
  </Button>
);

const PostComposerActions = ({
  imgRef,
  videoRef,
  changeMediaFile,
  handleImageClick,
  handleVideoClick,
  hasPoll,
  mediaType,
  mediaUrl,
  setHasPoll,
  isImageLoading,
  isVideoLoading,
}) => (
  <div className="flex items-center gap-x-1 sm:gap-x-3.5">
    <MediaActionButton
      icon={<Icon name="image" strokeWidth={2.25} />}
      onPress={handleImageClick}
      disabled={hasPoll || mediaType === "video" || mediaUrl.length >= 4}
      isLoading={isImageLoading}
    />
    <input
      ref={imgRef}
      type="file"
      className="hidden"
      accept="image/*"
      onChange={changeMediaFile}
      multiple
    />

    <MediaActionButton
      icon={<Icon name="globe" strokeWidth={2.25} />}
      onPress={handleVideoClick}
      disabled={hasPoll || mediaType === "image" || mediaUrl.length >= 1}
      isLoading={isVideoLoading}
    />
    <input
      ref={videoRef}
      type="file"
      className="hidden"
      accept="video/*"
      onChange={(e) => changeMediaFile(e, true)}
      multiple
    />

    <MediaActionButton
      icon={<Icon name="checklist" strokeWidth={2.25} />}
      onPress={() => setHasPoll(true)}
      disabled={hasPoll}
    />

    <MediaActionButton icon={<Icon name="emoji-happy" strokeWidth={2.25} />} />
  </div>
);

export default PostComposerActions;
