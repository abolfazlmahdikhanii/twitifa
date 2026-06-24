"use client";
import React, { useEffect, useState } from "react";
import HoverProfile from "../ui/Profile/HoverProfile";
import PostBox from "../main/PostBox";
import PostCard from "../Posts/PostCard";
import RepliedUsers from "../ui/RepliedUsers/RepliedUsers";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const ReplyContent = (props) => {
  return (
    <div className="relative">
      <PostCard
        {...props}
        isFirstReply={true}
        isReply={true}
        isReplyModal={props.isReplyModal}
      />

      <PostBox
        isReply={true}
        isModal={props?.isModal}
        pId={props.post._id}
        author={props.isUserPage ? props.post.author : null}
       
      />
    </div>
  );
};

export default ReplyContent;
