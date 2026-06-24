"use client";
import { useAuth } from "@/context/AuthContext";
import usePostAction from "@/hooks/usePostAction";
import { Card, CardContent, CardFooter, CardHeader } from "@heroui/react";
import { useCallback, useMemo } from "react";
import QuoteCard from "../ui/QuoteCard/QuoteCard";
import ReplyModal from "../ui/ReplyModal/ReplyModal";
import PostContent from "./PostContent";
import PostDialogs from "./PostDialogs";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";

import usePostDialogs from "@/hooks/usePostDialogs";
import usePostInfo from "@/hooks/usePostInfo";
import { usePostView } from "@/hooks/usePostView";
import { getAuthorName } from "@/utils/post";
import { useRouter } from "next/navigation";
import PostInfoDate from "../ui/PostInfoDate/PostInfoDate";
import TrackingPixel from "../ui/TrackingPixel/TrackingPixel";
// import Image from "next/image";

const PostCard = ({
  post,
  isReply = false,
  isFirstReply = false,
  lastReply = false,
  replyHeader,
  isShowReplyHeader = false,
  isUserPage = false,
  currentPage = "",
  onReplyClick,
  isReplyModal = false,
  replyLevel = 1,
  isPostDetail = false,
}) => {
  const { likes, reposts, replies, pin, replySetting, views, replyCount } =
    usePostInfo(post?._id);
  const router = useRouter();
  const { showChangeReply, setShowChangeReply } = usePostAction(
    post?._id,
    null,
    isUserPage ? post.author?.username : null,
    currentPage,
  );
  const { trackClick, postRef } = usePostView(post._id);
  const { dialog, openDialog, closeDialog } = usePostDialogs();
  const { user } = useAuth();

  const isAuthenticated = !!(post.isUserLogin || user);

  const postData = useMemo(
    () => ({
      ...post,
      authorName: getAuthorName(post.author),
      displayAuthor: post.isReposted ? post.retweetedFrom?.author : post.author,
      currentPage,
      isReply,
      isFirstReply,
      lastReply,
      isUserPage,
      media: post.media?.length ? post.media : post.retweetedFrom?.media || [],
    }),
    [post, currentPage, isReply, isFirstReply, lastReply, isUserPage],
  );

  const getContent = useCallback(() => {
    if (post.isReposted) return post.retweetedFrom?.textContent;
    if (post.isQuoteRepost) return post.quoteContent;
    return post.textContent;
  }, [post]);

  const selfReply = isReply
    ? post.author?.username === post.replyToPost?.author?.username ||
      (!post.isParent &&
        post.directReplies?.some(
          (item) =>
            post.author?.username === item.replyToPost?.author?.username,
        ))
    : false;

  const gotoPostInfo = () => {
    router.push(`/${post.author.username}/status/${post._id}`);
  };

  return (
    <>
      <Card
        className={`bg-transparent px-2 sm:px-4 md:px-8 ${!isReplyModal ? "transition-all duration-200 hover:bg-[#121225]" : ""} ${!isReply ? "pb-4.5 pt-3.5 border-b" : `pb-11.5 ${isFirstReply ? "pt-3.5" : "-mt-6"}`} ${isReply && lastReply && !isReplyModal ? "border-b" : ""} rounded-none`}
        ref={postRef}
        onClick={() => {
          trackClick();
          gotoPostInfo();
        }}
      >
        <TrackingPixel postId={post._id} />

        <CardHeader>
          <PostHeader
            post={postData}
            dialog={dialog}
            setDialog={openDialog}
            showChangeReply={showChangeReply}
            setShowChangeReply={setShowChangeReply}
            replyHeader={replyHeader}
            isShowReplyHeader={isShowReplyHeader}
            repliedUser={post.repliedUser}
            textContent={() => getContent()}
            pin={pin ? pin.isPin : post.isPin}
            selfReply={selfReply}
            replyLevel={replyLevel}
            isReplyModal={isReplyModal}
            isPostDetail={isPostDetail}
          />
        </CardHeader>
        <CardContent className="pr-12 sm:pr-18">
          <PostContent
            {...postData}
            poll={
              !post.isQuoteRepost ? post.poll || post.retweetedFrom?.poll : null
            }
            isReplyModal={isReplyModal}
          />
        </CardContent>
        {post.isQuoteRepost && (
          <div className="pr-12 sm:pr-18 pl-2 sm:pl-4">
            <QuoteCard
              post={post}
              content={() => post.retweetedFrom?.textContent}
            />
          </div>
        )}
        {isPostDetail && (
          <PostInfoDate
            time={post.updatedAt}
            views={views?.viewsCount || post.viewCount}
          />
        )}
        {!isReplyModal ? (
          <CardFooter
            className={`${selfReply ? "pr-20 sm:pr-28" : "pr-12 sm:pr-16"} ${isPostDetail ? "mt-2.5" : "mt-6 sm:mt-8"}`}
          >
            <PostFooter
              post={postData}
              dialog={dialog}
              setDialog={openDialog}
              likes={{
                isLiked: likes?.isLiked || post.isLiked,
                likeCount: likes?.likeCount || post.likesCount,
              }}
              reposts={{
                isUserReposted: reposts?.isUserReposted || post.isUserReposted,
                repostCount: reposts?.repostCount || post.repostsCount,
              }}
              replyCount={replyCount}
              views={views?.viewsCount || post.viewCount}
              onReplyClick={onReplyClick}
              isOwner={post.isOwner}
            />
          </CardFooter>
        ) : null}
      </Card>

      <PostDialogs
        dialog={dialog}
        setDialog={closeDialog}
        post={postData}
        isAuthenticated={isAuthenticated}
        isOwner={post.isOwner}
        showChangeReply={showChangeReply}
        setShowChangeReply={setShowChangeReply}
        isUserPage={isUserPage}
        currentPage={currentPage}
        isReply={isReply}
        textContent={() => getContent()}
        replySettings={replySetting?.replySettings || post.replySettings}
        likeCount={likes?.likeCount || post.likesCount}
        repostCount={reposts?.repostCount || post.repostsCount}
        replyCount={replyCount}
        viewCount={views?.viewsCount || post.viewCount}
      />
      {dialog === "reply" && (
        <ReplyModal
          isOpen={true}
          setIsOpen={closeDialog}
          post={postData}
          isModal={true}
          isUserPage={isUserPage}
          currentPage={currentPage}
          replySettings={replySetting?.replySettings || post.replySettings}
          replyHeader={replyHeader}
          isShowReplyHeader={isShowReplyHeader}
        />
      )}
    </>
  );
};

export default PostCard;
