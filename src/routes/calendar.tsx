import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBusiness } from "@/hooks/useBusiness";
import { fetchCalendarEvents } from "@/services/calendar";
import { getTasks, toggleTaskCompletion, fetchWorkspaceMembers, type WorkspaceMemberInfo } from "@/services/tasks";
import { getCustomers } from "@/services/customers";
import { supabase } from "@/lib/supabase";
import type { CalendarEvent, Task, Customer, Job } from "@/lib/database.types";
import { CalendarHeader, ActiveTasksPanel, type CalendarViewType } from "@/components/calendar/CalendarComponents";
import { CalendarViews } from "@/components/calendar/CalendarViews";
import { NewEventModal, ScheduleTaskModal } from "@/components/calendar/CalendarModals";
import { CalendarEventDetailModal } from "@/components/calendar/CalendarEventDetailModal";
import { ExecutionSystemWorkspace } from "@/components/tasks/ExecutionSystemWorkspace";
import { fetchCampaigns } from "@/services/campaigns";
import { fetchMissions } from "@/services/missions";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const { business } = useBusiness();
  const currentBusinessId = business?.id;

  const [view, setView] = useState<CalendarViewType>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [members, setMembers] = useState<WorkspaceMemberInfo[]>([]);

  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [allMissions, setAllMissions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // Modals & Inspection State
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [taskToSchedule, setTaskToSchedule] = useState<Task | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedTaskWorkspace, setSelectedTaskWorkspace] = useState<Task | null>(null);

  useEffect(() => {
    if (!currentBusinessId) return;
    loadData();
  }, [currentBusinessId, currentDate, view]);

  const loadData = async () => {
    if (!currentBusinessId) return;
    setLoading(true);
    try {
      // Calculate date query range (padding 30 days before and after currentDate)
      const rangeStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString();
      const rangeEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).toISOString();

      const [evList, taskList, custList, jobList, memList, campList, missList] = await Promise.all([
        fetchCalendarEvents(currentBusinessId, rangeStart, rangeEnd),
        getTasks(currentBusinessId),
        getCustomers(currentBusinessId).catch(() => []),
        supabase.from("jobs").select("*").eq("business_id", currentBusinessId).then((r) => r.data || []),
        fetchWorkspaceMembers(currentBusinessId).catch(() => []),
        fetchCampaigns(currentBusinessId).catch(() => []),
        fetchMissions(currentBusinessId).catch(() => []),
      ]);

      setEvents(evList);
      setTasks(taskList);
      setCustomers(custList);
      setJobs(jobList as Job[]);
      setMembers(memList);
      const overview = campList as any;
      setAllCampaigns([...(overview.activeCampaigns || []), ...(overview.completedCampaigns || [])]);
      setAllMissions(missList as any[]);
    } catch (err) {
      console.error("[CalendarPage] loadData error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (view === "month") next.setMonth(next.getMonth() - 1);
    else if (view === "week") next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (view === "month") next.setMonth(next.getMonth() + 1);
    else if (view === "week") next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const handleToggleTaskCompletion = async (task: Task) => {
    if (!currentBusinessId) return;
    try {
      await toggleTaskCompletion(task.id, currentBusinessId, task.status, task.title);
      await loadData();
    } catch (err: any) {
      alert(`Failed to complete task: ${err.message || String(err)}`);
    }
  };

  const linkedTaskMap = tasks.reduce<Record<string, Task>>((acc, t) => {
    acc[t.id] = t;
    return acc;
  }, {});

  return (
    <AppLayout>
      <PageHeader
        title="Calendar & Execution Hub"
        description="Synchronize scheduled task time blocks, customer appointments and operational jobs in one workspace calendar."
        crumbs={[{ label: "Calendar" }]}
        action={{
          label: "New Event",
          icon: Plus,
          onClick: () => setShowNewEventModal(true),
        }}
      />

      <div className="flex-1 flex flex-col gap-4">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onNewEvent={() => setShowNewEventModal(true)}
        />

        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-[550px]">
          <CalendarViews
            view={view}
            currentDate={currentDate}
            events={events}
            tasks={tasks}
            linkedTaskMap={linkedTaskMap}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setCurrentDate(d);
            }}
            onOpenEventDetail={(ev) => setSelectedEvent(ev)}
            onOpenTaskWorkspace={(t) => setSelectedTaskWorkspace(t)}
          />

          <ActiveTasksPanel
            selectedDate={selectedDate}
            allTasks={tasks}
            linkedTaskMap={linkedTaskMap}
            onOpenTaskWorkspace={(t) => setSelectedTaskWorkspace(t)}
            onScheduleTask={(t) => setTaskToSchedule(t)}
            onToggleTaskCompletion={handleToggleTaskCompletion}
          />
        </div>
      </div>

      {/* MODALS */}
      {showNewEventModal && currentBusinessId && (
        <NewEventModal
          businessId={currentBusinessId}
          selectedDate={selectedDate}
          allTasks={tasks}
          customers={customers}
          jobs={jobs}
          onClose={() => setShowNewEventModal(false)}
          onRefresh={loadData}
        />
      )}

      {taskToSchedule && currentBusinessId && (
        <ScheduleTaskModal
          task={taskToSchedule}
          businessId={currentBusinessId}
          onClose={() => setTaskToSchedule(null)}
          onRefresh={loadData}
        />
      )}

      {selectedEvent && currentBusinessId && (
        <CalendarEventDetailModal
          event={selectedEvent}
          businessId={currentBusinessId}
          linkedTask={selectedEvent.task_id ? linkedTaskMap[selectedEvent.task_id] : null}
          onClose={() => setSelectedEvent(null)}
          onRefresh={loadData}
          onOpenTaskWorkspace={(t) => {
            setSelectedEvent(null);
            setSelectedTaskWorkspace(t);
          }}
        />
      )}

      {selectedTaskWorkspace && currentBusinessId && (
        <ExecutionSystemWorkspace
          businessId={currentBusinessId}
          task={selectedTaskWorkspace}
          allCampaigns={allCampaigns}
          allMissions={allMissions}
          allTasks={tasks}
          members={members}
          onClose={() => setSelectedTaskWorkspace(null)}
          onRefresh={loadData}
          onSelectCampaign={() => {}}
          onSelectMission={() => {}}
          onSelectTask={(t) => setSelectedTaskWorkspace(t)}
        />
      )}
    </AppLayout>
  );
}
