import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Briefcase, Plus, Calendar as CalendarIcon, CheckCircle2, Clock, DollarSign, Filter, Search } from "lucide-react";
import { getJobs, createJob, updateJob } from "@/services/jobs";
import { useBusiness } from "@/hooks/useBusiness";
import type { Job } from "@/lib/database.types";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({
  component: JobsPage,
});

function JobsPage() {
  const { business } = useBusiness();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const loadJobs = async () => {
    if (!business?.id) return;
    setLoading(true);
    const data = await getJobs(business.id);
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, [business?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?.id || !newTitle.trim()) return;

    try {
      const jobNumber = `JOB-${Math.floor(1000 + Math.random() * 9000)}`;
      await createJob({
        business_id: business.id,
        job_number: jobNumber,
        title: newTitle,
        description: newDesc,
        estimated_amount: parseFloat(newAmount) || 0,
        status: "scheduled",
        priority: "medium",
      });
      toast.success("Job created successfully!");
      setCreateOpen(false);
      setNewTitle("");
      setNewAmount("");
      setNewDesc("");
      loadJobs();
    } catch (err: any) {
      toast.error(err.message || "Failed to create job");
    }
  };

  const handleStatusChange = async (jobId: string, status: string) => {
    try {
      await updateJob(jobId, { status });
      toast.success(`Job marked as ${status}`);
      loadJobs();
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.job_number.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <PageHeader
        title="Jobs Engine"
        description="Connect your operations, customers, calendar, and financials in one continuous workflow."
        crumbs={[{ label: "Operations" }, { label: "Jobs" }]}
        action={{
          label: "Create Job",
          icon: Plus,
          onClick: () => setCreateOpen(true),
        }}
      />

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-7 xl:px-8 space-y-6">
        {/* Filter bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs by title or job number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12 text-xs text-muted-foreground">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">No jobs found</h3>
            <p className="mt-1 text-xs text-muted-foreground">Create your first job to connect operations with revenue.</p>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand/90"
            >
              <Plus className="h-3.5 w-3.5" />
              New Job
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((j) => (
              <div key={j.id} className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-brand/40 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{j.job_number}</span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    j.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                    j.status === "in_progress" ? "bg-brand/10 text-brand" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {j.status.replace("_", " ")}
                  </span>
                </div>

                <h4 className="mt-2 text-sm font-bold text-foreground">{j.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{j.description || "No description provided."}</p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                    <DollarSign className="h-3.5 w-3.5 text-brand" />
                    £{j.estimated_amount.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-1">
                    {j.status !== "completed" && (
                      <button
                        onClick={() => handleStatusChange(j.id, "completed")}
                        className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <h3 className="text-base font-bold text-foreground">Create New Job</h3>
              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. BMW Full Service & Maintenance"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Estimated Amount (£)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="550"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Description</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Details about the work..."
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCreateOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand/90"
                  >
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
