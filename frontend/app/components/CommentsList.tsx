import { Comment, getImageUrl } from "../services/api";

interface CommentsListProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  return (
      <div className="comments-list">
      <h3>Bình luận ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className="no-comments">Chưa có bình luận nào.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.comment_id} className="comment-item">
            <div className="comment-header">
              <img
                src={
                  comment.user.avatar
                    ? getImageUrl(comment.user.avatar)
                    : "/default-avatar.png"
                }
                alt={comment.user.username}
                className="comment-avatar"
              />
              <div className="comment-info">
                <span className="comment-author">
                  {comment.user.username}
                </span>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))
      )}
      </div>
  );
}
