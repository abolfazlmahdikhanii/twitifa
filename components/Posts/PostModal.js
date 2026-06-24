import { Button, Modal } from "@heroui/react";
import React from "react";
import PostBox from "../main/PostBox";

const PostModal = ({ isOpen, setIsOpen, children }) => {
 
  return (
    <Modal >
      <Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container  className={"p-0"} >
          <Modal.Dialog className="w-full sm:max-w-2xl bg-[#1E1E2E] shadow-none rounded-b-none sm:rounded-b-4xl" >
            <Modal.CloseTrigger />

            <Modal.Body className="pt-5 ">{children}</Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PostModal;
