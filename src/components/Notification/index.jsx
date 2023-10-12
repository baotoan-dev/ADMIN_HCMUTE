import classNames from "classnames/bind";
import { Button } from "@mui/material";

import styles from "./Notification.module.scss";
import avatar from "data/avatar2.jpg";
import { useAppStateContext } from "contexts/AppContext";

const cx = classNames.bind(styles);

const Notification = () => {
  const { themeMode } = useAppStateContext();

  return (
    <div className={cx("wrapper", themeMode === "dark" ? "dark" : "")}>
      <div className={cx("item", themeMode === "dark" ? "dark" : "")}>
        <img src={avatar} alt="" />
        <div className={cx("content")}>
          <p className={cx("title")}>Roman Joined the Team!</p>
          <p className={cx("sub-title")}>Congratulate him</p>
        </div>
      </div>

      <div className={cx("item", themeMode === "dark" ? "dark" : "")}>
        <img src={avatar} alt="" />
        <div className={cx("content")}>
          <p className={cx("title")}>Roman Joined the Team!</p>
          <p className={cx("sub-title")}>Congratulate him</p>
        </div>
      </div>

      <div className={cx("item", themeMode === "dark" ? "dark" : "")}>
        <img src={avatar} alt="" />
        <div className={cx("content")}>
          <p className={cx("title")}>Roman Joined the Team!</p>
          <p className={cx("sub-title")}>Congratulate him</p>
        </div>
      </div>

      <div className={cx("button")}>
        <Button lg>See all notifications</Button>
      </div>
    </div>
  );
};

export default Notification;
