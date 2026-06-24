"use client";
import { useAuth } from "@/context/AuthContext";
import usePostAction from "@/hooks/usePostAction";
import { formatPostViewNumber } from "@/utils/post";
import { Button, Dropdown, Label } from "@heroui/react";
import Icon from "../ui/Icon/Icon";

const PostFooter = ({
  post,
  dialog,
  setDialog,
  likes,
  reposts,
  replyCount,
  views,
  onReplyClick,
  isOwner,
}) => {
  const { postLikeHandler, isLoading, repostHandler } = usePostAction(
    post._id,
    null,
    post.isUserPage ? post.author.username : null,
    post.currentPage,
    post.isReply,
  );
  const { user } = useAuth();

  return (
    <div className="w-full grid grid-cols-5 pr-1 sm:pr-2 gap-x-3 sm:gap-x-5">
      <div className=" ">
        <div className=" flex items-center  text-muted group w-fit cursor-pointer transition-all duration-300">
          <Button
            variant="ghost"
            className={`sm:[&>svg]:size-5 [&>svg]:size-4.5  text-muted group-hover:text-[#f91880] group-hover:bg-[#f91880]/20 transition-all duration-300 `}
            isIconOnly
            onPress={() =>
              postLikeHandler(
                post.author.username,
                post.isUserPage ? post.currentPage : "",
              )
            }
            isDisabled={isLoading}
            isPending={isLoading}
          >
            {!likes.isLiked ? (
              <Icon name="heart" className="text-current" />
            ) : (
              <Icon name="heart-fill" className="text-[#F91880]" />
            )}
          </Button>
          <span
            className={` text-xs sm:text-sm mt-0.75 -mr-px sm:mr-0 sm:mt-0 group-hover:text-[#f91880] transition-all duration-300 ${likes.isLiked ? "text-[#f91880]" : "text-muted"}`}
          >
            {likes?.likeCount ?? 0}
          </span>
        </div>
      </div>
      <div className=" ">
        <div className=" flex items-center  text-muted group w-fit cursor-pointer transition-all duration-300">
          <Button
            variant="ghost"
            className={
              " sm:[&>svg]:size-5 [&>svg]:size-4.5 text-muted group-hover:text-[#1d9bf0] group-hover:bg-[#1d9bf0]/20 transition-all duration-300"
            }
            isIconOnly
            onPress={() => {
              if (!post.isReply) setDialog("reply");
              else onReplyClick?.();
            }}
          >
            <Icon name="reply" />
          </Button>
          <span className="text-xs sm:text-sm mt-0.75 -mr-px sm:mr-0 sm:mt-0 group-hover:text-[#1d9bf0] transition-all duration-300">
            {replyCount ?? 0}
          </span>
        </div>
      </div>
      <div className=" ">
        <Dropdown>
          <div className=" flex items-center  text-muted group w-fit cursor-pointer transition-all duration-300">
            <Button
              variant="ghost"
              className={`sm:[&>svg]:size-5 [&>svg]:size-4.5 text-muted group-hover:text-[#00ba7b] group-hover:bg-[#00ba7b]/20 transition-all duration-300 
               `}
              isIconOnly
            >
              <Icon
                name="repost"
                className={`${reposts.isUserReposted ? "text-[#00ba7b]" : "text-current"}`}
              />
            </Button>
            <span
              className={` text-xs sm:text-sm mt-0.75 -mr-px sm:mr-0 sm:mt-0 group-hover:text-[#00ba7b] transition-all duration-300 ${reposts.isUserReposted ? "text-[#00ba7b]" : "text-muted"}`}
            >
              {reposts.repostCount ?? 0}
            </span>
          </div>

          <Dropdown.Popover
            className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-40 min-w-40"
            key={dialog === "quote" ? "quote" : "simple"}
          >
            <Dropdown.Menu>
              <Dropdown.Item
                id="reposts"
                textValue="Repost"
                onPress={() =>
                  repostHandler(
                    "",
                    post.author.username,
                    post.isUserPage ? post.currentPage : "",
                  )
                }
              >
                {!reposts.isUserReposted ? (
                  <Label>بازنشر</Label>
                ) : (
                  <Label>لغو بازنشر</Label>
                )}
              </Dropdown.Item>
              <Dropdown.Item
                id="repost-qoute"
                textValue="repost-qoute"
                onAction={() => setDialog("quote")}
              >
                <Label>نقل قول</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
      <div className=" ">
        <div className=" flex items-center  text-muted group w-fit cursor-pointer transition-all duration-300">
          <Button
            variant="ghost"
            className={
              "sm:[&>svg]:size-5 [&>svg]:size-4.5 text-muted group-hover:text-[#1d9bf0] group-hover:bg-[#1d9bf0]/20 transition-all duration-300"
            }
            isIconOnly
            onClick={() => {
              if (isOwner) setDialog("activity");
            }}
          >
            <Icon name="views" />
          </Button>
          <span className=" text-xs sm:text-sm mt-1.25 -mr-px sm:mr-0 sm:mt-1 group-hover:text-[#1d9bf0] transition-all duration-300 ">
            {views ? formatPostViewNumber(views) : 0}
          </span>
        </div>
      </div>
      <div className=" ">
        <div className=" flex items-center  text-muted group w-fit cursor-pointer transition-all duration-300">
          <Button
            variant="ghost"
            className={
              "sm:[&>svg]:size-5 [&>svg]:size-4.25 text-muted group-hover:text-[#1d9bf0] group-hover:bg-[#1d9bf0]/20 transition-all duration-300"
            }
            isIconOnly
          >
            <Icon name="share" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostFooter;
