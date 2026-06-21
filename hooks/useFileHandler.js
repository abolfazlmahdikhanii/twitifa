
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function useFileHandler(maxSizeMB = 5) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);


  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("لطفاً فقط فایل تصویری انتخاب کنید");
      e.target.value = ""; 
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(`اندازه فایل باید کمتر از ${maxSizeMB} مگابایت باشد`);
      e.target.value = ""; 
      return;
    }

    setFile(selectedFile);
    if (preview) URL.revokeObjectURL(preview); 
    setPreview(URL.createObjectURL(selectedFile));
    
    e.target.value = ""; 
  };

  const reset = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  return { file, preview, inputRef, handleChange, reset };
}