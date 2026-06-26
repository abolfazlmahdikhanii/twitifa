import PostInfoPage from "@/components/PostInfoPage/PostInfoPage";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getPostInfo } from "@/services/postInfoService";
import { verifyToken } from "@/utils/auth";
import { getAuthorName, getReplyHeader, stripHtml } from "@/utils/post";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const page = async ({ params }) => {
  const { postID } = await params;

  if (!isValidObjectId(postID)) {
    return notFound();
  }

  await connectToDB();


  const currentUser =await getCurrentUser()

  const post = await postsModel
    .findOne({ isDeleted: false, _id: postID })
    .populate(
      "author",
      "_id username email accountType organizationName firstName lastName",
    )
    .populate("media", "-mediaId -userId")
    .populate("poll")
    .populate("likesCount")
    .populate("postLikes", "userId")
    .populate("repostsCount")
    .populate("ReplyCount")
    .populate("viewCount")
    .populate({
      path: "retweetedFrom",
      populate: [
        {
          path: "author",
          select:
            "_id username firstName lastName email accountType organizationName",
        },
        { path: "media", select: "-mediaId -userId" },
      ],
    })
    .lean({ virtuals: true });

  if (!post) {
    return notFound();
  }
  const userReposts = currentUser
    ? await postsModel
        .find({
          author: currentUser._id,
          retweetedFrom: { $in: postID },
          quoteContent: null,
          isDeleted: false,
        })
        .select("retweetedFrom")
        .lean()
    : [];

  const userRepostSet = new Set(
    userReposts.map((repost) => String(repost.retweetedFrom)),
  );

  const buildMeta = (post) => ({
    ...post,
    replyHeader:
      currentUser && currentUser?.username === post.author?.username
        ? "شما پاسخ دادید"
        : getAuthorName(post.author),
    repliedUser: post.replyToPost ? getReplyHeader(post) : null,
    isReposted: !!post.retweetedFrom && !post.quoteContent,
    isQuoteRepost: !!post.retweetedFrom && !!post.quoteContent,
    hasVote: currentUser
      ? (post.poll?.options?.some((option) =>
          option.votedBy?.some((id) => String(id) === String(currentUser._id)),
        ) ?? false)
      : false,
    isLiked: currentUser
      ? post.postLikes?.some(
          (like) => String(like.userId) === String(currentUser._id),
        )
      : false,
    isUserLogin: !!currentUser,
    isOwner: currentUser
      ? String(post.author._id) === String(currentUser._id)
      : false,

    totalVote: post.poll
      ? post.poll.options?.reduce((prev, curr) => prev + curr.votes, 0)
      : 0,
    isExpired: post.poll ? post.poll.duration <= new Date().getTime() : true,
    votedOption: currentUser
      ? post.poll?.options.find((option) =>
          option.votedBy?.some((id) => String(id) === String(currentUser._id)),
        )
      : false,
    isUserReposted:
      currentUser && !post.retweetedFrom
        ? userRepostSet.has(String(post._id))
        : false,

    postLikes: undefined,
  });

  const postInfoWithMeta = buildMeta(post);
  const posts = await getPostInfo(postID, currentUser);

  return (
    <div>
      <PageHeader title="پست" />
      <PostInfoPage
        initialPosts={JSON.parse(JSON.stringify(posts))}
        mainPost={JSON.parse(JSON.stringify(postInfoWithMeta))}
        postId={postID}
      />
    </div>
  );
};

export default page;




export async function generateMetadata({ params }) {
  const { postID } = await params;

  if (!isValidObjectId(postID)) {
    return { title: "Post Not Found" };
  }

  await connectToDB();

  const post = await postsModel
    .findOne({ isDeleted: false, _id: postID })
    .populate(
      "author",
      "_id username email accountType organizationName firstName lastName",
    );

  if (!post) {
    return { title: "Post Not Found" };
  }

  const cleanText = stripHtml(post.textContent);
  const title = `${getAuthorName(post.author)} on Twitify: ${cleanText}`;

  return {
    title,
    openGraph: { title },
  };
}
