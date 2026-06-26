"use client";
import { Avatar, Button, Spinner } from "@heroui/react";
import { Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ReplyTypeModal from "./ReplyTypeModal";

import usePostAction from "@/hooks/usePostAction";
import {
  checkMediaType,
  generatePosterFromVideo,
  getVideoDuration,
} from "@/utils/post";
import { useQueryClient } from "@tanstack/react-query";
import { Extension } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PollForm from "../Polls/PollForm";

import { useAuth } from "@/context/AuthContext";
import Icon from "../ui/Icon/Icon";
import MediaGallery from "../ui/Media/MediaGallery/MediaGallery";
const MediaGalleryMemo = React.memo(MediaGallery);

const HashtagMention = Extension.create({
  name: "hashtagMention",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("hashtagMention"),
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations = [];
            doc.descendants((node, pos) => {
              if (!node.isText) return;
              const regex = /([@#])([\w\u0600-\u06FF]+)/g;
              let match;
              while ((match = regex.exec(node.text)) !== null) {
                const start = pos + match.index;
                const end = start + match[0].length;
                decorations.push(
                  Decoration.inline(start, end, {
                    class: "text-blue-400",
                  }),
                );
              }
            });
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

const PostBox = ({
  isModal = false,
  isEdit = false,
  initialData,
  onClose,
  isQuote = false,
  isReply = false,
  pId,
  author = null,
  children,
  replyingTo = null,
  repliedUser,
  clearReplyTo,
}) => {
  const { repostHandler, replyHandler } = usePostAction(
    pId,
    null,
    author && author.username,
    author && "posts",
    isReply,
  );

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const textareaRef = useRef(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const [postType, setPostType] = useState("text");
  const [postId, setPostId] = useState(null);
  const [replyType, setReplyType] = useState("all");
  const [content, setContent] = useState("");
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [pollData, setPollData] = useState(null);
  const [hasPoll, setHasPoll] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [mediaDuration, setMediaDuration] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      HashtagMention,
      Placeholder.configure({
        placeholder: hasPoll
          ? "سوالی بپرسید یا موضوعی را مطرح کنید..."
          : !isReply
            ? "چه خبر؟"
            : "پاسخ خود را ارسال کنید",
      }),
    ],
    content: isEdit ? initialData?.textContent || "" : "",

    editorProps: {
      attributes: {
        class: `text-sm sm:text-lg ${!isEdit ? "min-h-12" : "min-h-26 "} ${isModal ? "text-white" : ""} pr-1 pt-0.5 bg-transparent focus:outline-none text-lg leading-[1.8] outline-none`,
        dir: "auto",
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();

      setIsEmpty(text.trim() === "");
    },
  });

  useEffect(() => {
    if (!isEdit || !initialData || !editor) return;

    const timer = setTimeout(() => {
      editor.commands.setContent(initialData.textContent || "");
      setPollData(initialData.poll || null);
      setHasPoll(!!initialData?.poll);
      setPostId(initialData._id || null);
    }, 0);

    return () => clearTimeout(timer);
  }, [isEdit, initialData, editor]);
  useEffect(() => {
    if (editor) {
      editor.extensionManager.extensions
        .find((ext) => ext.name === "placeholder")
        ?.configure({
          placeholder: hasPoll
            ? "سوالی بپرسید یا موضوعی را مطرح کنید..."
            : !isReply
              ? "چه خبر؟"
              : "پاسخ خود را ارسال کنید",
        });
    }
  }, [hasPoll, isReply, editor]);
  const getText = () => editor?.getText() || "";
  const getContent = () => editor?.getHTML() || "";

  const resetForm = () => {
    editor?.commands.clearContent();
    setPollData(null);
    setHasPoll(false);
    setMediaUrl([]); 
    setMediaType(null);
    setPostId(null);
    onClose && onClose()
  };
  const changeMediaFile = useCallback(async (e, isVideo = false) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    for (const file of files) {
      const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024;

      if (file.size > maxSize) {
        toast.error(
          `اندازه فایل باید کمتر از ${isVideo ? "10" : "5"} مگابایت باشد`,
        );

        return;
      }
      let duration = 0;
      if (isVideo) {
        try {
          duration = await getVideoDuration(file);
        } catch (error) {
          console.error("Error getting duration:", error);
        }
      }

      setMediaUrl((prev) => [
        ...prev,
        {
          file,
          id: crypto.randomUUID(),
          mediaType: checkMediaType(file.type),
          duration: isVideo ? duration : undefined,
        },
      ]);
      setMediaType(checkMediaType(file.type));
    }

    if (e.currentTarget) e.currentTarget.value = "";
  }, []);

  const uploadImage = async (postID) => {
    try {
      if (!mediaUrl.length || mediaType !== "image") return false;
      const formData = new FormData();
      formData.append("postID", postID);
      for (const file of mediaUrl) {
        formData.append("image", file.file);
      }
      const res = await fetch("/api/posts/upload/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data.message);
        setMediaUrl([]);
        setMediaType("");
        return true;
      } else {
        throw new Error(data.message || "خطا در اپلود پست");
      }
    } catch (error) {
      toast.error(error || "خطا در اپلود پست");
      return false;
    }
  };
  const uploadVideo = async (postID) => {
    try {
      if (!mediaUrl.length || mediaType !== "video") return false;
      const formData = new FormData();
      formData.append("postID", postID);
      for (const file of mediaUrl) {
        formData.append("video", file.file);
        formData.append("duration", file.duration);
        // create poster
        const posterBlob = await generatePosterFromVideo(file.file);
        formData.append("poster", posterBlob.blob, `poster-${Date.now()}.webp`);
      }

      const res = await fetch("/api/posts/upload/video", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data.message);
        setMediaUrl([]);
        setMediaType("");
        return true;
      } else {
        throw new Error(data.message || "خطا در اپلود پست");
      }
    } catch (error) {
      // toast.error(error || "خطا در اپلود پست");
      console.log(error);
      return false;
    }
  };
  const removePost = async (postId) => {
    try {
      if (!postId) {
        return;
      }
      await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
    } catch (error) {
      toast.error(error.message || "خطا در حذف پست ");
    }
  };
  const createPoll = async (postId) => {
    try {
      if (!postId) {
        return;
      }
      const newPoll = {
        ...pollData,
        postId,
      };

      const pollRes = await fetch("/api/posts/poll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPoll),
      });
      const pollResData = await pollRes.json();
      if (pollRes.status !== 200) {
        await removePost(postId);
        throw new Error(pollResData.message || "خطا در ایجاد نظرسنجی");
      }
    } catch (error) {
      toast.error(error.message || "خطا در ایجاد نظرسنجی");
    }
  };
  const createPost = async (e) => {
    // e.preventDefault();
    const text = getText();
    const content = getContent();
    if (!text.trim()) {
      toast.error("برای ایجاد پست متنی وارد کنید");
      return;
    }

    if (hasPoll) {
      if (!pollData || !pollData.options || pollData.options.length < 2) {
        toast.error("حداقل 2 گزینه برای نظرسنجی وارد کنید");
        return;
      }
      if (!pollData.duration) {
        toast.error("مدت زمان نظرسنجی را انتخاب کنید");
        return;
      }
    }
    setIsLoading(true);
    const loadingToast = toast.loading("در حال ایجاد پست...");
    try {
      const newPost = {
        textContent: content,
        replyType,
        // postType,
      };

      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
      const postData = await postRes.json();
      if (postRes.status === 200) {
        // make poll
        if (hasPoll && postData.post && postData.post._id) {
          await createPoll(postData.post._id);
        }
        if (mediaUrl.length && postData.post && postData.post._id) {
          if (mediaType === "image") {
            await uploadImage(postData.post._id);
          }
          if (mediaType === "video") {
            await uploadVideo(postData.post._id);
          }
        }
        toast.success(" پست با موفقیت ایجاد شد", { id: loadingToast });
        setIsLoading(false);
        // reset form
        onClose && onClose();
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        author &&
          queryClient.invalidateQueries({
            queryKey: ["user-posts", author?.username],
          });
        resetForm();
      } else {
        throw new Error(postData.message || "خطا در ایجاد پست");
      }
    } catch (error) {
      toast.error(error.message || "خطا در ایجاد پست", { id: loadingToast });
      setIsLoading(false);
    }
  };
  const updatePost = async (e) => {
    e.preventDefault();
    const text = getText();
    const content = getContent();

    if (pollData || hasPoll) {
      toast.error(
        "نظرسنجی را نمی‌توان ویرایش کرد. برای تغییر نظرسنجی، پست را حذف و مجددا ایجاد کنید",
      );
      return;
    }

    if (mediaUrl.length > 0) {
      toast.error(
        "پست‌های دارای رسانه را نمی‌توان ویرایش کرد. برای تغییر رسانه، پست را حذف و مجددا ایجاد کنید",
      );
      return;
    }

    if (!text.trim()) {
      toast.error("برای ویرایش پست متنی وارد کنید");
      return;
    }

    setIsLoading(true);
    try {
      const newPost = {
        textContent: content,
      };

      const postRes = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
      const postData = await postRes.json();

      if (postRes.status === 200) {
        toast.success("پست با موفقیت ویرایش شد");
        onClose && onClose();
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        author &&
          queryClient.invalidateQueries({
            queryKey: ["user-posts", author?.username],
          });
      } else {
        throw new Error(postData.message || "خطا در ویرایش پست");
      }
    } catch (error) {
      toast.error(error.message || "خطا در ویرایش پست");
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = async (e) => {
    const content = getContent();
    if (isEdit) {
      await updatePost(e);
    } else if (isQuote) {
      await repostHandler(content);
      resetForm();
    } else if (isReply) {
      await replyHandler(content, replyingTo);
      clearReplyTo?.();
      resetForm();
    } else {
      await createPost(e);
    }
  };
  const getBtnText = () => {
    if (isReply) return "پاسخ";
    else if (isEdit) return "ویرایش";
    else return "ثبت";
  };
  const removeSelectedMedia = (id) => {
    const newMedias = [...mediaUrl];
    const filteredMedia = newMedias.filter((item) => item.id !== id);

    setMediaUrl(filteredMedia);
    if (!filteredMedia.length) setMediaType("");
  };
  const handleImageClick = async () => {
    setIsImageLoading(true);

    // Trigger file dialog
    imgRef.current?.click();

    document.body.style.pointerEvents = "none";

    imgRef.current?.addEventListener(
      "change",
      () => {
        setIsImageLoading(false);
        document.body.style.pointerEvents = "auto";
      },
      { once: true },
    );

    // Fallback timeout
    setTimeout(() => {
      setIsImageLoading(false);
      document.body.style.pointerEvents = "auto";
    }, 2000);
  };
  const handleVideoClick = async () => {
    setIsVideoLoading(true);

    // Trigger file dialog
    videoRef.current?.click();

    document.body.style.pointerEvents = "none";

    videoRef.current?.addEventListener(
      "change",
      () => {
        setIsVideoLoading(false);
        document.body.style.pointerEvents = "auto";
      },
      { once: true },
    );

    // Fallback timeout
    setTimeout(() => {
      setIsVideoLoading(false);
      document.body.style.pointerEvents = "auto";
    }, 2000);
  };
  const mediaButtonClass =
    "text-[#6366F1] mt-2 sm:mt-3 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6.5 sm:[&>svg]:h-6.5 px-3 sm:px-5.5 py-3 sm:py-5.5";

  return (
    <div
      className={`${
        !isModal
          ? "border-b border-neutral-200 dark:border-[#374151] px-1 sm:px-9 py-4 sm:py-5.5"
          : "px-1 sm:px-3"
      } ${isReply ? "px-1 sm:px-11" : ""}`}
    >
      <div className=" flex items-center gap-x-2.5 ">
        <div className="self-start relative">
          <Avatar size="md">
            <Avatar.Image
              alt={`${user?.username} avatar`}
              src={
                user?.avatar ||
                "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
              }
            />
            <Avatar.Fallback className="uppercase">
              {user?.username.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
        </div>
        <div
          className={`${!isModal ? "border-b border-neutral-200 dark:border-[#374151]" : ""} pb-1.5 sm:pb-4 flex-1 min-w-0`}
        >
          <div className={`${!isEdit || !isReply ? "mb-2 sm:mb-3" : ""}`}>
            <div
              className={`${!isEdit || !isReply ? "min-h-12" : "min-h-26"} relative`}
            >
              <EditorContent editor={editor} />
            </div>
            {hasPoll && (
              <PollForm
                onPollDataChange={setPollData}
                onRemovePoll={() => {
                  setPollData(null);
                  setHasPoll(false);
                }}
              />
            )}
            {mediaUrl.length > 0 && (
              <MediaGalleryMemo
                medias={mediaUrl}
                onRemove={removeSelectedMedia}
                isPreview={true}
              />
            )}
          </div>

          {!isEdit && !isReply && (
            <ReplyTypeModal type={replyType} setType={setReplyType} />
          )}
        </div>
      </div>
      {isQuote && children}

      <div
        className={`${
          !isModal
            ? "pr-3 sm:pr-9"
            : "pr-1 sm:pr-2 border-t border-neutral-200 dark:border-[#374151] pt-3 sm:pt-4"
        } flex items-center justify-between mt-2 sm:mt-3`}
      >
        <div className="flex items-center gap-x-1 sm:gap-x-3.5">
          <Button
            isIconOnly
            variant="ghost"
            className={mediaButtonClass}
            onPress={() => {
              handleImageClick();
            }}
            isDisabled={
              hasPoll || mediaType === "video" || mediaUrl.length >= 4
            }
            isPending={isImageLoading}
          >
            {isImageLoading ? (
              <Loader2 className=" animate-spin" />
            ) : (
              <Icon name="image" strokeWidth={2.25} />
            )}
          </Button>
          <input
            ref={imgRef}
            type="file"
            className="hidden "
            accept="image/*"
            onChange={changeMediaFile}
            multiple
          />
          <Button
            isIconOnly
            variant="ghost"
            className={mediaButtonClass}
            isDisabled={
              hasPoll || mediaType === "image" || mediaUrl.length >= 1
            }
            isPending={isVideoLoading}
            onPress={() => handleVideoClick()}
          >
            {isVideoLoading ? (
              <Loader2 className=" animate-spin" />
            ) : (
              <Icon name="globe" strokeWidth={2.25} />
            )}{" "}
          </Button>
          <input
            ref={videoRef}
            type="file"
            className="hidden "
            accept="video/*"
            onChange={(e) => changeMediaFile(e, true)}
            multiple
          />
          <Button
            isIconOnly
            variant="ghost"
            className={mediaButtonClass}
            isDisabled={hasPoll}
            onPress={() => setHasPoll(true)}
          >
            <Icon name="checklist" strokeWidth={2.25} />
          </Button>
          <Button isIconOnly variant="ghost" className={mediaButtonClass}>
            <Icon name="emoji-happy" strokeWidth={2.25} />
          </Button>
        </div>

        <div
          className={`${isReply ? "flex items-center justify-end w-full" : ""}`}
        >
          <Button
            className="px-6 sm:px-7 py-2 sm:py-3 text-sm sm:text-base font-bold h-9 sm:h-auto"
            size="lg"
            onPress={submitForm}
            isDisabled={isEmpty || isLoading}
          >
            {getBtnText()}{" "}
            {isLoading && <Spinner size="sm" color="currentColor" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
