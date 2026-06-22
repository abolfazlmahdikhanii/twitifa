"use client";
import { Button, Modal, RadioGroup } from "@heroui/react";
import { AtSign, Earth, UserCheck } from "lucide-react";
import { useState } from "react";
import ReplyTypeItem from "../ui/main/ReplyTypeItem";
const ReplyTypeModal = ({
  type,
  setType,
  isEdit = false,
  onUpdate,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = isEdit ? externalIsOpen : internalOpen;
  const setIsOpen = isEdit ? externalSetIsOpen : setInternalOpen;
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      {!isEdit && (
        <Button variant="ghost" className={"text-[#6366F1] gap-x-2.5"}>
          <Earth /> همه میتوانند پاسخ دهند
        </Button>
      )}
      <Modal.Backdrop isDismissable={true} variant="blur">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md bg-[#1E1E2E] border border-[#34344E]">
            <Modal.Header>
              <Modal.Heading className="text-lg font-semibold">
                چه کسانی میتوانند پاسخ دهند؟
              </Modal.Heading>
              <p className="text-sm leading-[1.7] dark:text-neutral-400 text-neutral-500">
                مشخص کنید چه کسانی میتوانند به این پست پاسخ دهند.هرکسی که منشن
                شود همیشه میتواند پاسخ دهد
              </p>
            </Modal.Header>

            <Modal.Body className="space-y-10 ">
              <RadioGroup
                name="plan-controlled"
                value={type}
                onChange={setType}
                className={"h-auto"}
              >
                <ReplyTypeItem
                  val={"all"}
                  icon={<Earth size={21} />}
                  title={"همه"}
                />
                <ReplyTypeItem
                  val={"following"}
                  icon={<UserCheck size={21} />}
                  title={"افرادی که دنبال میکنید"}
                />
                <ReplyTypeItem
                  val={"mention"}
                  icon={<AtSign size={21} />}
                  title={"فقط افرادی که منشن شده اند"}
                />
              </RadioGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button
                slot="close"
                className={"px-5.5 "}
                onPress={() => {
                  isEdit && onUpdate?.();
                  setIsOpen(false);
                }}
              >
                ذخیره
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ReplyTypeModal;
