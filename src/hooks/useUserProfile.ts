import { useUser } from "@clerk/clerk-expo";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

export function useUserProfile() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const clerkId = user?.id;

  const userProfile = useQuery(api.users.getUserByClerkId, clerkId ? { clerkId } : undefined);

  useEffect(() => {
    setIsLoading(false);
  }, [userProfile]);

  return {
    userProfile,
    isLoading,
  };
}
