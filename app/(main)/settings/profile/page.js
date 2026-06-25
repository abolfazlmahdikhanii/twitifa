"use client";
import ProfileForm from "@/components/Profile/ProfileForm";
import ProfileMedia from "@/components/Profile/ProfileMedia";
import Icon from "@/components/ui/Icon/Icon";
import AccountType from "@/components/ui/main/AccountType";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { useAuth } from "@/context/AuthContext";
import userProfileSchema from "@/validators/profile";
import { Button, ScrollShadow, Spinner } from "@heroui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";

const ProfileSettingPage = () => {
  const { user, refetch } = useAuth();
  const [hasChange, setHasChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("personal");
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedNation, setSelectedNation] = useState("IR");
  const [location, setLocation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [bio, setBio] = useState("");
  const [occupation, setOccupation] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  const imgRef = useRef(null);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const coverRef = useRef(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    if (user) {
      const time = setTimeout(() => {
        setType(user.accountType || "personal");
        setSelectedDate(user.birthDate || null);
        setSelectedNation(user.nationality || "IR");
        setLocation(user.location || "");
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setOrganizationName(user.organizationName || "");
        setBio(user.bio || "");
        setOccupation(user.occupation || "");
        setWebsite(user.website || "");
        setAddress(user.address || "");
        setGender(user.gender || "");
      }, 0);

      return () => clearTimeout(time);
    }
  }, [user]);

  const handleProfileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("لطفاً فقط فایل تصویری انتخاب کنید");
        if (e.currentTarget) e.currentTarget.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("اندازه فایل باید کمتر از ۵ مگابایت باشد");
        if (e.currentTarget) e.currentTarget.value = "";
        return;
      }

      setProfileFile(file);
      setHasChange(true);

      if (profilePreview) URL.revokeObjectURL(profilePreview);
      setProfilePreview(URL.createObjectURL(file));

      if (e.currentTarget) e.currentTarget.value = "";
    },
    [profilePreview],
  );

  const handleImageClick = () => {
    imgRef.current?.click();
  };

  const handleCoverChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("لطفاً فقط فایل تصویری برای کاور انتخاب کنید");
        if (e.currentTarget) e.currentTarget.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("اندازه فایل کاور باید کمتر از ۵ مگابایت باشد");
        if (e.currentTarget) e.currentTarget.value = "";
        return;
      }

      setCoverFile(file);
      setHasChange(true);

      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(URL.createObjectURL(file));

      if (e.currentTarget) e.currentTarget.value = "";
    },
    [coverPreview],
  );

  const handleCoverClick = () => {
    coverRef.current?.click();
  };

  const uploadProfilePicture = async () => {
    try {
      if (!profileFile) return false;
      const formData = new FormData();
      formData.append("image", profileFile);

      const res = await fetch("/api/user/upload/profile-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) return true;
      else throw new Error(data.message || "خطا در آپلود عکس پروفایل");
    } catch (error) {
      throw error;
    }
  };

  const uploadCoverPicture = async () => {
    try {
      if (!coverFile) return false;
      const formData = new FormData();
      formData.append("image", coverFile);

      const res = await fetch("/api/user/upload/cover", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) return true;
      else throw new Error(data.message || "خطا در آپلود عکس کاور");
    } catch (error) {
      throw error;
    }
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userInfo = {
        accountType: type,
        bio,
        location,
        occupation,
        website,
        address,
        gender,
        birthDate: selectedDate,
        nationality: selectedNation,
      };

      if (type === "personal") {
        userInfo.firstName = firstName;
        userInfo.lastName = lastName;
      } else {
        userInfo.organizationName = organizationName;
      }

      const isValid = userProfileSchema.safeParse(userInfo);
      if (!isValid.success) {
        const zodError = z.flattenError(isValid.error);
        Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
          messages.forEach((message) => toast.error(message));
        });
        return;
      }

      const infoRes = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (!infoRes.ok) {
        const errorData = await infoRes.json();
        throw new Error(errorData.message || "خطا در بروزرسانی اطلاعات");
      }

      if (profileFile) {
        try {
          await uploadProfilePicture();
        } catch (imageError) {
          toast.warning(
            "اطلاعات ذخیره شد اما خطایی در آپلود عکس پروفایل رخ داد!",
          );
          console.error(imageError);
        }
      }

      if (coverFile) {
        try {
          await uploadCoverPicture();
        } catch (coverError) {
          toast.warning("اطلاعات ذخیره شد اما خطایی در آپلود عکس کاور رخ داد!");
          console.error(coverError);
        }
      }

      toast.success("پروفایل با موفقیت بروزرسانی شد");
      setHasChange(false);

      setProfileFile(null);
      setProfilePreview(null);
      setCoverFile(null);
      setCoverPreview(null);

      if (refetch) await refetch();
    } catch (error) {
      console.log(error);
      toast.error(error.message || "خطا در بروزرسانی اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={"ویرایش نمایه"}/>
      <ScrollShadow className="max-h-[79vh]" hideScrollBar>
        <main className="w-[88%] mx-auto">
          <ProfileMedia
            handleCoverClick={handleCoverClick}
            coverPreview={coverPreview}
            user={user}
            coverRef={coverRef}
            handleCoverChange={handleCoverChange}
            profilePreview={profilePreview}
            handleImageClick={handleImageClick}
            isLoading={isLoading}
            imgRef={imgRef}
            handleProfileChange={handleProfileChange}
          />

          {/* Form Contents */}
          <div className="mt-26">
            <AccountType
              setType={(type) => {
                setType(type);
                setHasChange(true);
              }}
              defaultType={type || user?.accountType}
            />
          </div>

          <ProfileForm
            type={type}
            firstName={firstName}
            setFirstName={setFirstName}
            setHasChange={setHasChange}
            lastName={lastName}
            setLastName={setLastName}
            organizationName={organizationName}
            setOrganizationName={setOrganizationName}
            bio={bio}
            setBio={setBio}
            location={location}
            setLocation={setLocation}
            selectedNation={selectedNation}
            setSelectedNation={setSelectedNation}
            setIsOpenDatePicker={setIsOpenDatePicker}
            selectedDate={selectedDate}
            isOpenDatePicker={isOpenDatePicker}
            setSelectedDate={setSelectedDate}
            setGender={setGender}
            occupation={occupation}
            setOccupation={setOccupation}
            website={website}
            setWebsite={setWebsite}
            address={address}
            setAddress={setAddress}
            gender={gender}
          />
        </main>
      </ScrollShadow>

      {/* Submit Button */}
      <div className="flex justify-end py-4 mt-4 sm:border-t sm:border-t-[#34344E] sm:px-13 fixed bottom-20 left-5 sm:static">
        <Button
          size="lg"
          className="h-13 py-3 text-lg font-bold px-10 hidden sm:block"
          isDisabled={!hasChange || isLoading}
          onClick={updateProfileHandler}
        >
          ذخیره تغییرات
          {isLoading ? (
            <Spinner color="current" className="mr-1" />
          ) : (
            <Icon name="save" className={"mr-1"} size={30} />
          )}
        </Button>
        {hasChange && (
          <Button
            size="lg"
            className="w-12 h-12  sm:hidden flex items-center justify-center"
            isIconOnly
            isDisabled={!hasChange || isLoading}
            onClick={updateProfileHandler}
          >
            {isLoading ? (
              <Spinner color="current" />
            ) : (
              <Icon name="save" size={30} />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingPage;
