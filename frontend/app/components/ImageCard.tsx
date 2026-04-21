import Link from "next/link";
import { Image, getImageUrl } from "../services/api";
import SaveButton from "./SaveButton";

interface ImageCardProps {
  image: Image;
  token?: string | null;
  onDelete?: (imageId: number) => void;
}

export default function ImageCard({ image, token, onDelete }: ImageCardProps) {
  const imageUrl = getImageUrl(image.path);

  const handleDelete = () => {
    if (onDelete && confirm("Bạn có chắc muốn xóa ảnh này?")) {
      onDelete(image.image_id);
    }
  };

  return (
    <div className="image-card">
      <Link href={`/images/${image.image_id}`}>
        <img src={imageUrl} alt={image.image_name} className="image-card__img" />
      </Link>
      <div className="image-card__content">
        <h3 className="image-card__title">
          <Link href={`/images/${image.image_id}`}>{image.image_name}</Link>
        </h3>
        {image.description && (
          <p className="image-card__description">{image.description}</p>
        )}
        <p className="image-card__author">Tác giả: {image.user.username}</p>
        <div className="image-card__actions">
          <Link href={`/images/${image.image_id}`} className="detail-link">
            Xem chi tiết
          </Link>
          {token && <SaveButton token={token} imageId={image.image_id} />}
          {onDelete && (
            <button onClick={handleDelete} className="delete-button">
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
