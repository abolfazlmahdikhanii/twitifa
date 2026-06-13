"use client";
import React, { useState } from "react";
import PostModal from "./PostModal";
import PostBox from "../main/PostBox";
import ReplyTypeModal from "../main/ReplyTypeModal";
import DeleteDialog from "../ui/DeleteDialog/DeleteDialog";
import usePostAction from "@/hooks/usePostAction";
import QuoteCard from "../ui/QuoteCard/QuoteCard";
import { useAuth } from "@/context/AuthContext";

const PostDialogs = ({
  dialog,
  setDialog,
  post,
  isAuthenticated,
  isOwner,
  showChangeReply,
  setShowChangeReply,
  isUserPage,
  currentPage,
  isReply,
  textContent,
  replySettings,
}) => {
  const { updateReplyType } = usePostAction(
    post._id,
    null,
    isUserPage ? post.author.username : null,
    post.currentPage,
    isReply,
  );
  const {user}=useAuth()
  const [replyType, setReplyType] = useState(replySettings || "all");

  const content = textContent();
const isPostOwner=user?.username === post.author.username || post.isOwner;
  return (
    <>
      {isAuthenticated && isPostOwner && dialog === "delete" && (
        <div>
          <DeletePost
            isOpen={dialog === "delete"}
            setIsOpen={setDialog}
            postId={post._id}
            isUserPage={isUserPage}
            currentPage={post.currentPage}
            username={post.author.username}
            isReply={post.isReply}
          />
        </div>
      )}
      {isAuthenticated && isPostOwner && dialog === "edit" && (
        <div>
          <PostModal
            isOpen={dialog === "edit"}
            setIsOpen={setDialog}
            postId={post._id}
            isEdit={dialog === "edit"}
          >
            <PostBox
              isModal
              isEdit
              author={isUserPage ? post.author : null}
              initialData={{
                poll: post.poll,
                textContent: content,
                _id: post._id,
                media: post.media,
                isOwner:isPostOwner,
              }}
              onClose={setDialog}
            />
          </PostModal>
        </div>
      )}
      {isAuthenticated && isPostOwner && showChangeReply && (
        <div>
          <ReplyTypeModal
            type={replyType}
            setType={setReplyType}
            onUpdate={() => updateReplyType(replyType)}
            isOpen={showChangeReply}
            setIsOpen={setShowChangeReply}
            isEdit
          />
        </div>
      )}
      {isAuthenticated && dialog === "quote" && (
        <div>
          <PostModal
            isOpen={dialog === "quote"}
            setIsOpen={setDialog}
            postId={post._id}
          >
            <PostBox
              isModal
              isQuote
              onClose={setDialog}
              pId={post._id}
              author={isUserPage ? post.author : null}
            >
              <QuoteCard post={post} content={textContent} />
            </PostBox>
          </PostModal>
        </div>
      )}
    </>
  );
};

export default PostDialogs;

const DeletePost = ({
  isOpen,
  setIsOpen,
  postId,
  username,
  isUserPage = false,
  currentPage = "posts",
  isReply,
}) => {
  const { removePost } = usePostAction(
    postId,
    setIsOpen,
    username,
    currentPage ? currentPage : "posts",
    isReply,
  );
  if (!isOpen) return null;

  return (
    <DeleteDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={"حذف پست"}
      dis={
        "این عمل قابل بازگشت نیست و از پروفایل شما، تایم‌لاین تمام حساب‌هایی که شما را دنبال می‌کنند و همچنین از نتایج جستجو حذف خواهد شد."
      }
      onDelete={removePost}
    />
  );
};
