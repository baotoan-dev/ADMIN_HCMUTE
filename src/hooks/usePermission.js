import instance from "configs/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const acceptedUrlForWorker = [
  "/admin/posts/create",
  "/admin/worker-manager/detail",
];

const usePermission = (callback = null) => {
  const navigate = useNavigate();
  
  // console.log("usePermission")

  const getNewAccessToken = async () => {
    await instance.post("/v1/reset-access-token", {
      refreshToken: localStorage.getItem("refresh-token"),
    }).then((res) => {
      sessionStorage.setItem("access-token", res.data.accessToken);
      instance.defaults.headers.common["Authorization"] =
        "Bearer " + sessionStorage.getItem("access-token");
      window.location.reload();
      
    }).catch((err) => {
      console.log(err);
      sessionStorage.clear();
      localStorage.clear();
      navigate("/admin/auth");
    });
  }

  const init = async () => {
    const role = localStorage.getItem("role");

    if (
      // !sessionStorage.getItem("access-token") ||
      !localStorage.getItem("refresh-token") ||
      (role !== "1" && role !== "2")
    ) {
      sessionStorage.clear();
      localStorage.clear();
      navigate("/admin/auth");
    } else if (!sessionStorage.getItem("access-token")) {
      await getNewAccessToken();
    } else if (sessionStorage.getItem("access-token")) {
      instance.defaults.headers.common["Authorization"] =
        "Bearer " + sessionStorage.getItem("access-token");
    }

    if (role === "2") {
      if (
        !window.location.pathname.startsWith("/admin/posts") &&
        !acceptedUrlForWorker.includes(window.location.pathname)
      ) {
        // console.log("Not permission");
        navigate("/admin/not-permission");
      }
    }

    if (callback) {
      callback();
    }
  };

  useEffect(() => {
    init();
  }, []);
};

export default usePermission;
