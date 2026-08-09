import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

/** Card-shaped skeleton for a topic / deck entry. */
export function TopicCardSkeleton() {
  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <Bone className="size-12 rounded-xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Bone className="h-4 w-2/3 rounded-md" />
          <Bone className="h-3 w-1/3 rounded-md" />
        </div>
      </div>
      <Bone className="h-3 w-full rounded-md" />
      <Bone className="h-3 w-4/5 rounded-md" />
      <div className="mt-1 flex gap-2">
        <Bone className="h-6 w-16 rounded-full" />
        <Bone className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** Large centered flashcard-shaped skeleton for study mode. */
export function FlashcardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <div className="glass-panel relative flex h-80 w-full flex-col items-center justify-center gap-4 rounded-3xl p-8">
        <Bone className="absolute left-6 top-5 h-3 w-16 rounded-full" />
        <Bone className="h-4 w-3/4 rounded-md" />
        <Bone className="h-4 w-2/3 rounded-md" />
        <Bone className="mt-4 h-3 w-1/2 rounded-md" />
        <div className="mt-2 flex gap-2">
          <Bone className="size-10 rounded-full" />
          <Bone className="size-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Grid of deck skeletons for the flashcards home. */
export function DeckGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TopicCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Line-level skeleton for content blocks. */
export function TextBlockSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Bone className="h-5 w-1/3 rounded-md" />
      <Bone className="h-3.5 w-full rounded-md" />
      <Bone className="h-3.5 w-[94%] rounded-md" />
      <Bone className="h-3.5 w-[86%] rounded-md" />
      <Bone className="mt-1 h-3.5 w-[60%] rounded-md" />
    </div>
  );
}
