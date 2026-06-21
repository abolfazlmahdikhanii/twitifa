import { Avatar, Button } from "@heroui/react";
import { Camera } from "lucide-react";
import Image from "next/image";

const ProfileMedia = ({
  handleCoverClick,
  coverPreview,
  user,
  coverRef,
  handleCoverChange,
  profilePreview,
  handleImageClick,
  isLoading,
  imgRef,
  handleProfileChange,
}) => {
  return (
    <div>
      {/* Cover Image */}
      <div className="relative mt-8 cursor-pointer group">
        <div className="h-62 relative w-full overflow-hidden rounded-2xl">
          <Image
            src={coverPreview || user?.profileBg || "/images/profile-bg.webp"}
            alt="profile-bg"
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover w-full h-full"
            width={640}
            height={400}
            priority
          />
        </div>
        <Button
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-5.5 py-5.5 "
          variant="tertiary"
          onClick={handleCoverClick}
        >
          <Camera className="size-5 ml-1" /> تغییر عکس کاور
        </Button>

        <input
          ref={coverRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleCoverChange}
        />
      </div>

      {/* Avatar Section */}
      <div className="relative">
        <div className="absolute -top-6 -translate-y-1/2 right-16 flex flex-row-reverse items-center">
          <Avatar className="w-36 h-36">
            <Avatar.Image
              alt="Profile"
              src={
                profilePreview ||
                user?.avatar ||
                "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
              }
            />
            <Avatar.Fallback className="text-2xl">
              {user?.firstName?.[0] || user?.organizationName?.[0] || "U"}
            </Avatar.Fallback>
          </Avatar>

          <Button
            className="absolute bottom-0.5 right-0.5 w-12 h-12 flex items-center justify-center rounded-full"
            variant="primary"
            onClick={handleImageClick}
            isDisabled={isLoading}
          >
            <Camera size={18} />
          </Button>

          <input
            ref={imgRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleProfileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileMedia;
