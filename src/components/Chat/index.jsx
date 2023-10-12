// import classNames from "classnames/bind";
// import { Button } from "@mui/material";

// import styles from "./Chat.module.scss";
// import { PopupHeader } from "components";
// import avatar from "data/avatar2.jpg";
// import { useAppStateContext } from "contexts/AppContext";

// const cx = classNames.bind(styles);

// const Chat = () => {
//   const { themeMode, setShowPopupStatus } = useAppStateContext();

//   return (
//     <div className={cx("wrapper", themeMode === "dark" ? "dark" : "")}>
//       <PopupHeader
//         title="Messages"
//         onClose={() => setShowPopupStatus((prev) => ({ ...prev, chat: false }))}
//       />

//       <div className={cx("item", themeMode === "dark" ? "dark" : "")}>
//         <img src={avatar} alt="" />
//         <div className={cx("content")}>
//           <p className={cx("title")}>Roman Joined the Team!</p>
//           <p className={cx("sub-title")}>Congratulate him</p>
//           <p className={cx("time")}>9:08 AM</p>
//         </div>
//       </div>

//       <div className={cx("item", themeMode === "dark" ? "dark" : "")}>
//         <img src={avatar} alt="" />
//         <div className={cx("content")}>
//           <p className={cx("title")}>Roman Joined the Team!</p>
//           <p className={cx("sub-title")}>Congratulate him</p>
//           <p className={cx("time")}>9:08 AM</p>
//         </div>
//       </div>

//       <div className={cx("item", themeMode === "dark" ? "dark" : "")}>
//         <img src={avatar} alt="" />
//         <div className={cx("content")}>
//           <p className={cx("title")}>Roman Joined the Team!</p>
//           <p className={cx("sub-title")}>Congratulate him</p>
//           <p className={cx("time")}>9:08 AM</p>
//         </div>
//       </div>

//       <div className={cx("button")}>
//         <Button fill fullwidth>
//           See all messages
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
