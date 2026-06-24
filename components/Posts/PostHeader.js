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

  // آواتار: روی موبایل کوچکتر — pr-12 sm:pr-16
  const avatarOffset = selfReply
    ? "pr-20 sm:pr-28"
    : "pr-12 sm:pr-16";

  const repostOffset = selfReply
    ? "pr-20 sm:pr-28"   // ردیف بازنشر زیر آواتار
    : "pr-14 sm:pr-18";

  const threadLine = selfReply ? "top-11" : "top-16 sm:top-20";

  return (
    <div className="flex items-center gap-x-3 sm:gap-x-4.5 w-full">
      <div className="w-full min-w-0">
        <div className="flex items-center justify-between w-full mt-2">
          <div className="min-w-0 flex-1">
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
                className={`flex items-center gap-x-1.5 text-muted text-xs sm:text-sm ${avatarOffset} font-bold ${replyHeader ? "mb-3" : "mb-0.5"}`}
              >
                <Icon name="pin" className="size-3.5 sm:size-4 shrink-0 fill-muted" />
                <p>سنجاق شد</p>
              </div>
            )}

            {/* reply header */}
            {isShowReplyHeader && replyHeader && (
              <div className={`flex items-center gap-x-2 text-muted text-xs sm:text-sm ${avatarOffset} mb-0.5 font-bold`}>
                <Icon name="reply-header" className="size-3.5 sm:size-4 shrink-0 fill-muted" />
                <p className="truncate">{replyHeader}</p>
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
            <div ref={btnRef} className="mr-1 sm:mr-2 shrink-0">
              {isPostOwner ? (
                <Dropdown key={dialog || showChangeReply ? "active" : "normal"}>
                  <Button variant="ghost" isIconOnly>
                    <Icon name="more-horizontal" className="size-4 sm:size-4.5" />
                  </Button>
                  <Dropdown.Popover className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-54 sm:w-60">
                    <Dropdown.Menu dir="rtl" onAction={handleDropdownAction}>
                      <Dropdown.Item
                        id="delete-post"
                        textValue="Delete post"
                        variant="danger"
                      >
                        <Icon name="delete-fill" className="size-4.5 sm:size-5 shrink-0 text-danger" />
                        <Label className="whitespace-nowrap text-xs sm:text-sm">حذف پست</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="edit-post" textValue="edit post">
                        <Icon name="edit" className="size-4.5 sm:size-5 shrink-0 text-muted" />
                        <Label className="whitespace-nowrap text-xs sm:text-sm">ویرایش</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="change-replies" textValue="Change reply">
                        <Icon name="reply-permission" className="size-4 sm:size-4.5 shrink-0 text-muted" />
                        <Label className="whitespace-nowrap text-xs sm:text-sm">تغییر افراد پاسخ دهنده</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="pin-post" textValue="pin post">
                        <Icon name="pin" className="size-4 sm:size-4.5 shrink-0 text-muted" />
                        <Label className="whitespace-nowrap text-xs sm:text-sm">{!pin ? "سنجاق کردن" : "برداشتن سنجاق"}</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              ) : (
                <Dropdown>
                  <Button variant="ghost" isIconOnly>
                    <Icon name="more-horizontal" className="size-5 sm:size-6" />
                  </Button>
                  <Dropdown.Popover className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-52 sm:w-60">
                    <Dropdown.Menu dir="rtl" onAction={handleDropdownAction}>
                      <Dropdown.Item
                        id="follow-user"
                        textValue="follow"
                        isDisabled={followLoading}
                      >
                        {!follow?.isFollow ? (
                          <Icon name="follow" className="size-4.5 sm:size-5 shrink-0 text-muted" />
                        ) : (
                          <Icon name="unfollow" className="size-4.5 sm:size-5 shrink-0 text-muted" />
                        )}
                        <Label className="whitespace-nowrap text-xs sm:text-sm">
                          {follow?.isFollow ? "لغو" : ""} دنبال کردن{" "}
                          <span dir="ltr" className="text-sm">@{post.author?.username}</span>
                        </Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="block-user" textValue="block">
                        <Icon name="block" className="size-4.5 sm:size-4.75 shrink-0 text-muted" />
                        <Label className="whitespace-nowrap text-xs sm:text-sm">
                          مسدود سازی{" "}
                          <span dir="ltr" className="text-sm">@{post.author?.username}</span>
                        </Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="report-post" textValue="report post">
                        <Icon name="report" className="size-4.5 sm:size-5 shrink-0 text-muted" />
                        <Label className="whitespace-nowrap text-xs sm:text-sm">گزارش تخلف در محتوا</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              )}
            </div>
          )}
        </div>

        {/* thread line */}
        {post.isReply && !post.lastReply && (
          <div
            className={`w-0.5 h-full bg-[#34344E] grow absolute ${threadLine} right-7 sm:right-15 bottom-0 last-of-type:hidden`}
          ></div>
        )}

        {/* content */}
        <div className={`mt-1.5 ${avatarOffset} relative`}>
          <div
            className={`text-neutral-200 text-[15px] sm:text-lg leading-loose pl-4 sm:pl-6.5 pr-2 sm:pr-3.5 ${!isMore ? "line-clamp-4" : ""}`}
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
              className="mt-3 sm:mt-3.5 px-4 sm:px-5 mr-1 sm:mr-2"
              onClick={() => setIsMore(true)}
            >
              نمایش بیشتر{" "}
              <Icon name="more-horizontal" className="size-5 sm:size-6" />
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
    <div className="flex items-center gap-x-1.5 sm:gap-x-2 text-muted text-xs sm:text-sm pr-14 sm:pr-18 mb-0.5">
      <Icon name="repost" className="size-4 sm:size-4.5 shrink-0" />
      <HoverProfile userInfo={author}>
        <p className="cursor-pointer truncate">
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