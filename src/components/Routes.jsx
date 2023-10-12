import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { superAdminRoutes, normalAdminRoutes, publicRoutes } from "routes";

const RoutesDefined = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState();

  // CHECK ROLE
  // useEffect(() => {
  //     const sessionRole = sessionStorage.getItem("role");
  //     if (
  //         !sessionRole ||
  //         Number(sessionRole) < 0 ||
  //         Number(sessionRole) > 1
  //     ) {
  //         navigate("/auth");
  //     }
  //     setRole(Number(sessionRole));
  // }, []);

  return (
    <Routes>
      {/* {role === 0 &&
                normalAdminRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <route.layout>
                                <route.component />
                            </route.layout>
                        }
                    />
                ))}
            {role === 1 &&
                superAdminRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <route.layout>
                                <route.component />
                            </route.layout>
                        }
                    />
                ))} */}
    </Routes>
  );
};

export default RoutesDefined;
