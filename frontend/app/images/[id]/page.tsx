"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getImageDetail,
  getComments,
  Image,
  Comment,
  getImageUrl,
} from "../../services/api";
import CommentsList from "../../components/CommentsList";
import CreateCommentForm from "../../components/forms/CreateCommentForm";
import SaveButton from "../../components/SaveButton";

export default function ImageDetailPage() {
  const params = useParams();
  const imageId = Number(params.id);

  const [image, setImage] = useState<Image | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    fetchImageDetail();
    fetchComments();
  }, [imageId]);

  const fetchImageDetail = async () => {
    try {
      const response = await getImageDetail(imageId);
      setImage(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải chi tiết ảnh");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(imageId);
      setComments(response.data);
    } catch (err) {
      console.error("Lỗi tải bình luận:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentCreated = () => {
    fetchComments();
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error || !image) {
    return <div className="error">Lỗi: {error || "Ảnh không tồn tại"}</div>;
  }

  return (
    <div className="image-detail-page">
      <div className="image-detail">
        <img
          src={getImageUrl(image.path)}
          alt={image.image_name}
          className="image-detail__img"
        />
        <div className="image-detail__info">
          <h1>{image.image_name}</h1>
          {image.description && <p className="description">{image.description}</p>}
          <div className="author">
            <img
              src={
                image.user.avatar
                  ? getImageUrl(image.user.avatar)
                  : "/default-avatar.png"
              }
              alt={image.user.username}
              className="author-avatar"
            />
            <span>{image.user.username}</span>
          </div>
          {token && <SaveButton token={token} imageId={imageId} />}
        </div>
      </div>

      <div className="comments-section">
        <h2 className="comments-heading">Bình luận</h2>
        <CommentsList comments={comments} />
        <div className="comment-form-area">
          {token ? (
            <CreateCommentForm
              token={token}
              imageId={imageId}
              onCommentCreated={handleCommentCreated}
            />
          ) : (
            <div className="comment-login-prompt">
              <p>Bạn cần đăng nhập để viết bình luận.</p>
              <textarea
                className="comment-disabled-textarea"
                placeholder="Đăng nhập để bình luận"
                disabled
              />
              <a href="/login" className="login-link">
                Đăng nhập ngay
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
