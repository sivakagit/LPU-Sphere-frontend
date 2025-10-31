import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  reg_no?: string;
  description?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
}

export const useProfile = (userId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Profile> & { name: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .upsert([{
          user_id: user.id,
          name: updates.name,
          reg_no: updates.reg_no,
          description: updates.description,
          github_url: updates.github_url,
          linkedin_url: updates.linkedin_url,
          portfolio_url: updates.portfolio_url,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfile.mutate,
  };
};
