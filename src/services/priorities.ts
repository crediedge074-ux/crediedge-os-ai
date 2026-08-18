import { supabase } from "@/lib/supabase";
import { updateTask } from "./tasks";
import { logActivity } from "./activity";

export type PriorityLevel = "High" | "Medium" | "Low";

export interface DashboardPriorityItem {
  id: string;
  sourceType: "task" | "invoice" | "communication" | "customer";
  sourceId: string;
  title: string;
  priority: PriorityLevel;
  score: number;
  timeEstimate: string;
  impact: string;
  impactType: "currency" | "text";
  cta: string;
  to: string;
  reason: string;
  suggestedAction: string;
}

export async function fetchCalculatedPriorities(
  businessId: string | undefined
): Promise<DashboardPriorityItem[]> {
  if (!businessId) return [];

  const priorityItems: DashboardPriorityItem[] = [];

  try {
    // 1. Outstanding Tasks from `tasks` table
    const { data: rawTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("business_id", businessId)
      .neq("status", "completed");

    (rawTasks || []).forEach((task) => {
      let score = 50;
      if (task.priority === "high" || task.priority === "urgent") score += 30;
      if (task.due_date && new Date(task.due_date) < new Date()) score += 25;

      const prioLevel: PriorityLevel = score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";

      priorityItems.push({
        id: `task-${task.id}`,
        sourceType: "task",
        sourceId: task.id,
        title: task.title,
        priority: prioLevel,
        score,
        timeEstimate: "10 min",
        impact: task.priority === "high" ? "Urgent task" : "Action required",
        impactType: "text",
        cta: "View Task",
        to: "/tasks",
        reason: `Task is marked ${task.priority || "normal"} priority${task.due_date ? ` and due ${task.due_date}` : ""}.`,
        suggestedAction: `Complete task: ${task.title}`,
      });
    });

    // 2. Overdue Invoices from `invoices` table
    const nowIso = new Date().toISOString().slice(0, 10);
    const { data: rawInvoices } = await supabase
      .from("invoices")
      .select("*")
      .eq("business_id", businessId)
      .neq("status", "paid");

    (rawInvoices || []).forEach((inv) => {
      const balance = (Number(inv.total_amount) || 0) - (Number(inv.amount_paid) || 0);
      if (balance > 0 && inv.due_date < nowIso) {
        const daysOverdue = Math.floor(
          (Date.now() - new Date(inv.due_date).getTime()) / 86400000
        );
        const score = 80 + Math.min(20, daysOverdue) + Math.min(20, balance / 100);

        priorityItems.push({
          id: `invoice-${inv.id}`,
          sourceType: "invoice",
          sourceId: inv.id,
          title: `Chase overdue invoice ${inv.invoice_number}`,
          priority: "High",
          score,
          timeEstimate: "5 min",
          impact: `£${balance.toLocaleString()}`,
          impactType: "currency",
          cta: "Open CRM",
          to: "/relationships",
          reason: `Invoice ${inv.invoice_number} is ${daysOverdue} days past due with an unpaid balance of £${balance.toLocaleString()}.`,
          suggestedAction: `Contact customer to request payment for invoice ${inv.invoice_number}.`,
        });
      }
    });

    // 3. Unread Inbound Communications / Enquiries from `communications` table
    const { data: rawComms } = await supabase
      .from("communications")
      .select("*")
      .eq("business_id", businessId)
      .eq("direction", "inbound")
      .is("read_at", null);

    if (rawComms && rawComms.length > 0) {
      const count = rawComms.length;
      const score = 70 + count * 5;

      priorityItems.push({
        id: `comms-unread-group`,
        sourceType: "communication",
        sourceId: rawComms[0].id,
        title: `Reply to ${count} new enquiry${count > 1 ? "ies" : ""}`,
        priority: count >= 3 ? "High" : "Medium",
        score,
        timeEstimate: `${Math.min(30, count * 5)} min`,
        impact: `${count} pending`,
        impactType: "text",
        cta: "Reply Now",
        to: "/communications",
        reason: `You have ${count} unread inbound enquiry${count > 1 ? "ies" : ""} awaiting response.`,
        suggestedAction: "Open Communications hub to respond to waiting potential clients.",
      });
    }

    // Sort deterministically by calculated priority score descending
    priorityItems.sort((a, b) => b.score - a.score);

    return priorityItems;
  } catch (err) {
    console.error("[fetchCalculatedPriorities] error:", err);
    return [];
  }
}

export async function completePriorityItem(
  item: DashboardPriorityItem,
  businessId: string
): Promise<boolean> {
  try {
    if (item.sourceType === "task") {
      await updateTask(item.sourceId, {
        status: "completed",
        completed_at: new Date().toISOString(),
      });
    } else {
      await logActivity({
        business_id: businessId,
        entity_type: item.sourceType,
        entity_id: item.sourceId,
        action: "completed",
        description: `Action completed from Command Centre Priorities: ${item.title}`,
      });
    }
    return true;
  } catch (err) {
    console.error("[completePriorityItem] error:", err);
    return false;
  }
}
