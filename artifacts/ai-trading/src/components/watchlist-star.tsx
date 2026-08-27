import { Star } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetWatchlist,
  useAddWatchlistItem,
  useRemoveWatchlistItem,
  getGetWatchlistQueryKey,
  type Watchlist,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Size = "sm" | "md";

interface WatchlistStarProps {
  instrument: string;
  size?: Size;
  className?: string;
}

export function useWatchlist() {
  return useGetWatchlist({
    query: { queryKey: getGetWatchlistQueryKey(), staleTime: 30_000 },
  });
}

export function useIsWatched(instrument: string): boolean {
  const { data } = useWatchlist();
  const items = (data as Watchlist | undefined)?.items ?? [];
  return items.some(
    (i) => i.instrument.toLowerCase() === instrument.toLowerCase(),
  );
}

export function WatchlistStar({ instrument, size = "md", className }: WatchlistStarProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isWatched = useIsWatched(instrument);
  const addMut = useAddWatchlistItem();
  const removeMut = useRemoveWatchlistItem();
  const queryKey = getGetWatchlistQueryKey();
  const busy = addMut.isPending || removeMut.isPending;

  const iconClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const btnClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    if (isWatched) {
      // The generated client interpolates the instrument straight into the
      // URL path, so symbols like "EUR/USD" would land at `/watchlist/EUR/USD`
      // and miss the `:instrument` route. Pre-encode here; Express decodes
      // the path param back to the original on the way in.
      removeMut.mutate(
        { instrument: encodeURIComponent(instrument) },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast({ title: t.dashboard.watchlist_removed_toast });
          },
          onError: () => {
            toast({
              title: t.dashboard.watchlist_error_toast,
              variant: "destructive",
            });
          },
        },
      );
    } else {
      addMut.mutate(
        { data: { instrument } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast({ title: t.dashboard.watchlist_added_toast });
          },
          onError: () => {
            toast({
              title: t.dashboard.watchlist_error_toast,
              variant: "destructive",
            });
          },
        },
      );
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={isWatched ? t.dashboard.watchlist_star_remove : t.dashboard.watchlist_star_add}
      aria-pressed={isWatched}
      data-testid={`button-watchlist-star-${instrument}`}
      data-watched={isWatched ? "true" : "false"}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        "hover:bg-amber-500/15 disabled:opacity-50 disabled:cursor-not-allowed",
        btnClass,
        className,
      )}
    >
      <Star
        className={cn(
          iconClass,
          isWatched
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground",
        )}
      />
    </button>
  );
}
