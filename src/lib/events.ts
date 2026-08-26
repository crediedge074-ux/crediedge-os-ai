type EventCallback = () => void;

class ApplicationEventEmitter {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscriber function
    return () => {
      const set = this.listeners.get(event);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  emit(event: string): void {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb();
        } catch (err) {
          console.error(`[AppEvents] Error handling event ${event}:`, err);
        }
      });
    }
  }
}

export const appEvents = new ApplicationEventEmitter();

export const APP_EVENTS = {
  CUSTOMERS_MUTATED: "CUSTOMERS_MUTATED",
  TASKS_MUTATED: "TASKS_MUTATED",
  MISSIONS_MUTATED: "MISSIONS_MUTATED",
  CAMPAIGNS_MUTATED: "CAMPAIGNS_MUTATED",
  FINANCE_MUTATED: "FINANCE_MUTATED",
} as const;
