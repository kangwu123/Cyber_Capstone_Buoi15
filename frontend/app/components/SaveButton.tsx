import { useState, useEffect } from "react";
import {
  checkIfSaved,
  saveImage,
  unsaveImage,
  SaveImageRequest,
} from "../services/api";

interface SaveButtonProps {
  token: string;
  imageId: number;
  onSaveChange?: () => void;
}

export default function SaveButton({
  token,
  imageId,
  onSaveChange,
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const response = await checkIfSaved(token, imageId);
        setIsSaved(response.data.saved);
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái lưu:", err);
      }
    };

    checkSaved();
  }, [token, imageId]);

  const handleToggleSave = async () => {
    setLoading(true);
    try {
      if (isSaved) {
        await unsaveImage(token, imageId);
        setIsSaved(false);
      } else {
        await saveImage(token, { image_id: imageId });
        setIsSaved(true);
      }
      onSaveChange?.();
    } catch (err) {
      console.error("Lỗi lưu ảnh:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`save-button ${isSaved ? "saved" : ""}`}
      onClick={handleToggleSave}
      disabled={loading}>
      {loading ? "..." : isSaved ? "❤️ Đã lưu" : "🤍 Lưu"}
    </button>
  );
}
