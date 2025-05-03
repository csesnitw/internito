import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../slices/authSlice";

function FetchUserAndRedirect() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/login/success`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.success) {
          dispatch(setUser(data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        dispatch(setUser(null));
      }
    };
    fetchUser();
  }, [dispatch]);

  return <Outlet />;
}

export default FetchUserAndRedirect;