import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const PRO_PRODUCT_ID = "prod_U5YlS2QWrJGphy";

interface SubscriptionState {
  isPro: boolean;
  loading: boolean;
  subscriptionEnd: string | null;
  checkSubscription: () => Promise<void>;
  openCheckout: () => Promise<void>;
  openPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState>({
  isPro: false,
  loading: true,
  subscriptionEnd: null,
  checkSubscription: async () => {},
  openCheckout: async () => {},
  openPortal: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) {
        console.error("check-subscription error:", error);
        return;
      }
      setIsPro(data?.subscribed === true && data?.product_id === PRO_PRODUCT_ID);
      setSubscriptionEnd(data?.subscription_end || null);
    } catch (e) {
      console.error("Subscription check failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const openCheckout = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e) {
      console.error("Checkout failed:", e);
    }
  }, []);

  const openPortal = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e) {
      console.error("Portal failed:", e);
    }
  }, []);

  useEffect(() => {
    checkSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    // Auto-refresh every 60s
    const interval = setInterval(checkSubscription, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [checkSubscription]);

  return (
    <SubscriptionContext.Provider value={{ isPro, loading, subscriptionEnd, checkSubscription, openCheckout, openPortal }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
