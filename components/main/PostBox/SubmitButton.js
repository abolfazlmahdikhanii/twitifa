import { Button, Spinner } from "@heroui/react";

const SubmitButton = ({ isReply, isEdit, isLoading, isEmpty, submitForm }) => (
  <Button
    className="px-6 sm:px-7 py-2 sm:py-3 text-sm sm:text-base font-bold h-9 sm:h-auto"
    size="lg"
    onPress={submitForm}
    isDisabled={isEmpty || isLoading}
  >
    {isReply
      ? "پاسخ"
      : isEdit
        ? "ویرایش"
        : isLoading
          ? "در حال ارسال..."
          : "ثبت"}
    {isLoading && <Spinner size="sm" color="currentColor" />}
  </Button>
);

export default SubmitButton;
