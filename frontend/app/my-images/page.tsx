"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyImages, deleteImage, Image } from "../services/api";
import ImageList from "../components/ImageList";

export default function MyImagesPage() {
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const fetchMyImages = async (authToken: string) => {
    try {
      const response = await getMyImages(authToken);
      setImages(response.data);
      console.log(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải ảnh của bạn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      fetchMyImages(storedToken);
    }
  }, [router]);

  const handleDeleteImage = async (imageId: number) => {
    if (!token) return;

    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    try {
      await deleteImage(token, imageId);
      setImages(images.filter((img) => img.image_id !== imageId));
    } catch (err) {
      alert("Lỗi xóa ảnh");
    }
  };

  if (!token) {
    return <div>Đang tải...</div>;
  }

  if (loading) {
    return <div className="loading">Đang tải ảnh của bạn...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="my-images-page">
      <h1>Ảnh của tôi</h1>
      <div className="actions">
        <a href="/create-image" className="create-button">
          Tạo ảnh mới
        </a>
      </div>
      <ImageList images={images} token={token} onDelete={handleDeleteImage} />
      {/* Có thể thêm nút xóa cho mỗi ảnh trong ImageCard */}
    </div>
  );
}
