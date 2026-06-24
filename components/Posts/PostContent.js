import React from "react";
import PollVote from "../Polls/PollVote";
import PollCard from "../Polls/PollCard";
import MediaGallery from "../ui/Media/MediaGallery/MediaGallery";
import RepliedUsers from "../ui/RepliedUsers/RepliedUsers";

const PostContent = ({
  poll,
  media,
  hasVote,
  isUserLogin,
  totalVote,
  isExpired,
  isOwner,
  postId,
  votedOption,
  author,
  isReplyModal=false
}) => {
  
  if (poll) {
    if (!hasVote && isUserLogin && !isExpired && !isOwner) {
      return (
        <PollVote
          {...poll}
          isUserLogin={isUserLogin}
          totalVote={totalVote}
          isOwner={isOwner}
          postId={postId}
        />
      );
    }
    return (
      <PollCard
        {...poll}
        isUserLogin={isUserLogin}
        totalVote={totalVote}
        isOwner={isOwner}
        votedOption={votedOption}
      />
    );
  }
  if (!isReplyModal&&media && media.length > 0) {
    return <MediaGallery medias={media} author={author} />;
  }
  if(isReplyModal){
    return (
      <RepliedUsers repliedUser={{users:[author]}} selfReply={isOwner}/>
    )
  }

  return null;
};

export default PostContent;
