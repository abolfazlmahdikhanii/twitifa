"use client";
import { useAuth } from "@/context/AuthContext";
import useFollow from "@/hooks/useFollow";
import usePostAction from "@/hooks/usePostAction";
import { getAuthorName, getHighlightedHTML } from "@/utils/post";
import { Button, Dropdown, Label } from "@heroui/react";
import DOMPurify from "isomorphic-dompurify";
import { useCallback, useEffect, useRef, useState } from "react";
import AuthorInfo from "../ui/AuthorInfo/AuthorInfo";
import AuthorPostInfo from "../ui/AuthorPostInfo/AuthorPostInfo";
import HoverProfile from "../ui/Profile/HoverProfile";
import RepliedUsers from "../ui/RepliedUsers/RepliedUsers";
import Icon from "../ui/Icon/Icon";

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
  isReplyModal = false,
  replyLevel = 1,
  isPostDetail = false,
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
          <div className="">
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
                <Icon name="pin" className="size-4 shrink-0 fill-muted" />
                <p>سنجاق شد</p>
              </div>
            )}
            {/* reply header */}
            {isShowReplyHeader && replyHeader && (
              <div className="flex items-center gap-x-2 text-muted text-sm pr-16 mb-0.5 font-bold ">
                <Icon name="reply-header" className="size-4 shrink-0 fill-muted" />
                <p>{replyHeader}</p>
              </div>
            )}
            {/* Author Info */}
            {!isPostDetail ? (
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
            ) : (
              <AuthorPostInfo {...post.author} />
            )}
            {post.isReply && !selfReply && repliedUser && (
              <RepliedUsers repliedUser={repliedUser} selfReply={selfReply} />
            )}
          </div>
          {/* dropdown */}
          {!isQuote && !isReplyModal && (
            <div ref={btnRef} className="mr-2">
              {isPostOwner ? (
                <Dropdown key={dialog || showChangeReply ? "active" : "normal"}>
                   <Button variant="ghost" isIconOnly>
                     <Icon name="more-horizontal" className="size-4.5" />
                   </Button>
                   <Dropdown.Popover className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-60">
                     <Dropdown.Menu dir="rtl" onAction={handleDropdownAction}>
                       <Dropdown.Item
                         id={`delete-post`}
                        textValue="Delete post"
                        variant="danger"
                      >
                        <Icon name="delete-fill" className="size-5 shrink-0 text-danger" />

                        <Label>حذف پست</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="edit-post" textValue="edit post">
                        <Icon name="edit" className="size-5 shrink-0 text-muted" />

                        <Label>ویرایش</Label>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="change-replies"
                        textValue="Change reply"
                      >
                        <Icon name="reply-permission" className="size-4.5 shrink-0 text-muted" />

                        <Label>تغییر افراد پاسخ دهنده</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="pin-post" textValue="pin post">
                        <Icon name="pin" className="size-4.5 shrink-0 text-muted" />

                        <Label>{!pin ? "سنجاق کردن" : "برداشتن سنجاق"}</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              ) : (
                <Dropdown>
                   <Button variant="ghost" isIconOnly>
                     <Icon name="more-horizontal" className="size-6" />
                   </Button>
                   <Dropdown.Popover className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-60">
                     <Dropdown.Menu dir="rtl" onAction={handleDropdownAction}>
                       <Dropdown.Item
                         id="follow-user"
                        textValue="follow"
                        isDisabled={followLoading}
                      >
                        {!follow?.isFollow ? (
                          <Icon name="follow" className="size-5 shrink-0 text-muted" />
                        ) : (
                          <Icon name="unfollow" className="size-5 shrink-0 text-muted" />
                        )}
                        <Label>
                          {follow?.isFollow ? "لغو" : ""} دنبال کردن{" "}
                          <span dir="ltr">@{post.author?.username}</span>
                        </Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="block-user" textValue="block">
                        <Icon name="block" className="size-4.75 shrink-0 text-muted" />

                        <Label>
                          مسدود سازی{" "}
                          <span dir="ltr">@{post.author?.username}</span>
                        </Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="report-post" textValue="report post">
                        <Icon name="report" className="size-5 shrink-0 text-muted" />

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

        {post.isReply && !post.lastReply && (
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
              نمایش بیشتر{" "}
              <Icon name="more-horizontal" className="size-6" />
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
      <Icon name="repost" className="size-4.5" />
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
