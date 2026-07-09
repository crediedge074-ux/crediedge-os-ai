import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  archiveCustomer,
  seedDemoCustomers,
} from "@/services/customers";
import type { Customer, CustomerInsert, CustomerUpdate } from "@/lib/database.types";

export function useCustomers() {
  const { membership, user } = useAuthContext();
  const businessId = membership?.business_id;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!businessId) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    try {
      let data = await getCustomers(businessId);
      if (data.length === 0 && user) {
        await seedDemoCustomers(businessId, user.id);
        data = await getCustomers(businessId);
      }
      if (mounted) setCustomers(data);
    } catch (err) {
      if (mounted) setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      if (mounted) setLoading(false);
    }
    return () => { mounted = false; };
  }, [businessId, user]);

  useEffect(() => {
    load();
  }, [load]);

  return { customers, loading, error, refresh: load };
}

export function useCustomer(id: string | null) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    getCustomer(id)
      .then((data) => { if (mounted) setCustomer(data); })
      .catch((err) => { if (mounted) setError(err instanceof Error ? err.message : "Failed to load"); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  return { customer, loading, error };
}

export function useCreateCustomer() {
  const { membership, user } = useAuthContext();
  const businessId = membership?.business_id;
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Omit<CustomerInsert, "business_id">): Promise<Customer | null> => {
    if (!businessId) return null;
    setCreating(true);
    setError(null);
    try {
      const customer = await createCustomer({
        ...data,
        business_id: businessId,
        created_by: user?.id ?? null,
      });
      return customer;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create customer");
      return null;
    } finally {
      setCreating(false);
    }
  };

  return { create, creating, error };
}

export function useUpdateCustomer() {
  const { user } = useAuthContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (id: string, updates: CustomerUpdate): Promise<Customer | null> => {
    setSaving(true);
    setError(null);
    try {
      const customer = await updateCustomer(id, { ...updates, updated_by: user?.id ?? null });
      return customer;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update customer");
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { save, saving, error };
}

export function useDeleteCustomer() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const archive = async (id: string): Promise<boolean> => {
    setDeleting(true);
    setError(null);
    try {
      await archiveCustomer(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive customer");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { archive, deleting, error };
}
