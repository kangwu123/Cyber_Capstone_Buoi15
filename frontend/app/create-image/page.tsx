"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateImageForm from "../components/forms/CreateImageForm";

export default function CreateImagePage() {
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

  const handleImageCreated = () => {
    alert("Tạo ảnh thành công!");
    router.push("/my-images");
  };

  if (!token) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="create-image-page">
      <CreateImageForm token={token} onImageCreated={handleImageCreated} />
    </div>
  );
}
