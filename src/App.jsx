import React, { useEffect, useState } from "react";
import IO from "socket.io-client";

import "../public/css/common.css";
import "../public/css/style.css";
import Chat from "./components/Chat";
import { Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
const socket = IO("http://localhost:4003");

function App() {
  const [namespaces, setNamespaces] = useState([]);
  const [namespaceSoket, setNamespaceSoket] = useState(null);
  const [roomInfo, setRoomInfo] = useState({});
  const [room, setRoom] = useState([]);
  const [newMessages, setNewMessages] = useState({});
  const [userOnline, setUserOnline] = useState(0);
  const [istypingInfo, setistypingInfo] = useState({});
  const [media, setMedia] = useState({});
  const [newLocation, setNewLocation] = useState({});
  useEffect(() => {
    socket.on("namespaces", (namespaces) => {
      setNamespaces(namespaces);
      getnamespaceRooms(namespaces[0].href);
    });
  }, []);

  const getnamespaceRooms = (href) => {
    if (namespaceSoket) {
      namespaceSoket.close();
    }

    setNamespaceSoket(IO(`http://localhost:4003${href}`));
  };

  useEffect(() => {
    namespaceSoket?.on("namespaceRooms", (data) => {
      setRoom(data);
    });
  }, [namespaceSoket]);

  const joiningRooms = (room) => {
    namespaceSoket.emit("joining", room.title);
    onlineuser();
    confirmMSGChat();
    getIsTyping();
    confirmMedia();
    getLocation();
    namespaceSoket.off("roomInfo");
    namespaceSoket.on("roomInfo", (roomInfo) => {
      setRoomInfo(roomInfo);
      console.log("room", roomInfo);
    });
  };
  const sendMSG = (message, roomName, sender) => {
    namespaceSoket.emit("newMsg", { message, roomName, sender });
  };
  const confirmMSGChat = () => {
    namespaceSoket.on("confirmMsg", (data) => {
      setNewMessages(data);
    });
  };
  const onlineuser = () => {
    namespaceSoket.on("onlineUsersCount", (data) => {
      setUserOnline(data);
    });
  };
  const admitisTyping = (userID, roomName, isTyping) => {
    namespaceSoket?.emit("isTyping", { userID, roomName, isTyping });
  };
  const getIsTyping = () => {
    if (namespaceSoket) {
      namespaceSoket?.on("isTyping", (data) => {
        setistypingInfo(data);
      });
    }
  };
  const sendMedia = (filename, file, sender, roomName) => {
    namespaceSoket?.emit("newMedia", { filename, file, sender, roomName });
  };
  const confirmMedia = () => {
    namespaceSoket?.on("confirmMedia", (data) => {
      setMedia(data);
    });
  };
  const sendLocation = (location, sender, roomName) => {
    namespaceSoket?.emit("newLocation", { location, sender, roomName });
  };
  const getLocation = () => {
    namespaceSoket?.on("confirmLocation", (data) => {
      setNewLocation(data);
    });
  };
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Chat
            namespaces={namespaces}
            getnamespaceRooms={getnamespaceRooms}
            room={room}
            joiningRooms={joiningRooms}
            roomInfo={roomInfo}
            sendMSG={sendMSG}
            newMessages={newMessages}
            userOnline={userOnline}
            admitisTyping={admitisTyping}
            istypingInfo={istypingInfo}
            sendMedia={sendMedia}
            media={media}
            sendLocation={sendLocation}
            newLocation={newLocation}
          />
        }
      />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
