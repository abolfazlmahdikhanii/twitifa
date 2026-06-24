"use client";
import ReplyContent from "@/components/ReplyContent/ReplyContent";
import { Modal } from "@heroui/react";

const ReplyModal = (props) => {
  return (
    <Modal>
      <Modal.Backdrop
        variant="blur"
        isOpen={props.isOpen}
        onOpenChange={props.setIsOpen}
      >
        <Modal.Container className={"p-0 "}>
          <Modal.Dialog className="sm:max-w-2xl bg-[#1A1A31] shadow-none rounded-b-none sm:rounded-b-4xl">
            <Modal.CloseTrigger className="size-7 z-4 " slot={"close"} />

            <Modal.Body className="pt-5 p-0  ">
              <ReplyContent {...props} isReplyModal={true} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ReplyModal;
