"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserProfile } from "@/app/store/features/authSlice";
import { getUserData } from "@/lib/services";
import useApi from "@/hooks/useApi";
import Loading from "@/app/loading";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, error, loading, execute } = useApi(getUserData);
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    console.log({ storedToken });

    if (!storedToken) {
      if (pathname !== "/login") {
        router.push(`/login`);
      }
      setIsCheckingAuth(false); // Allow rendering login page
      return;
    }

    if (!token) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch, router, token, pathname]);

  useEffect(() => {
    if (token) {
      execute();
    }
  }, [token, execute]);

  useEffect(() => {
    if (data) {
      dispatch(setUserProfile(data.body?.user));
      setIsCheckingAuth(false);
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      dispatch(setUserProfile(null));
      if (pathname !== "/login") {
        router.push(`/login`);
      }
      setIsCheckingAuth(false);
    }
  }, [error, dispatch, router, pathname]);

  if (isCheckingAuth || loading) {
    return <Loading />;
  }

  return children;
};

export default AuthGuard;
