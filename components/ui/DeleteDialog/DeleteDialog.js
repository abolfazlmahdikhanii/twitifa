"use client";
import { AlertDialog, Button } from "@heroui/react";
import React from "react";

const DeleteDialog = ({ isOpen, setIsOpen, title, dis, onDelete }) => {

  if (!isOpen) return null;

  return (
    <AlertDialog>
      <AlertDialog.Backdrop
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        variant="blur"
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-md bg-[#1E1E2E] ">
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading className="text-lg font-semibold mt-0.5 mb-1.5">
                {title}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm leading-[1.7] dark:text-neutral-400 text-neutral-500 mb-.5">
                {dis}
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button className={"w-18"} slot="close" variant="danger" onClick={onDelete}>
                حذف
              </Button>
              <Button
                slot="close"
                variant="tertiary"
        
              >
                انصراف
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default DeleteDialog;
