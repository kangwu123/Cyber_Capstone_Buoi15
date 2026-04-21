"use client";

import { useState, useEffect } from "react";
import ImageList from "./components/ImageList";
import { getImages, Image } from "./services/api";

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const fetchImages = async () => {
      try {
        const response = await getImages();
        setImages(response.data.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Đang tải danh sách ảnh...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Lỗi: {error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="home">
      <h1>Danh sách ảnh</h1>
      <ImageList images={images} token={token} />
    </div>
  );
}
