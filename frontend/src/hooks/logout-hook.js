import { useEffect } from "react";

export const useLogout = () => {
  const timeout =
    new Date(localStorage.getItem("expiresIn")).getTime() - Date.now();

  useEffect(() => {
    if (localStorage.getItem("expiresIn") && localStorage.getItem("token")) {
      setTimeout(() => {
        localStorage.removeItem("expiresIn");
        window.location.reload();
      }, timeout);
    }
  }, [timeout]);
};
