"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSavedImages, Image } from "../services/api";
import ImageList from "../components/ImageList";

export default function SavedImagesPage() {
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const fetchSavedImages = async (authToken: string) => {
    console.log("fetchSavedImages called with token:", authToken);

    if (!authToken) {
      console.warn("fetchSavedImages aborted: no token");
      setError("Bạn cần đăng nhập");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("fetchSavedImages sending request with token:", authToken);
      const response = await getSavedImages(authToken);
      console.log("fetchSavedImages response status:", response.status);
      console.log("fetchSavedImages response body:", response);

      if (!response.status) {
        throw new Error(response.message || "API returned false status");
      }

      const imagesData = response.data ?? [];
      console.log("fetchSavedImages setting images:", imagesData);
      setImages(imagesData);
    } catch (err) {
      console.error("fetchSavedImages error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi tải ảnh đã lưu";

      if (
        errorMessage.includes("401") ||
        errorMessage.includes("Unauthorized")
      ) {
        console.warn("401 detected, clearing token and redirecting");
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("saved-images token:", storedToken);

    if (!storedToken) {
      console.warn("No token found, redirecting to login");
      router.replace("/login");
      return;
    }

    fetchSavedImages(storedToken);
  }, [router]);

  if (loading) {
    return <div className="loading">Đang tải ảnh đã lưu...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="saved-images-page">
      <h1>Ảnh đã lưu</h1>
      <ImageList images={images} token={token} />
    </div>
  );
}
