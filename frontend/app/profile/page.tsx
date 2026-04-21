"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UpdateUserForm from "../components/forms/UpdateUserForm";

export default function ProfilePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleUpdateSuccess = () => {
    alert("Cập nhật thành công!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!token) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Thông tin cá nhân</h1>
      <UpdateUserForm token={token} onUpdateSuccess={handleUpdateSuccess} />
      <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
    </div>
  );
}
