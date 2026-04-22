import { useState } from "react";
import { register, RegisterRequest } from "../../services/api";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    fullName: "",
    age: undefined,
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      onRegisterSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-form">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="fullName">Tên đầy đủ:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Tuổi:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age?.toString() || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Ảnh đại diện (URL):</label>
          <input
            type="url"
            id="avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
