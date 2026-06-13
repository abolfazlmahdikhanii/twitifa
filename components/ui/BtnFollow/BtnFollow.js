"use client";
import { useAuth } from "@/context/AuthContext";
import useFollow from "@/hooks/useFollow";
import { Button, Spinner } from "@heroui/react";
import React, { useState } from "react";

const BtnFollow = ({
  username,
  isUserPage = false,
  isFollow = false,
}) => {
  const { user } = useAuth();

  const { followHandler, followLoading, follow } = useFollow(username, {
    fetchFollow: true,
    fetchFollowing: false,
    fetchFollower: false,
    fetchFollowCount: true,
    fetchSharedFollower: false,
  });
  const isFollowUser = follow?.isFollow ?? isFollow;
  if (user && user.username === username) return null;

  return (
    <>
      <Button
        className={`${isUserPage ? "h-11.5 px-6" : ""} ${followLoading ? "gap-x-1" : ""}`}
        variant={!isFollowUser ? "primary" : "tertiary"}
        onClick={(e) => {
          followHandler(e);
         
        }}
        isDisabled={followLoading}
        isPending={followLoading}
      >
        {!isFollowUser ? "دنبال کردن" : "دنبال شده"}{" "}
        {followLoading && <Spinner size="sm" color="current" />}
      </Button>
    </>
  );
};

export default BtnFollow;
