import classNames from "classnames/bind";
import { Button } from "@mui/material";

import styles from "./PopupHeader.module.scss";
import { useAppStateContext } from "contexts/AppContext";
import { CloseIcon } from "components/Icons";

const cx = classNames.bind(styles);

const PopupHeader = ({ title, onClose = null }) => {
  const { themeMode } = useAppStateContext();

  return (
    <div className={cx("wrapper", themeMode === "dark" ? "dark" : "")}>
      <p className={cx(themeMode === "dark" ? "dark" : "")}>{title}</p>
      {onClose && (
        <Button
          primary
          leftIcon={<CloseIcon />}
          rounded
          notBorder
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default PopupHeader;
