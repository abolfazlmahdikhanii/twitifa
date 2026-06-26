import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInYears,
  formatDistanceToNow,
  intervalToDuration,
} from "date-fns";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
const crypto = require("crypto");

export const checkMediaType = (type) => {
  if (type.startsWith("image")) return "image";
  else if (type.startsWith("video")) return "video";
  else return "text";
};
export const formatTimeLeft = (duration) => {
  if (duration <= Date.now()) return "پایان یافته";

  return (
    formatDistanceToNow(new Date(duration), {
      locale: faIR,
    }) + " باقی‌مانده"
  );
};

export const formatTimeCreated = (time) => {
  if (!time) return;
  const date = new Date(time);
  const now = new Date();
  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);
  const years = differenceInYears(now, date);
  if (minutes < 1) return "الان";
  if (minutes < 60) return `${minutes} دقیقه قبل`;
  if (hours < 24) return `${hours} ساعت قبل`;
  // if (days < 7) return format(date, "EEEE", { locale: faIR });
  if (years < 1) return format(date, "d MMMM", { locale: faIR });
  return format(date, "d MMMM yyyy", { locale: faIR });
};

export const getHighlightedHTML = (html) => {
  if (!html) return;
  return html.replace(/([@#])([\w\u0600-\u06FF]+)/g, (match, symbol, word) => {
    return `<span class="text-blue-400 hover:underline">${match}</span>`;
  });
};

export const getPercent = (vote, total) => {
  if (!total) return 0;
  return Math.round((vote / total) * 100);
};

export const generateSessionFingerprint = ({ ip, ua, cookies }) => {
  return crypto
    .createHash("sha256")
    .update(`${cookies}-${ip}-${ua}-${(Date.now() / 60000) | 0}`)
    .digest("hex")
    .slice(0, 32);
};

export const generateDeviceFingerprint = ({ ip, ua, acceptLang }) => {
  return crypto
    .createHash("sha256")
    .update(`${ua}-${ip}-${acceptLang}`)
    .digest("hex")
    .slice(0, 32);
};

export const getReplyHeader = (post) => {
  if (!post.replyToPost) return null;

  const chain = [];
  let current = post.replyToPost;

  while (current && chain.length < 2) {
    chain.push(current);
    current = current.replyToPost;
  }

  const names = chain
    .slice(-2)
    .map((p) => ({
      username: p.author?.username || "کاربر",
      firstName: p.author?.firstName,
      lastName: p.author?.lastName,
      organizationName: p.author?.organizationName,
      accountType: p.author?.accountType,
    }))
    .filter((n) => n.username !== "کاربر");

  if (!names.length) return null;
  return { users: names };
};

export const getAuthorName = (author) => {
  return author?.accountType === "legal"
    ? author.organizationName
    : `${author?.firstName} ${author?.lastName}`;
};

export const generatePosterFromVideo = (videoFile) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const captureTime = 2;

    video.preload = "metadata";
    video.muted = true;
    video.crossOrigin = "anonymous";

    video.onloadedmetadata = () => {
      const targetWidth = 640;
      const targetHeight = (video.videoHeight / video.videoWidth) * targetWidth;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      video.currentTime = captureTime;
    };

    video.onseeked = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              blob: blob,
              url: URL.createObjectURL(blob),
              width: canvas.width,
              height: canvas.height,
            });
          } else {
            reject(new Error("خطا در ساخت پوستر"));
          }
        },
        "image/webp",
        0.8,
      );
    };

    video.onerror = () => reject(new Error("خطا در بارگذاری ویدیو"));

    video.src = URL.createObjectURL(videoFile);
  });
};
export const getVideoType = (url) => {
  const extension = url?.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    case "mov":
      return "video/quicktime";
    case "avi":
      return "video/x-msvideo";
    default:
      return "video/mp4"; // پیش‌فرض
  }
};

export const getBlurFromUrl = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 20;
      canvas.height = 20;
      canvas.getContext("2d").drawImage(img, 0, 0, 20, 20);
      resolve(canvas.toDataURL("image/jpeg", 0.3));
    };
  });
};

export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video metadata"));
    };
  });
};

export const formatVideoDuration = (time) => {
  if (isNaN(time)) return "00:00";
  // return format(time * 1000, "HH:mm:ss");
  const duration = intervalToDuration({ start: 0, end: time * 1000 });

  const hour = duration.hours || 0;
  const min = duration.minutes || 0;
  const sec = duration.seconds || 0;

  if (hour > 0) {
    return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};

export const formatFileSize = (bytes, locale = "fa-IR") => {
  if (bytes === 0) return "0 Bytes";
  if (isNaN(bytes)) return "0 Bytes";

  const k = 1024;
  const sizes = {
    "en-US": ["B", "KB", "MB", "GB"],
    "fa-IR": ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"],
  };
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  });

  return `${formatter.format(value)} ${sizes[locale]?.[i] || sizes["fa-IR"][i]}`;
};


export const formatPostViewNumber=(view)=>{
  if(!view)return
  return new Intl.NumberFormat("en",{
    compactDisplay:"short",
    maximumFractionDigits:1,
    notation:"compact"
  }).format(view)
}

export const stripHtml=(html)=> {
  return html?.replace(/<[^>]*>/g, "").trim() ?? "";
}