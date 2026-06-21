// hooks/useProfileLogic.js
import userProfileSchema from "@/validators/profile";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import useFileHandler from "./useFileHandler";

export default function useProfileLogic(user, refetch) {
  const profileImage = useFileHandler(5);
  const coverImage = useFileHandler(5);

  const [hasChange, setHasChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("personal");
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedNation, setSelectedNation] = useState("IR");

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    bio: "",
    location: "",
    occupation: "",
    website: "",
    address: "",
    gender: "",
  });

  useEffect(() => {
    if (user) {
      const time = setTimeout(() => {
        setType(user.accountType || "personal");
        setSelectedDate(user.birthDate || null);
        setSelectedNation(user.nationality || "IR");
        setFields({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          organizationName: user.organizationName || "",
          bio: user.bio || "",
          location: user.location || "",
          occupation: user.occupation || "",
          website: user.website || "",
          address: user.address || "",
          gender: user.gender || "",
        });
      }, 0);
      return () => clearTimeout(time);
    }
  }, [user]);

  const setField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setHasChange(true);
  };

  const uploadFile = async (file, endpoint) => {
    if (!file) return;
    const formData = new FormData();
    formData.append(endpoint === "profile-image" ? "profile" : "cover", file);
    const res = await fetch(`/api/users/upload/${endpoint}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "خطا در آپلود");
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const userInfo = {
        accountType: type,
        ...fields,
        birthDate: selectedDate,
        nationality: selectedNation,
      };

      const isValid = userProfileSchema.safeParse(userInfo);
      if (!isValid.success) {
        const zodError = z.flattenError(isValid.error);
        Object.entries(zodError.fieldErrors).forEach(([, messages]) =>
          messages.forEach((msg) => toast.error(msg)),
        );
        return;
      }

      const infoRes = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (!infoRes.ok) {
        const err = await infoRes.json();
        throw new Error(err.message || "خطا در بروزرسانی اطلاعات");
      }

      if (profileImage.file) {
        try {
          await uploadFile(profileImage.file, "profile-image");
        } catch {
          toast.warning("اطلاعات ذخیره شد اما خطا در آپلود عکس پروفایل");
        }
      }

      if (coverImage.file) {
        try {
          await uploadFile(coverImage.file, "cover-image");
        } catch {
          toast.warning("اطلاعات ذخیره شد اما خطا در آپلود عکس کاور");
        }
      }

      toast.success("پروفایل با موفقیت بروزرسانی شد");
      setHasChange(false);
      profileImage.reset();
      coverImage.reset();
      if (refetch) await refetch();
    } catch (error) {
      toast.error(error.message || "خطا در بروزرسانی اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    hasChange,
    type,
    setType,
    setHasChange,
    isOpenDatePicker,
    setIsOpenDatePicker,
    selectedDate,
    setSelectedDate,
    selectedNation,
    setSelectedNation,
    fields,
    setField,
    profileImage,
    coverImage,
    updateProfileHandler,
  };
}
