"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

const AuthContext = createContext();
const refresh = async () => {
  try {
    const res = await fetch("/api/auth/refresh-token", { method: "POST" });
    if (!res.ok) {
      return false;
    }
    return res.json();
  } catch (err) {
    return false;
  }
};
export const AuthProvider = ({ children, initialUser }) => {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [isShowOtp, setIsShowOtp] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  const { data: user, refetch } = useQuery({
    queryKey: ["user"],
    // initialData: initialUser,
    // enabled: isFetching,
    // staleTime: 5 * 60 * 1000,

    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
    queryFn: async () => {
      let res = await fetch("/api/auth/me");
      if (res.status === 401) {
        const refreshed = await refresh();
        if (!refreshed) return null;
        res = await fetch("/api/auth/me");
      }
      if (!res.ok) return null;
      return res.json();
    },
  });
  const showOtpHandler = (mail) => {
    setIsShowOtp(true);
    setTempEmail(mail);
  };
  const closeOtpHandler = () => {
    setIsShowOtp(false);
  };
  const clearEmailTemp = useCallback(() => {
    setTempEmail("");
  }, []);
  const logoutHandler = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/signout");
      if (res.ok) {
        toast.success("با موفقیت خارج شدید");
        refetch();
        router.replace("/");
      }
    } catch {
      toast.error("خطا در خروج از حساب");
    }
  }, [refetch, router]);
  const setFetchingHandler = useCallback(() => {
    setIsFetching((prev) => !prev);
  }, []);
  const value = useMemo(() => {
    return {
      user: user?.user,
      refetch,
      logoutHandler,
      setFetchingHandler,
      showOtpHandler,
      isShowOtp,
      tempEmail,
      clearEmailTemp,
      closeOtpHandler,
    };
  }, [
    logoutHandler,
    refetch,
    setFetchingHandler,
    user?.user,
    isShowOtp,
    tempEmail,
    clearEmailTemp,
  ]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
