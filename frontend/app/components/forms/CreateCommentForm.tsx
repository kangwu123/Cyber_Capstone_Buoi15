import { useState } from "react";
import { createComment, CreateCommentRequest } from "../../services/api";

interface CreateCommentFormProps {
  token: string;
  imageId: number;
  onCommentCreated: () => void;
}

export default function CreateCommentForm({
  token,
  imageId,
  onCommentCreated,
}: CreateCommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createComment(token, imageId, { content: content as CreateCommentRequest["content"] });
      setContent("");
      onCommentCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo bình luận thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <div className="create-comment-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            placeholder="Viết bình luận của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Đang gửi..." : "Gửi bình luận"}
        </button>
      </form>
    </div>
    </>
  );
}
