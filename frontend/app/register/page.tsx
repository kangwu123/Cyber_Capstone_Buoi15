"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "../components/forms/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    router.push("/login");
  };

  return (
    <div className="auth-page">
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      <p>
        Đã có tài khoản? <a href="/login">Đăng nhập</a>
      </p>
    </div>
  );
}
