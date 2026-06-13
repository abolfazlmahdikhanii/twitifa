"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import HoverProfile from "../ui/Profile/HoverProfile";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import {
  Ban,
  Dot,
  Ellipsis,
  Flag,
  MessageCircle,
  PenLine,
  Pin,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import usePostAction from "@/hooks/usePostAction";
import {
  formatTimeCreated,
  getAuthorName,
  getHighlightedHTML,
} from "@/utils/post";
import Link from "next/link";
import useFollow from "@/hooks/useFollow";
import { useAuth } from "@/context/AuthContext";
import RepliedUsers from "../ui/RepliedUsers/RepliedUsers";

const PostHeader = ({
  post,
  dialog,
  setDialog,
  showChangeReply,
  setShowChangeReply,
  replyHeader,
  isShowReplyHeader,
  repliedUser,
  textContent,
  pin,
  isQuote,
  selfReply = false,
  isReplyModal=false,
  replyLevel = 1,
}) => {
  const { postPinHandler } = usePostAction(
    post._id,
    null,
    post.author?.username,
    post.currentPage,
  );
  const { follow, followHandler, followLoading } = useFollow(
    post.author.username,
    {
      fetchFollow: true,
      fetchFollowing: false,
      fetchFollower: false,
      fetchFollowCount: true,
    },
  );
  const { user } = useAuth();
  const [hasMore, setHasMore] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const btnRef = useRef(null);
  const contentRef = useRef(null);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkHeight = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setHasMore(el.scrollHeight > lineHeight * 4);
    };

    requestAnimationFrame(checkHeight);

    const resizeObserver = new ResizeObserver(checkHeight);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [textContent]);
  const displayUser =
    (post.isReposted && post.retweetedFrom) || post.isQuoteRepost
      ? post.retweetedFrom.author
      : post.author;
  const displayName =
    post.isReposted || post.isQuoteRepost
      ? getAuthorName(post.retweetedFrom?.author)
      : post.authorName;

  const isPostOwner = user?.username === post.author.username || post.isOwner;
  const username = displayUser?.username;
  const handleDropdownAction = useCallback(
    async (key) => {
      switch (key) {
        case "delete-post":
          setDialog("delete");
          break;
        case "edit-post":
          setDialog("edit");
          break;
        case "change-replies":
          setShowChangeReply(true);
          break;
        case "pin-post":
          await postPinHandler(
            post.author.username,
            post.isUserPage ? post.currentPage : "",
          );
          break;
        case "follow-user":
          followHandler();
          break;
      }
    },
    [
      setDialog,
      setShowChangeReply,
      postPinHandler,
      post.author.username,
      post.isUserPage,
      post.currentPage,
      followHandler,
    ],
  );

  return (
    <div className=" flex items-center gap-x-4.5 w-full">
      <div className="w-full">
        <div className="flex items-center justify-between w-full mt-2">
          <div>
            {post.isReposted && post.retweetedFrom && !post.isQuoteRepost && (
              <RepostHeader
                author={displayUser}
                retweetedFrom={post.retweetedFrom}
                authorName={displayName}
              />
            )}

            {/* pin */}
            {post.isUserPage && pin && (
              <div
                className={`flex items-center gap-x-1.5 text-muted text-sm ${selfReply ? "pr-28" : "pr-16"} font-bold ${replyHeader ? "mb-3" : "mb-0.5"}`}
              >
                <Pin className="size-4 shrink-0 fill-muted" />
                <p>سنجاق شد</p>
              </div>
            )}
            {/* reply header */}
            {isShowReplyHeader && replyHeader && (
              <div className="flex items-center gap-x-2 text-muted text-sm pr-16 mb-0.5 font-bold ">
                <svg
                  className="size-4 shrink-0 fill-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m14.046 2.242-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828a.85.85 0 0 0 .12.403.744.744 0 0 0 1.034.23c.264-.169 6.473-4.14 8.088-5.507 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788z"
                  ></path>
                </svg>
                <p>{replyHeader}</p>
              </div>
            )}
            {/* Author Info */}
            <AuthorInfo
              displayUser={displayUser}
              displayName={displayName}
              username={username}
              updatedAt={
                post.isReposted || post.isQuoteRepost
                  ? post.retweetedFrom.updatedAt
                  : post.updatedAt
              }
              author={post.author}
              selfReply={selfReply}
            />
            {post.isReply && !selfReply && repliedUser && (
              <RepliedUsers repliedUser={repliedUser} selfReply={selfReply} />
            )}
          </div>
          {/* dropdown */}
          {!isQuote&&!isReplyModal && (
            <div ref={btnRef}>
              {isPostOwner ? (
                <Dropdown key={dialog || showChangeReply ? "active" : "normal"}>
                  <Button variant="ghost" isIconOnly>
                    <Ellipsis />
                  </Button>
                  <Dropdown.Popover className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-60">
                    <Dropdown.Menu onAction={handleDropdownAction}>
                      <Dropdown.Item
                        id={`delete-post`}
                        textValue="Delete post"
                        variant="danger"
                      >
                        <Trash2 className="size-4 shrink-0 text-danger" />
                        <Label>حذف پست</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="edit-post" textValue="edit post">
                        <PenLine className="size-4 shrink-0 text-muted" />
                        <Label>ویرایش</Label>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="change-replies"
                        textValue="Change reply"
                      >
                        <MessageCircle className="size-4 shrink-0 text-muted" />
                        <Label>تغییر افراد پاسخ دهنده</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="pin-post" textValue="pin post">
                        <Pin className="size-4 shrink-0 text-muted" />
                        <Label>{!pin ? "سنجاق کردن" : "برداشتن سنجاق"}</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              ) : (
                <Dropdown>
                  <Button variant="ghost" isIconOnly>
                    <Ellipsis />
                  </Button>
                  <Dropdown.Popover className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-60">
                    <Dropdown.Menu onAction={handleDropdownAction}>
                      <Dropdown.Item
                        id="follow-user"
                        textValue="follow"
                        isDisabled={followLoading}
                      >
                        {!follow?.isFollow ? (
                          <UserPlus className="size-4 shrink-0 text-muted" />
                        ) : (
                          <UserMinus className="size-4 shrink-0 text-muted" />
                        )}
                        <Label>
                          {follow?.isFollow ? "لغو" : ""} دنبال کردن{" "}
                          <span dir="ltr">@{post.author?.username}</span>
                        </Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="block-user" textValue="block">
                        <Ban className="size-4 shrink-0 text-muted" />
                        <Label>
                          مسدود سازی{" "}
                          <span dir="ltr">@{post.author?.username}</span>
                        </Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="report-post" textValue="report post">
                        <Flag className="size-4 shrink-0 text-muted" />
                        <Label>گزارش تخلف در محتوا</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              )}
            </div>
          )}
        </div>
        {/* content */}
        {/* text */}

        {post.isReply  && !post.lastReply && (
          <div
            className={`w-0.5 h-full bg-[#34344E] grow absolute ${selfReply ? "top-11" : "top-20"} right-15 bottom-0 last-of-type:hidden`}
          ></div>
        )}
        <div className={`mt-1.5 ${selfReply ? "pr-28" : "pr-16"} relative`}>
          <div
            className={`text-neutral-200 text-lg leading-loose pl-6.5 pr-3.5 ${!isMore ? "line-clamp-4" : ""}`}
            ref={contentRef}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html:
                textContent &&
                DOMPurify.sanitize(getHighlightedHTML(textContent()), {
                  ALLOWED_TAGS: ["a", "br", "p", "span"],
                  ALLOWED_ATTR: ["href", "class"],
                }),
            }}
          ></div>

          {!isMore && hasMore && (
            <Button
              variant="tertiary"
              className={"mt-3.5 px-5 mr-2 "}
              onClick={() => setIsMore(true)}
            >
              نمایش بیشتر <Ellipsis />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostHeader;

const RepostHeader = ({ author, retweetedFrom, authorName }) => {
  return (
    <div className="flex items-center gap-x-2 text-muted text-sm pr-18 mb-0.5">
      <svg fill="none" viewBox="0 0 24 24" className="size-4.5">
        <path
          fill="currentColor"
          d="m4.5 3.88 4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5a4 4 0 0 1-4-4V7.55L1.432 9.48.068 8.02zM16.5 6H11V4h5.5a4 4 0 0 1 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2"
        ></path>
      </svg>
      <HoverProfile userInfo={author}>
        <p className="cursor-pointer">
          {" "}
          {retweetedFrom.author.username === author.username
            ? "شما "
            : authorName}
          {retweetedFrom.author._id.toString() === author._id.toString()
            ? "بازنشر کردید"
            : "بازنشر کرد"}
        </p>
      </HoverProfile>
    </div>
  );
};

const AuthorInfo = ({
  displayUser,
  displayName,
  username,
  updatedAt,
  selfReply,
}) => {
  return (
    <HoverProfile userInfo={displayUser}>
      <div className="flex items-center cursor-pointer relative">
        <div
          className={`self-start ml-4.5 ${selfReply ? "mr-11" : " "} relative`}
        >
          <Avatar className="size-14 relative z-1">
            <Avatar.Image
              src={
                displayUser?.avatar ||
                "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
              }
              alt={displayName}
            />
            <Avatar.Fallback className="uppercase">
              {username?.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
          {selfReply && (
            <div className="absolute w-0.5 -top-6 -right-4 bg-[#34344E] h-8 ">
              <div className="rounded-b-[20px] border-s-2 -bottom-8 absolute border-s-[#34344E] w-22 h-22 right-0"></div>
            </div>
          )}
        </div>
        <Link className="flex items-center" href={`/${username}`}>
          <span className="text-lg font-bold truncate">{displayName}</span>
          {!displayUser?.isVerified && (
            <Image
              src="/images/verified-business.png"
              alt="verified"
              width={20}
              height={20}
              className="object-cover size-5 shrink-0 mr-1.5 -mt-1.5"
            />
          )}
        </Link>
        <Link href={`/${username}`}>
          <span
            className="dark:text-neutral-400 text-neutral-500 mr-2.25  text-[16px] inline-block"
            dir="auto"
          >
            @{username}
          </span>
        </Link>
        <span className="mx-1 dark:text-neutral-400 text-neutral-500">
          <Dot size={16} />
        </span>
        <span className="dark:text-neutral-400 text-neutral-500  text-[15px]">
          {formatTimeCreated(updatedAt)}
        </span>
      </div>
    </HoverProfile>
  );
};
