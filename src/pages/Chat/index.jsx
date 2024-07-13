// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Typography } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { io } from "socket.io-client";

// import { axios } from "configs";
// import { usePermission } from "hooks";

// const socket = io("localhost:5000/socket.io", {
//     extraHeaders: {
//         Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
//     },
// })

// const ChatPage = () => {
//   usePermission();

//     const theme = useTheme();
//     const navigate = useNavigate();
//     const [isConnected, setIsConnected] = useState(socket.connected);
//     const [usersChatted, setUsersChatted] = useState([]);
//     const [activeUser, setActiveUser] = useState({
//         id: "",
//         name: "",
//     });
//     const [chats, setChats] = useState([]);

//     useEffect(() => {
//         if (
//             !sessionStorage.getItem("access-token") ||
//             !sessionStorage.getItem("refresh-token")
//         ) {
//             return navigate("/auth");
//         }

//         socket.on("connect", () => {
//             console.log("::: Socket connected");
//             setIsConnected(true);
//         });

//         socket.on("disconnect", (reason) => {
//             console.log("::: Socket disconnected: ", reason);
//             setIsConnected(false);
//         });

//         socket.on("server-send-message-to-receiver", (data) => {
//             console.log(data);
//             if (activeUser.id === data.sender_id) {
//                 setChats((prev) => [
//                     ...prev,
//                     {
//                         is_sender: false,
//                         message: data.message,
//                         created_at: data.created_at,
//                     },
//                 ]);
//             }
//         });

//         socket.on("server-send-message-was-sent", (data) => {
//             setChats((prev) => [
//                 ...prev,
//                 {
//                     id: data.id,
//                     is_sender: true,
//                     message: data.message,
//                     created_at: data.created_at,
//                 },
//             ]);
//         });

//         socket.on("server-send-error-message", (data) => {
//             console.log(">>> Error: ", data);
//         });

//         return () => {
//             socket.off("connect");
//             socket.off("disconnect");
//             socket.off("server-send-message-to-receiver");
//             socket.off("server-send-chats-of-user");
//             socket.off("server-send-error-message");
//             socket.close();
//         };
//     }, []);

//     useEffect(() => {
//         const fetchUsersChatted = async () => {
//             try {
//                 const res = await axios.get("/chats/users");
//                 setUsersChatted(res.data);
//             } catch (error) {
//                 console.log("::: Fetch users chatted failure");
//             }
//         };
//         if (isConnected) {
//             fetchUsersChatted();
//         }
//     }, [isConnected]);

//     // Handle on click to user
//     const handleOnClickChangeUser = async (user) => {
//         // Set active user
//         setActiveUser({
//             id: user.user_id,
//             name: user.name,
//         });

//         // Fetch chat messages
//         try {
//             const res = await axios.get(
//                 `/chats/messages?uid=${user.user_id}&pid=242`
//             );
//             setChats(res.data);
//         } catch (error) {
//             console.log("::: Fetch chat messages error");
//         }
//     };

//     // Handle on send message
//     const handleOnSendMessage = (e) => {
//         e.preventDefault();
//         const message = e.target.message.value;
//         const files = e.target.image.files;
//         console.log(Array.from(files));

//         let data;

//         if (files.length > 0) {
//             // Emit images to server
//             data = {
//                 receiverId: activeUser.id,
//                 files: Array.from(files),
//                 createdAt: Date.now(),
//                 type: "image",
//                 postId: 242,
//             };
//         } else {
//             // Emit message to server
//             data = {
//                 receiverId: activeUser.id,
//                 message: message,
//                 createdAt: Date.now(),
//                 type: "text",
//                 postId: 242,
//             };
//         }

//         // Emit to server
//         socket.emit("client-send-message", data);

//         // Clear input message
//         e.target.message.value = "";
//     };

//     return (
//         <>
//             {isConnected ? (
//                 <div
//                     style={{
//                         height: "560px",
//                         width: "100%",
//                         backgroundColor: "#ccc",
//                         display: "flex",
//                     }}
//                 >
//                     {/* LIST ALL USERS CHATTED */}
//                     <div
//                         style={{
//                             width: "30%",
//                             overflowY: "scroll  ",
//                             borderRight: "1px solid #333",
//                             padding: "16px",
//                         }}
//                     >
//                         {usersChatted.map((user) => (
//                             <div
//                                 key={user.user_id}
//                                 style={{
//                                     marginBottom: "12px",
//                                     cursor: "pointer",
//                                     padding: "8px",
//                                     borderRadius: "4px",
//                                 }}
//                                 className={
//                                     activeUser.id === user.user_id
//                                         ? "active"
//                                         : ""
//                                 }
//                                 onClick={() => handleOnClickChangeUser(user)}
//                             >
//                                 {user.name}
//                             </div>
//                         ))}
//                     </div>

//                     {/* CHAT CONTENT */}
//                     <div
//                         style={{
//                             flex: 1,
//                             padding: "16px",
//                             position: "relative",
//                         }}
//                     >
//                         {/* HEADER */}
//                         {/* <div style={{ borderBottom: "1px solid #333" }}>
//                             <span>{sessionStorage.getItem("name")}</span>
//                         </div> */}

//                         {/* CONTENT */}
//                         <div
//                             style={{
//                                 overflowY: "scroll",
//                                 padding: "16px 0",
//                                 height: "500px",
//                             }}
//                         >
//                             {chats.map((chat) => {
//                                 if (chat.is_sender) {
//                                     return (
//                                         /* SENDER */
//                                         <div
//                                             key={chat.id}
//                                             style={{
//                                                 display: "flex",
//                                                 justifyContent: "end",
//                                                 marginBottom: "16px",
//                                             }}
//                                         >
//                                             <div
//                                                 style={{
//                                                     borderRadius: "24px",
//                                                     backgroundColor: "#78e08f",
//                                                     padding: "8px 12px",
//                                                     position: "relative",
//                                                 }}
//                                             >
//                                                 {chat.message}
//                                             </div>
//                                         </div>
//                                     );
//                                 } else {
//                                     return (
//                                         /* RECEIVER */
//                                         <div
//                                             key={chat.id}
//                                             style={{
//                                                 display: "flex",
//                                                 justifyContent: "start",
//                                                 marginBottom: "16px",
//                                             }}
//                                         >
//                                             <div
//                                                 style={{
//                                                     borderRadius: "24px",
//                                                     backgroundColor: "#82ccdd",
//                                                     padding: "8px 12px",
//                                                     position: "relative",
//                                                 }}
//                                             >
//                                                 {chat.message}
//                                             </div>
//                                         </div>
//                                     );
//                                 }
//                             })}
//                         </div>

//                         {/* SEND INPUT */}
//                         <form
//                             style={{
//                                 position: "absolute",
//                                 bottom: 0,
//                                 left: 0,
//                                 right: 0,
//                                 display: "flex",
//                             }}
//                             onSubmit={handleOnSendMessage}
//                         >
//                             <input
//                                 type="text"
//                                 name="message"
//                                 style={{ padding: "8px", flex: 1 }}
//                             />
//                             <input type="file" name="image" id="" multiple />
//                             <button style={{ padding: "8px" }}>Send</button>
//                         </form>
//                     </div>
//                 </div>
//             ) : (
//                 <Typography color={theme.palette.color.main}>
//                     Connecting ...
//                 </Typography>
//             )}
//         </>
//     );
// };

const ChatPage = () => {
    // usePermission();

    return <></>;
};

export default ChatPage;
