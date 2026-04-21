import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchForm({
  onSearch,
  initialQuery = "",
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onSearch(query);
    }
  };

  return (
    <div className="search-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tìm kiếm ảnh..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Tìm kiếm</button>
      </form>
    </div>
  );
}
