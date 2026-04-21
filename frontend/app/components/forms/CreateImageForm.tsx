import { useState } from "react";
import { createImage } from "../../services/api";

interface CreateImageFormProps {
  token: string;
  onImageCreated: () => void;
}

export default function CreateImageForm({
  token,
  onImageCreated,
}: CreateImageFormProps) {
  const [formData, setFormData] = useState({
    image_name: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Vui lòng chọn file ảnh");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image_name", formData.image_name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("file", file);

      await createImage(token, formDataToSend);
      setFormData({ image_name: "", description: "" });
      setFile(null);
      onImageCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo ảnh thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        setError("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File không được vượt quá 5MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  return (
    <div className="create-image-form">
      <h2>Tạo ảnh mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image_name">Tên hình:</label>
          <input
            type="text"
            id="image_name"
            name="image_name"
            value={formData.image_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Chọn ảnh:</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {file && <p>Đã chọn: {file.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo ảnh"}
        </button>
      </form>
    </div>
  );
}
