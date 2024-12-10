"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    useEffect(() => {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        router.push("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
