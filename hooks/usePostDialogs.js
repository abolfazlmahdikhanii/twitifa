import { useCallback, useState } from "react";

const usePostDialogs = () => {
  const [dialog, setDialog] = useState(null); // 'delete' | 'edit' | 'quote' | 'reply'

  const openDialog = useCallback((type) => setDialog(type), []);
  const closeDialog = useCallback(() => setDialog(null), []);

  return { dialog, openDialog, closeDialog };
};
export default usePostDialogs;
