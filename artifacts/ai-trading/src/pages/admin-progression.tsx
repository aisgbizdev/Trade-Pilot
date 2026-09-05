import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  useGetProgressionAudit, 
  useBackfillProgression,
  getGetProgressionAuditQueryKey
} from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";
import { Loader2, ArrowLeft, Database, Search } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminProgressionPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [debouncedFilter, setDebouncedFilter] = useState<string>("");

  const auditParams = debouncedFilter ? { userId: parseInt(debouncedFilter, 10) } : {};
  const { data: audit, isLoading, refetch } = useGetProgressionAudit(auditParams, {
    query: {
      enabled: !debouncedFilter || !isNaN(parseInt(debouncedFilter, 10)),
      queryKey: getGetProgressionAuditQueryKey(auditParams)
    }
  });

  const backfill = useBackfillProgression();
  const [backfillOpen, setBackfillOpen] = useState(false);

  const handleBackfill = async () => {
    try {
      const res = await backfill.mutateAsync();
      toast({
        title: t.progression.backfill_complete,
        description: t.progression.admin_scanned.replace("{scanned}", String(res.scanned)) + " | " + t.progression.admin_awarded.replace("{awarded}", String(res.awarded)),
      });
      refetch();
      setBackfillOpen(false);
    } catch (err: any) {
      toast({
        title: t.progression.backfill_failed,
        description: err?.data?.error || "Unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="px-4 py-5 space-y-6 md:max-w-4xl md:mx-auto lg:max-w-none">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/admin")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{t.progression.admin_audit}</h1>
            <p className="text-xs text-muted-foreground truncate">Read-only ledger. Never a leaderboard.</p>
          </div>
          <AlertDialog open={backfillOpen} onOpenChange={setBackfillOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Database className="w-4 h-4 mr-2" />
                {t.progression.admin_backfill}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.progression.admin_backfill_confirm_title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.progression.admin_backfill_confirm_desc}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => {
                  e.preventDefault();
                  handleBackfill();
                }} disabled={backfill.isPending}>
                  {backfill.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t.progression.admin_backfill_button}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2 max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input 
              type="number"
              placeholder="Filter by User ID..."
              value={userIdFilter}
              onChange={(e) => {
                setUserIdFilter(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setDebouncedFilter(userIdFilter);
                }
              }}
              onBlur={() => setDebouncedFilter(userIdFilter)}
              className="h-8"
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium text-right">XP</th>
                    <th className="px-4 py-3 font-medium">Rule Version</th>
                    <th className="px-4 py-3 font-medium">Date (UTC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </td>
                    </tr>
                  ) : audit?.entries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No audit records found.
                      </td>
                    </tr>
                  ) : (
                    audit?.entries.map((entry) => (
                      <tr key={entry.id} className="bg-card hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs">{entry.id}</td>
                        <td className="px-4 py-3 font-medium">User {entry.userId}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <div className="flex flex-col gap-0.5">
                            <span>{entry.source}</span>
                            <span className="text-[10px] font-mono opacity-60 truncate max-w-[120px]" title={entry.sourceEventId}>
                              {entry.sourceEventId}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">+{entry.xp}</td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{entry.ruleVersion}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {format(new Date(entry.createdAt), "yyyy-MM-dd HH:mm:ss")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

      </div>
    </Layout>
  );
}
