import { CurrentUserDto } from "@/lib/types/appUser.types";
import { appUserService } from "@/API/Services/appUser.service";
import { useEffect, useState } from "react";

// The layout renders on every page; load the profile once per session.
let cached: Promise<CurrentUserDto | null> | null = null;

const load = () =>
  (cached ??= appUserService
    .me()
    .then((response) => response.data)
    .catch(() => {
      cached = null; // Retry on the next page instead of caching the failure.
      return null;
    }));

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUserDto | null>(null);
  useEffect(() => {
    let active = true;
    load().then((result) => active && setUser(result));
    return () => {
      active = false;
    };
  }, []);
  return user;
};
