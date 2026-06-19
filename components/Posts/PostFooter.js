"use client";
import { useAuth } from "@/context/AuthContext";
import usePostAction from "@/hooks/usePostAction";
import { formatPostViewNumber } from "@/utils/post";
import { Button, Dropdown, Label } from "@heroui/react";

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
    <div className={`w-full grid grid-cols-5 pr-2 gap-x-5`}>
      <div className=" ">
        <div className=" flex items-center  text-muted group w-fit cursor-pointer transition-all duration-300">
          <Button
            variant="ghost"
            className={`[&>svg]:size-5 text-muted group-hover:text-[#f91880] group-hover:bg-[#f91880]/20 transition-all duration-300 `}
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
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <g>
                  <path
                    fill="currentColor"
                    d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                  ></path>
                </g>
              </svg>
            ) : (
              <svg fill="#F91880" viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                </g>
              </svg>
            )}
          </Button>
          <span
            className={` text-sm group-hover:text-[#f91880] transition-all duration-300 ${likes.isLiked ? "text-[#f91880]" : "text-muted"}`}
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
              "[&>svg]:size-5 text-muted group-hover:text-[#1d9bf0] group-hover:bg-[#1d9bf0]/20 transition-all duration-300"
            }
            isIconOnly
            onPress={() => {
              if (!post.isReply) setDialog("reply");
              else onReplyClick?.();
            }}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M2 10c0-4.42 3.584-8 8.005-8h4.366a8.13 8.13 0 0 1 8.129 8.13c0 2.96-1.607 5.68-4.196 7.11L10.25 21.7v-3.69h-.067A8.005 8.005 0 0 1 2 10m8.005-6a6.005 6.005 0 1 0 .133 12.01l.351-.01h1.761v2.3l5.087-2.81A6.127 6.127 0 0 0 14.371 4z"
              ></path>
            </svg>
          </Button>
          <span className=" text-sm group-hover:text-[#1d9bf0] transition-all duration-300">
            {replyCount ?? 0}
          </span>
        </div>
      </div>
      <div className=" ">
        <Dropdown>
          <div className=" flex items-center  text-muted group w-fit cursor-pointer transition-all duration-300">
            <Button
              variant="ghost"
              className={`[&>svg]:size-5 text-muted group-hover:text-[#00ba7b] group-hover:bg-[#00ba7b]/20 transition-all duration-300 
               `}
              isIconOnly
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className={`${reposts.isUserReposted ? "text-[#00ba7b]" : "text-current"}`}
              >
                <path
                  fill="currentColor"
                  d="m4.5 3.88 4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5a4 4 0 0 1-4-4V7.55L1.432 9.48.068 8.02zM16.5 6H11V4h5.5a4 4 0 0 1 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2"
                ></path>
              </svg>
            </Button>
            <span
              className={` text-sm group-hover:text-[#00ba7b] transition-all duration-300 ${reposts.isUserReposted ? "text-[#00ba7b]" : "text-muted"}`}
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
              "[&>svg]:size-5 text-muted group-hover:text-[#1d9bf0] group-hover:bg-[#1d9bf0]/20 transition-all duration-300"
            }
            isIconOnly
            onClick={() => {
              if (isOwner) setDialog("activity");
            }}
          >
            <svg fill="none" viewBox="0 0 20 20">
              <path
                fill="currentColor"
                d="M7.292 17.5v-15h1.666v15zm7.708 0V7.083h1.667V17.5zm-11.667 0 .004-8.333h1.666L5 17.5zm7.707 0v-5.833h1.667V17.5z"
              ></path>
            </svg>
          </Button>
          <span className=" text-sm group-hover:text-[#1d9bf0] transition-all duration-300 mt-1">
            {views ? formatPostViewNumber(views) : 0}
          </span>
        </div>
      </div>
      <div className=" ">
        <div className=" flex items-center  text-muted group w-fit cursor-pointer transition-all duration-300">
          <Button
            variant="ghost"
            className={
              "[&>svg]:size-5 text-muted group-hover:text-[#1d9bf0] group-hover:bg-[#1d9bf0]/20 transition-all duration-300"
            }
            isIconOnly
          >
            <svg fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M18.5 2a3.5 3.5 0 0 0-3.484 3.838L8.082 9.537a3.5 3.5 0 1 0 .153 4.548l6.752 3.635a3.5 3.5 0 1 0 .985-1.741l-6.986-3.761a3.6 3.6 0 0 0-.031-.88l6.822-3.639A3.5 3.5 0 1 0 18.5 2M17 5.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M5.5 10.4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11.4 8.1a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostFooter;
