import { Avatar } from "@heroui/react";

const DEFAULT_AVATAR =
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg";

const PostHeader = ({ user }) => (
  <div className="self-start relative">
    <Avatar size="md">
      <Avatar.Image
        alt={`${user?.username} avatar`}
        src={user?.avatar || DEFAULT_AVATAR}
      />
      <Avatar.Fallback className="uppercase">
        {user?.username?.charAt(0) || "U"}
      </Avatar.Fallback>
    </Avatar>
  </div>
);

export default PostHeader;
