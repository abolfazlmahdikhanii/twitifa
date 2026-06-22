"use client";
import ProfileForm from "@/components/Profile/ProfileForm";
import ProfileMedia from "@/components/Profile/ProfileMedia";
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
      <PageHeader />
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
      <div className="flex justify-end py-4 mt-4 border-t border-t-[#34344E] px-13">
        <Button
          size="lg"
          className="h-13 py-3 text-lg font-bold px-10"
          isDisabled={!hasChange || isLoading}
          onClick={updateProfileHandler}
        >
          ذخیره تغییرات{" "}
          {isLoading ? (
            <Spinner color="current" className="mr-1" />
          ) : (
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              className="mr-1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7 8H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettingPage;
