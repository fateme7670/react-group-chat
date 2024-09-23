import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Chat({
  namespaces,
  getnamespaceRooms,
  room,
  joiningRooms,
  roomInfo,
  sendMSG,
  newMessages,
  userOnline,
  admitisTyping,
  istypingInfo,
  sendMedia,
  media,
  sendLocation,
newLocation
}) {
  const navigate = useNavigate();
  const [mainNamespace, setMainNamespace] = useState({});
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [newMSG, setNewMSG] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [location, setlocation] = useState([]);
  const isTypingTimout = useRef();
  console.log('nn',location);
  useEffect(() => {
    setMainNamespace(namespaces[0]);
  }, [namespaces]);
  const confirmUser = async (token) => {
    const res = await fetch("http://localhost:4003/api/auth/me", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200) {
      const user = await res.json();
      console.log(user);
      setUser({ ...user });
    } else {
      navigate("/auth");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      confirmUser(token);
    } else {
      navigate("/auth");
    }
  }, []);
  useEffect(() => {
    if (newMessages.message) {
      setNewMSG((messages) => [...messages, newMessages]);
    }
  }, [newMessages]);
  useEffect(() => {
    if (media.file) {
      setNewMedia((medias) => [...medias, media]);
    }
  }, [media]);
  useEffect(() => {
    // if (media.file) {
      setlocation((location) => [...location, newLocation]);
    // }
  }, [newLocation]);
  const sendMsgHandler = (event) => {
    event.preventDefault();
    console.log(message);
    sendMSG(message, roomInfo.title, user._id);
    setMessage("");
  };
  useEffect(() => {
    admitisTyping(user?._id, roomInfo?.title, isTyping);
  }, [isTyping]);
  console.log("istypingInfo", istypingInfo);
  return (
    <main className="main">
      <section className="costom-row">
        <div className="costom-col-3">
          <section className="sidebar">
            <div className="sidebar__header">
              <div className="sidebar__menu">
                <i className="sidebar__menu-icon animated-menu-icon"></i>
              </div>
              <div className="sidebar__searchbar">
                <input
                  type="text"
                  className="sidebar__searchbar-input"
                  placeholder="Search"
                />
                <i className="sidebar__searchbar-icon fa fa-search"></i>
              </div>
            </div>
            <div className="sidebar__categories">
              <ul className="sidebar__categories-list">
                {namespaces.map((namespace) => (
                  <li
                    key={namespace._id}
                    className={`sidebar__categories-item ${
                      mainNamespace?.title === namespace.title
                        ? "sidebar__categories-item--active"
                        : ""
                    }`}
                    onClick={() => {
                      getnamespaceRooms(namespace.href);

                      setMainNamespace({ ...namespace });
                    }}
                    data-category-name="all"
                  >
                    <span className="sidebar__categories-text">
                      {namespace.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sidebar__contact data-category-all sidebar__contact--active">
              <ul className="sidebar__contact-list">
                {room.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => joiningRooms(item)}
                    className="sidebar__contact-item"
                  >
                    <a className="sidebar__contact-link" href="#">
                      <div className="sidebar__contact-left">
                        <div className="sidebar__contact-left-left">
                          <img
                            className="sidebar__contact-avatar"
                            src={
                              `http://localhost:4003/${item.image}` ||
                              "public/images/avatar.jpg"
                            }
                          />
                        </div>
                        <div className="sidebar__contact-left-right">
                          <span className="sidebar__contact-title">
                            {item.title}
                          </span>
                          <div className="sidebar__contact-sender">
                            <span className="sidebar__contact-sender-name">
                              Qadir Yolme :
                            </span>
                            <span className="sidebar__contact-sender-text">
                              سلام داداش خوبی؟
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="sidebar__contact-right">
                        <span className="sidebar__contact-clock">15.53</span>
                        <span className="sidebar__contact-counter sidebar__counter sidebar__counter-active">
                          66
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <button className="sidebar-bottom-btn btn-circle rp btn-corner z-depth-1 btn-menu-toggle">
            <span className="tgico animated-button-icon-icon animated-button-icon-icon-first">
              
            </span>
          </button>
        </div>
        <div className="costom-col-9 container-hide">
          <section className="chat">
            <div
              className={`chat__header ${
                roomInfo?.title ? "chat__header--active" : ""
              }`}
            >
              <div className="chat__header-left">
                <button className="btn-icon sidebar-close-button">
                  <span className="tgico button-icon"></span>
                  <span className="badge badge-20 badge-primary is-badge-empty back-unread-badge"></span>
                </button>
                <div className="chat__header-left-left">
                  <img
                    className="chat__header-avatar"
                    src={
                      `http://localhost:4003/${roomInfo.image}` ||
                      "public/images/avatar.jpg"
                    }
                  />
                </div>
                <div className="chat__header-left-right">
                  <span className="chat__header-name">{roomInfo.title}</span>
                  <span className="chat__header-status">
                    {istypingInfo &&
                    istypingInfo.username !== user.username &&
                    istypingInfo.isTyping
                      ? `${istypingInfo.username} is typing`
                      : `            ${userOnline} user online`}
                  </span>
                </div>
              </div>
              <div className="chat__header-right">
                <div className="chat__header-search icon-phone">
                  <span className="tgico button-icon chat__header-phone-icon"></span>
                </div>
                <div className="chat__header-search">
                  <i className="chat__header-search-icon fa fa-search"></i>
                </div>
                <div className="chat__header-menu">
                  <i className="chat__header-menu-icon fa fa-ellipsis-v"></i>
                </div>
              </div>
            </div>
            <div
              className={`chat__content ${
                roomInfo.title ? "chat__content--active" : ""
              }`}
            >
              <div className="chat__content-date">
                <span className="chat__content-date-text"> Today </span>
              </div>
              <div className="chat__content-main">
                {roomInfo?.messages?.map((item) => {
                  if (item.sender !== user._id) {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-sender-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-sender">
                          <span className="chat__content-sender-text">
                            {item.message}
                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-receiver-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-receiver">
                          <span className="chat__content-receiver-text">
                            {" "}
                            {item.message}
                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
                {newMSG.map((item) => {
                  if (item.sender !== user._id) {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-sender-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-sender">
                          <span className="chat__content-sender-text">
                            {item.message}
                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-receiver-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-receiver">
                          <span className="chat__content-receiver-text">
                            {" "}
                            {item.message}
                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
                {location.map((item) => {
                  if (item.sender !== user._id) {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-sender-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-sender">
                          <span className="chat__content-sender-text">
                            {item.message}
                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-receiver-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-receiver">
                          <span className="chat__content-receiver-text">
                            {" "}
                            {/* {item.message} */}
                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
                  {roomInfo?.medias?.map((item) => {
                  if (item.sender !== user._id) {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-sender-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-sender">
                          <span className="chat__content-sender-text">
                           <img width={'100%'} src={`http://localhost:4003/${item.path}`}/>
                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-receiver-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-receiver">
                          <span className="chat__content-receiver-text">
                            {" "}
                            <img width={'100%'} src={`http://localhost:4003/${item.path}`}/>

                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
                  {newMedia.map((item) => {
                  if (item.sender !== user._id) {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-sender-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-sender">
                          <span className="chat__content-sender-text">
                          <img width={'100%'} src={`http://localhost:4003/${item.path}`}/>

                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={Math.random()}
                        className="chat__content-receiver-wrapper chat__content-wrapper"
                      >
                        <div className="chat__content-receiver">
                          <span className="chat__content-receiver-text">
                            {" "}
                            <img width={'100%'} src={`http://localhost:4003/${item.path}`}/>

                          </span>
                          <span className="chat__content-chat-clock">
                            17:55
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="chat__content-bottom-bar">
                <div className="chat__content-bottom-bar-left">
                  <form onSubmit={sendMsgHandler}>
                    <input
                      onChange={(event) => {
                        setMessage(event.target.value);
                        if (!isTyping) {
                          setIsTyping(true);
                        }
                        if (isTypingTimout) {
                          clearTimeout(isTypingTimout.current);
                        }
                        isTypingTimout.current = setTimeout(() => {
                          setIsTyping(false);
                        }, 2000);
                      }}
                      value={message}
                      className="chat__content-bottom-bar-input"
                      placeholder="Message"
                      type="text"
                    />
                  </form>
                  <i className="chat__content-bottom-bar-icon-left tgico button-icon laugh-icon"></i>
                  <div className="upload-button">
                    <i className="chat__content-bottom-bar-icon-right tgico button-icon file-icon"></i>
                    <input
                      type="file"
                      id="file-input"
                      onChange={(event) =>
                        sendMedia(
                          event.target.files[0].name,
                          event.target.files[0],
                          user._id,
                          roomInfo.title,
                      
                        )
                      }
                    />
                  </div>
                 <div className="map-location">
                 <i
                                   onClick={()=>sendLocation({ x: 36.841781928656516, y: 54.43292097321089 },user._id,roomInfo.title)}

                    class="location-icon chat__content-bottom-location-icon-right fas fa-map-marker-alt"
                  ></i>

                  <input
                    
                    class="chat__content-bottom-location-icon-right fas fa-map-marker-alt"
                  />
                 </div>
                </div>
                <div className="chat__content-bottom-bar-right">
                  <i className="chat__content-bottom-bar-right-icon fa fa-microphone"></i>
                </div>
                <div className="chat__content-bottom-bar-right">
                  <span
                    style={{
                      backgroundColor: "var(--secondary-color)",
                      top: "-37px",
                      fontSize: "2.4rem",
                      visibility: "hidden",
                      opacity: "0",
                    }}
                    className="chat__content-bottom-bar-right-icon tgico button-icon arrow-bottom-icon__active"
                  >
                    
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <div className="contact-menu context-menu">
        {/* <ul className="contact-menu__list context-menu__list">
                <li className="contact-menu__item context-menu__item">
                    <i className="contact-menu__icon context-menu__icon fa fa-trash"></i>
                    <span className="contact-menu__text context-menu__text">Open in new salam</span>
                </li>
            
                <li className="contact-menu__item context-menu__item">
                    <i className="contact-menu__icon context-menu__icon fa fa-trash"></i>
                    <span className="contact-menu__text context-menu__text">Open in new tab</span>
                </li>
            
                <li className="contact-menu__item context-menu__item">
                    <i className="contact-menu__icon context-menu__icon fa fa-trash"></i>
                    <span className="contact-menu__text context-menu__text">Open in new tab</span>
                </li>
            
                <li className="contact-menu__item context-menu__item">
                    <i className="contact-menu__icon context-menu__icon fa fa-trash"></i>
                    <span className="contact-menu__text context-menu__text">Open in new tab</span>
                </li>
            
                <li className="contact-menu__item context-menu__item">
                    <i className="contact-menu__icon context-menu__icon fa fa-trash"></i>
                    <span className="contact-menu__text context-menu__text">Open in new tab</span>
                </li>
            
                <li className="contact-menu__item context-menu__item context-menu__item-delete">
                    <i className="contact-menu__icon context-menu__icon fa fa-trash"></i>
                    <span className="contact-menu__text context-menu__text">Open in new tab</span>
                </li>
            
        </ul> */}
      </div>

      <div className="chat-menu context-menu">
        <div className="contact-menu__list context-menu__list">
          <div className="contact-menu__item context-menu__item">
            <span className="tgico btn-menu-item-icon"></span>
            <span className="contact-menu__text context-menu__text">Reply</span>
          </div>
          <div className="contact-menu__item context-menu__item">
            <span className="contact-menu__icon context-menu__icon tgico btn-menu-item-icon">
              
            </span>
            <span className="contact-menu__text context-menu__text">Copy</span>
          </div>
          <div className="contact-menu__item context-menu__item">
            <span className="contact-menu__icon context-menu__icon tgico btn-menu-item-icon">
              
            </span>
            <span className="contact-menu__text context-menu__text">
              Translate
            </span>
          </div>
          <div className="contact-menu__item context-menu__item">
            <span className="contact-menu__icon context-menu__icon tgico btn-menu-item-icon">
              
            </span>
            <span className="contact-menu__text context-menu__text">Pin</span>
          </div>
          <div className="contact-menu__item context-menu__item">
            <span className="contact-menu__icon context-menu__icon tgico btn-menu-item-icon">
              
            </span>
            <span className="contact-menu__text context-menu__text">
              Forward
            </span>
          </div>
          <div className="contact-menu__item context-menu__item">
            <span className="contact-menu__icon context-menu__icon tgico btn-menu-item-icon">
              
            </span>
            <span className="contact-menu__text context-menu__text">
              Select
            </span>
          </div>
          <div className="contact-menu__item context-menu__item danger">
            <span className="contact-menu__icon context-menu__icon tgico btn-menu-item-icon">
              
            </span>
            <span className="contact-menu__text context-menu__text">
              Delete
            </span>
          </div>
        </div>
      </div>

      <div className="setting-menu">
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Saved Messages
          </span>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Archived Chats
          </span>
          <span
            style={{ flex: "1", textAlign: "right", opacity: "0.7" }}
            className="badge badge-24 badge-gray archived-count"
          >
            6
          </span>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            My Stories
          </span>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Contacts
          </span>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Settings
          </span>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Dark Mode
          </span>
          <label className="checkbox-field checkbox-without-caption checkbox-field-toggle">
            <input className="checkbox-field-input" type="checkbox" />
            <div className="checkbox-toggle">
              <div className="checkbox-toggle-circle"></div>
            </div>
          </label>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Animations
          </span>
          <label className="checkbox-field checkbox-without-caption checkbox-field-toggle">
            <input className="checkbox-field-input" type="checkbox" />
            <div className="checkbox-toggle">
              <div className="checkbox-toggle-circle"></div>
            </div>
          </label>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Telegram Features
          </span>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Report Bug
          </span>
        </div>
        <div className="contact-menu__item context-menu__item a">
          <span className="tgico btn-menu-item-icon">A</span>
          <span className="contact-menu__text context-menu__text">
            Switch to A version
          </span>
        </div>
        <div className="contact-menu__item context-menu__item">
          <span className="tgico btn-menu-item-icon"></span>
          <span className="contact-menu__text context-menu__text">
            Install App
          </span>
        </div>
        <a
          href="https://github.com/morethanwords/tweb/blob/master/CHANGELOG.md"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-menu-footer"
        >
          <span className="btn-menu-footer-text">
            Telegram WebK 2.1.0 (509)
          </span>
        </a>
      </div>
    </main>
  );
}

export default Chat;
