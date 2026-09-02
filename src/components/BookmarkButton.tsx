import { useState } from "react";
import { Bookmark } from "lucide-react";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  slug: string;
  title: string;
  emoji: string;
}

export function BookmarkButton({ slug, title, emoji }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(() => isBookmarked("article", slug));

  const handleToggle = () => {
    const newState = toggleBookmark("article", slug, title, emoji);
    setBookmarked(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "shrink-0 rounded-xl border p-2.5 transition-all",
        bookmarked
          ? "border-wistaria/40 bg-wistaria/15 text-wistaria"
          : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white",
      )}
      title={bookmarked ? "Remove bookmark" : "Bookmark this article"}
    >
      <Bookmark
        className="size-5"
        fill={bookmarked ? "currentColor" : "none"}
      />
    </button>
  );
}
