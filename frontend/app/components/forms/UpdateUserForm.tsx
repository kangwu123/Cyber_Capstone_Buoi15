import { useState, useEffect } from "react";
import {
  updateUser,
  getCurrentUser,
  UpdateUserRequest,
  User,
} from "../../services/api";

interface UpdateUserFormProps {
  token: string;
  onUpdateSuccess: () => void;
}

export default function UpdateUserForm({
  token,
  onUpdateSuccess,
}: UpdateUserFormProps) {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    ho_ten: "",
    tuoi: undefined,
    anh_dai_dien: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser(token);
        const user = response.data;
        setFormData({
          ho_ten: user.ho_ten,
          tuoi: user.tuoi,
          anh_dai_dien: user.anh_dai_dien || "",
        });
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateUser(token, formData);
      onUpdateSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "tuoi" ? (value ? Number(value) : undefined) : value,
    });
  };

  if (fetchLoading) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <div className="update-user-form">
      <h2>Cập nhật thông tin</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ho_ten">Họ tên:</label>
          <input
            type="text"
            id="ho_ten"
            name="ho_ten"
            value={formData.ho_ten}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tuoi">Tuổi:</label>
          <input
            type="number"
            id="tuoi"
            name="tuoi"
            value={formData.tuoi || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="anh_dai_dien">Ảnh đại diện (URL):</label>
          <input
            type="url"
            id="anh_dai_dien"
            name="anh_dai_dien"
            value={formData.anh_dai_dien}
            onChange={handleChange}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
}
