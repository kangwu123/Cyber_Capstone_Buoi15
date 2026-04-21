import { Image } from "../services/api";
import ImageCard from "./ImageCard";

interface ImageListProps {
  images: Image[];
  token?: string | null;
  onDelete?: (imageId: number) => void;
}

export default function ImageList({ images, token, onDelete }: ImageListProps) {
  if (!images || images.length === 0) {
    return <p className="no-images">Không có ảnh nào để hiển thị.</p>;
  }

  return (
    <div className="image-list">
      {images.map((image) => (
        <ImageCard
          key={image.image_id}
          image={image}
          token={token}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
