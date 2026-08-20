import { useEffect, useState } from "react";
import { PoundSterling, MessageSquare, Calendar, Percent, Star } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { fetchBusinessSnapshot, type BusinessSnapshotData } from "@/services/snapshot";

export function BusinessSnapshot() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [snapshot, setSnapshot] = useState<BusinessSnapshotData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBusinessSnapshot(businessId)
      .then((data) => {
        if (mounted) {
          setSnapshot(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load business snapshot:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId]);

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
          Business Snapshot
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          Calculating real-time business snapshot metrics...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            title={snapshot?.revenueToday.title ?? "Revenue Today"}
            value={snapshot?.revenueToday.hasData ? snapshot.revenueToday.value : "£0"}
            trend={snapshot?.revenueToday.trend ?? 0}
            trendLabel={snapshot?.revenueToday.trendLabel ?? "vs yesterday"}
            insight={snapshot?.revenueToday.insight}
            icon={PoundSterling}
            data={snapshot?.revenueToday.sparklineData}
          />
          <KpiCard
            title={snapshot?.revenueMtd.title ?? "Revenue (MTD)"}
            value={snapshot?.revenueMtd.hasData ? snapshot.revenueMtd.value : "£0"}
            trend={snapshot?.revenueMtd.trend ?? 0}
            trendLabel={snapshot?.revenueMtd.trendLabel ?? "vs prev month MTD"}
            insight={snapshot?.revenueMtd.insight}
            icon={PoundSterling}
            data={snapshot?.revenueMtd.sparklineData}
          />
          <KpiCard
            title={snapshot?.newEnquiries.title ?? "New Enquiries"}
            value={snapshot?.newEnquiries.hasData ? snapshot.newEnquiries.value : "0"}
            trend={snapshot?.newEnquiries.trend ?? 0}
            unit="%"
            trendLabel={snapshot?.newEnquiries.trendLabel ?? "vs prev 7 days"}
            insight={snapshot?.newEnquiries.insight}
            icon={MessageSquare}
          />
          <KpiCard
            title={snapshot?.bookedJobs.title ?? "Booked Jobs"}
            value={snapshot?.bookedJobs.hasData ? snapshot.bookedJobs.value : "0"}
            trend={snapshot?.bookedJobs.trend ?? 0}
            unit="%"
            trendLabel={snapshot?.bookedJobs.trendLabel ?? "vs prev 7 days"}
            insight={snapshot?.bookedJobs.insight}
            icon={Calendar}
            iconTone="brand"
          />
          <KpiCard
            title={snapshot?.conversionRate.title ?? "Conversion Rate"}
            value={snapshot?.conversionRate.hasData ? snapshot.conversionRate.value : "0%"}
            trend={snapshot?.conversionRate.trend ?? 0}
            unit="pts"
            trendLabel={snapshot?.conversionRate.trendLabel ?? "pts vs prev 7d"}
            insight={snapshot?.conversionRate.insight}
            icon={Percent}
          />
          <KpiCard
            title={snapshot?.avgReviewRating.title ?? "Avg. Review Rating"}
            value={snapshot?.avgReviewRating.hasData ? snapshot.avgReviewRating.value : "0.0"}
            trend={snapshot?.avgReviewRating.trend ?? 0}
            unit="★"
            trendLabel={snapshot?.avgReviewRating.trendLabel ?? "total reviews"}
            insight={snapshot?.avgReviewRating.insight}
            icon={Star}
            iconTone="brand"
          />
        </div>
      )}
    </div>
  );
}
