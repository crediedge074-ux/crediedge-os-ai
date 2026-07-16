import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  archiveCustomer,
  createCustomer,
  getCustomer,
  getCustomers,
  seedDemoCustomers,
  updateCustomer,
} from "@/services/customers";
import type { Customer, CustomerInsert, CustomerUpdate } from "@/lib/database.types";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (businessId: string) => [...customerKeys.lists(), businessId] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const demoDataEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO_DATA === "true";

export function useCustomers() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const query = useQuery({
    queryKey: businessId ? customerKeys.list(businessId) : customerKeys.lists(),
    queryFn: () => getCustomers(businessId!),
    enabled: Boolean(businessId),
    retry: 2,
    retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 10_000),
  });

  return {
    customers: query.data ?? [],
    loading: Boolean(businessId) && query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Failed to load customers") : null,
    refresh: query.refetch,
  };
}

export function useCustomer(id: string | null) {
  const query = useQuery({
    queryKey: id ? customerKeys.detail(id) : customerKeys.details(),
    queryFn: () => getCustomer(id!),
    enabled: Boolean(id),
    retry: 2,
    retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 10_000),
  });

  return {
    customer: query.data ?? null,
    loading: Boolean(id) && query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Failed to load customer") : null,
    refresh: query.refetch,
  };
}

export function useCreateCustomer() {
  const { membership, user } = useAuthContext();
  const queryClient = useQueryClient();
  const businessId = membership?.business_id;

  const mutation = useMutation({
    mutationFn: async (data: Omit<CustomerInsert, "business_id">) => {
      if (!businessId) throw new Error("No business selected");

      return createCustomer({
        ...data,
        business_id: businessId,
        created_by: user?.id ?? null,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: customerKeys.list(businessId!),
      });
    },
  });

  const create = async (
    data: Omit<CustomerInsert, "business_id">,
  ): Promise<Customer | null> => {
    try {
      return await mutation.mutateAsync(data);
    } catch {
      return null;
    }
  };

  return {
    create,
    creating: mutation.isPending,
    error: mutation.error
      ? getErrorMessage(mutation.error, "Failed to create customer")
      : null,
  };
}

export function useUpdateCustomer() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CustomerUpdate }) =>
      updateCustomer(id, { ...updates, updated_by: user?.id ?? null }),
    onSuccess: async (customer) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: customerKeys.all }),
        queryClient.setQueryData(customerKeys.detail(customer.id), customer),
      ]);
    },
  });

  const save = async (
    id: string,
    updates: CustomerUpdate,
  ): Promise<Customer | null> => {
    try {
      return await mutation.mutateAsync({ id, updates });
    } catch {
      return null;
    }
  };

  return {
    save,
    saving: mutation.isPending,
    error: mutation.error
      ? getErrorMessage(mutation.error, "Failed to update customer")
      : null,
  };
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: archiveCustomer,
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: customerKeys.all }),
        queryClient.removeQueries({ queryKey: customerKeys.detail(id) }),
      ]);
    },
  });

  const archive = async (id: string): Promise<boolean> => {
    try {
      await mutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  return {
    archive,
    deleting: mutation.isPending,
    error: mutation.error
      ? getErrorMessage(mutation.error, "Failed to archive customer")
      : null,
  };
}

export function useSeedDemoCustomers() {
  const { membership, user } = useAuthContext();
  const queryClient = useQueryClient();
  const businessId = membership?.business_id;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!demoDataEnabled) {
        throw new Error("Demo data is only available in explicitly enabled development environments");
      }
      if (!businessId || !user) throw new Error("No authenticated business user");

      await seedDemoCustomers(businessId, user.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: customerKeys.list(businessId!),
      });
    },
  });

  return {
    seedDemoCustomers: mutation.mutateAsync,
    enabled: demoDataEnabled,
    seeding: mutation.isPending,
    error: mutation.error
      ? getErrorMessage(mutation.error, "Failed to seed demo customers")
      : null,
  };
}
