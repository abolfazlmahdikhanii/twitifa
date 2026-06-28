"use client";
import { AlertDialog, Button } from "@heroui/react";

const Dialog = ({
  isOpen,
  setIsOpen,
  title,
  dis,
  onSubmit,
  btnText = "حذف",
}) => {
  if (!isOpen) return null;

  return (
    <AlertDialog>
      <AlertDialog.Backdrop
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        variant="blur"
      >
        <AlertDialog.Container className={"p-0"}>
          <AlertDialog.Dialog className="sm:max-w-md bg-[#1E1E2E] rounded-b-none sm:rounded-b-4xl ">
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
              <Button
                className={"w-18"}
                slot="close"
                variant="danger"
                onPress={onSubmit}
              >
                {btnText}
              </Button>
              <Button slot="close" variant="tertiary">
                انصراف
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default Dialog;
