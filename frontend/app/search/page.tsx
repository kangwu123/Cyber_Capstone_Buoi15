"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchImages, Image } from "../services/api";
import SearchForm from "../components/SearchForm";
import ImageList from "../components/ImageList";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    console.log("handleSearch called with query:", searchQuery);

    if (!searchQuery.trim()) {
      console.warn("handleSearch aborted: empty query");
      setImages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("handleSearch calling searchImages with:", searchQuery);
      const response = await searchImages(searchQuery);
      console.log("handleSearch response:", response);

      const imagesData = response.data?.items ?? [];
      console.log("handleSearch setting images:", imagesData);
      setImages(imagesData);
    } catch (err) {
      console.error("handleSearch error:", err);
      setError(err instanceof Error ? err.message : "Lỗi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  return (
    <div className="search-page">
      <h1>Tìm kiếm ảnh</h1>
      <SearchForm onSearch={handleSearch} initialQuery={query} />

      {loading && <div className="loading">Đang tìm kiếm...</div>}

      {error && <div className="error">Lỗi: {error}</div>}

      {!loading && !error && (
        <div>
          {query ? (
            <>
              <p>Kết quả cho: &quot;{query}&quot;</p>
              <ImageList images={images} token={token} />
            </>
          ) : (
            <p className="no-images">Nhập từ khóa để bắt đầu tìm kiếm.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}
