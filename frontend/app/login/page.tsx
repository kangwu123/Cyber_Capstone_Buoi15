"use client";

import { useRouter } from "next/navigation";
import LoginForm from "../components/forms/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("token", token);
    router.push("/");
  };

  return (
    <div className="auth-page">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
      <p>
        Chưa có tài khoản? <a href="/register">Đăng ký</a>
      </p>
    </div>
  );
}
