"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@heroui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PostFooter from "./PostFooter";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import PostDialogs from "./PostDialogs";
import usePostAction from "@/hooks/usePostAction";
import QuoteCard from "../ui/QuoteCard/QuoteCard";
import ReplyModal from "../ui/ReplyModal/ReplyModal";
import { useQuery } from "@tanstack/react-query";

import usePostInfo from "@/hooks/usePostInfo";
import { usePostView } from "@/hooks/usePostView";
import { getAuthorName } from "@/utils/post";
import TrackingPixel from "../ui/TrackingPixel/TrackingPixel";
import usePostDialogs from "@/hooks/usePostDialogs";
// import Image from "next/image";

const PostCard = ({
  // textContent,
  // author,
  // poll,
  // media,
  // hasVote,
  // isOwner,
  // isUserLogin,
  // totalVote,
  // isExpired,
  // updatedAt,
  // votedOption,
  // replySettings,
  // likesCount,
  // isLiked,
  // isReposted,
  // isQuoteRepost,
  // retweetedFrom,
  // quoteContent,
  // repostsCount,
  // isUserReposted,
  // isReply,
  // ReplyCount,
  // isFirstReply,
  // _id,
  // isPin,
  // isUserPage = false,
  // currentPage = "",
  // viewCount,
  // lastReply = false,
  // replyHeader,
  // isShowReplyHeader,
  // repliedUser,
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
}) => {
  const { likes, reposts, replies, pin, replySetting, views, replyCount } =
    usePostInfo(post?._id);

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
      media: post.media || [],
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

  return (
    <>
      <Card
        className={`bg-transparent px-8   ${!isReply ? "pb-4.5  pt-3.5  border-b" : `pb-11.5 ${isFirstReply ? "pt-3.5" : "-mt-6"} `} ${isReply && lastReply && !isReplyModal ? "border-b" : ""}  rounded-none`}
        ref={postRef}
        onClick={trackClick}
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
          />
        </CardHeader>
        <CardContent className=" pr-18 ">
          <PostContent {...postData} isReplyModal={isReplyModal} />
        </CardContent>
        {post.isQuoteRepost && (
          <div className="pr-18 pl-4">
            <QuoteCard
              post={post}
              content={() => post.retweetedFrom?.textContent}
            />
          </div>
        )}
        {!isReplyModal ? (
          <CardFooter className={`${selfReply ? "pr-28" : "pr-16"} mt-8 `}>
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
