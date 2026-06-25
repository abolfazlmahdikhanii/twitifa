"use client";
import { Button, Description, Input, Label, Modal } from "@heroui/react";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import userProfileSchema from "@/validators/profile";
import { toast } from "sonner";
import z from "zod";
import AccountType from "../ui/main/AccountType";
import Icon from "../ui/Icon/Icon";

const CompleteInfoModal = () => {
  const { refetch } = useAuth();
  const [accountType, setAccountType] = useState("personal");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [isShowModal, setIsShowModal] = useState(true);

  const submitUserInfo = async (e) => {
    e.preventDefault();
    try {
      const userInfo = { accountType };

      if (accountType === "personal") {
        if (!firstName.trim() || !lastName.trim()) {
          toast.error("لطفا تمامی فیلد هارا تکمیل کنید");
          return;
        }
        userInfo.firstName = firstName;
        userInfo.lastName = lastName;
      }

      if (accountType === "legal") {
        if (!organizationName.trim()) {
          toast.error("لطفا تمامی فیلد هارا تکمیل کنید");
          return;
        }
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

      const infoRes = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (infoRes.status === 201) {
        toast.success("اطلاعات با موفقیت ثبت شد");
        setIsShowModal(false);
        refetch();
      } else {
        const errorData = await infoRes.json();
        throw new Error(errorData.message || "خطا در ثبت اطلاعات");
      }
    } catch (error) {
      toast.error(error.message || "خطا در ثبت اطلاعات");
    }
  };

  const inputClass =
    "bg-[#191933] border border-[#34344E] h-11.5 md:h-13 rounded-3xl w-full text-sm sm:text-base";

  return (
    <Modal isOpen={isShowModal}>
      <Modal.Backdrop variant="blur">
        <Modal.Container className="p-0" placement="center">
          <Modal.Dialog className="sm:max-w-xl bg-body  ">

            {/* Header */}
            <Modal.Header className="mt-1 sm:mt-2 px-4 sm:px-6">
              <Modal.Heading className="text-lg sm:text-xl font-bold text-center">
                به تویتیفای خوش آمدید
              </Modal.Heading>
              <Description className="text-xs sm:text-sm leading-[1.7] text-center mt-1">
                لطفا اطلاعات زیر را تکمیل کنید تا بتوانید از تمامی امکانات
                استفاده کنید
              </Description>
            </Modal.Header>

            {/* Body */}
            <Modal.Body className="px-3 sm:px-4 pt-3 sm:pt-5 pb-3 sm:pb-5 space-y-5 sm:space-y-8">
              <div className="mt-1 sm:mt-2">
                <AccountType
                  accountType={accountType}
                  setType={setAccountType}
                />
              </div>

              {accountType === "personal" ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-6 sm:gap-x-4">
                  <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
                    <Label htmlFor="input-name" className="text-[13px] sm:text-base">
                      نام
                    </Label>
                    <Input
                      id="input-name"
                      placeholder="نام را وارد کنید"
                      type="text"
                      className={inputClass}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
                    <Label htmlFor="input-lastname" className="text-[13px] sm:text-base">
                      نام خانوادگی
                    </Label>
                    <Input
                      id="input-lastname"
                      placeholder="نام خانوادگی را وارد کنید"
                      type="text"
                      className={inputClass}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
                  <Label htmlFor="input-organize" className="text-sm sm:text-base">
                    نام شرکت یا سازمان
                  </Label>
                  <Input
                    id="input-organize"
                    placeholder="نام شرکت یا سازمان را وارد کنید"
                    type="text"
                    className={inputClass}
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
              )}
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="flex flex-col gap-y-4 sm:gap-y-7 pb-2 px-4 sm:px-6">
              <Button
                slot="close"
                className="px-5 sm:px-7 h-10 sm:h-13 w-full text-sm sm:text-base"
                onClick={submitUserInfo}
              >
                ثبت و ادامه
                <Icon name="chevron-left" className="inline-block w-4 h-4 sm:w-6 sm:h-6" />
              </Button>
              <Description className="text-center text-xs sm:text-sm">
                با ثبت اطلاعات شما با{" "}
                <span className="text-[#6366F1]">قوانین و مقررات </span>
                تویتیفای موافقت میکنید.
              </Description>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CompleteInfoModal;