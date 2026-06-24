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
      const userInfo = {
        accountType,
      };
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
          messages.forEach((message) => {
            toast.error(message);
          });
        });
        return;
      }

      // post data
      const infoRes = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log(error);
      toast.error(error.message || "خطا در ثبت اطلاعات");
    }
  };

  return (
    <Modal isOpen={isShowModal}>
      <Modal.Backdrop variant="blur">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-xl bg-body] border border-[#34344E]">
            <Modal.Header className="mt-2">
              <Modal.Heading className="text-xl font-bold text-center">
                به تویتیفای خوش آمدید
              </Modal.Heading>
              <Description className="text-sm leading-[1.7] text-center">
                لطفا اطلاعات زیر را تکمیل کنید تا بتوانید از تمامی امکانات
                استفاده کنید
              </Description>
            </Modal.Header>

            <Modal.Body className="px-3 pt-5  pb-5  space-y-8 ">
              <div className="mt-2">
                <div className=" mt-4">
                  <AccountType
                    accountType={accountType}
                    setType={setAccountType}
                  />
                </div>
              </div>
              {accountType === "personal" ? (
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="flex flex-col gap-2.5 w-full">
                    <Label htmlFor="input-name">نام</Label>

                    <Input
                      id="input-name"
                      placeholder="نام را وارد کنید"
                      type="text"
                      className="bg-[#191933] border border-[#34344E] h-11.5 md:h-13 rounded-3xl  w-full"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2.5 w-full">
                    <Label htmlFor="input-lastname">نام خانوادگی</Label>

                    <Input
                      id="input-lastname"
                      placeholder="نام خانوادگی را وارد کنید"
                      type="text"
                      className="bg-[#191933] border border-[#34344E] h-11.5 md:h-13 rounded-3xl w-full"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 w-full">
                  <Label htmlFor="input-organize">نام شرکت یا سازمان</Label>

                  <Input
                    id="input-organize"
                    placeholder="نام شرکت یا سازمان را وارد کنید"
                    type="text"
                    className="bg-[#191933] border border-[#34344E] h-11.5 md:h-12 rounded-full  w-full"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="flex flex-col gap-y-7 pb-2">
              <Button
                slot="close"
                className={"px-7 h-13 w-full "}
                onClick={submitUserInfo}
              >
                ثبت و ادامه{" "}
                <Icon name="chevron-left" className="inline-block w-6 h-6" />
              </Button>
              <Description className="text-center">
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
