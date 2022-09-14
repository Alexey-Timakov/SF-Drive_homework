import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Link } from "react-router-dom";

import { API_URL } from "../../http";

import Logo from "./Logo";
import { UserState } from "../../interfaces/UserState";

import defaultAvatar from "./images/default-user.jpg";
import "./images/menu_compact.svg";
import "./images/close_cross.svg";

function TopMenuCompactUnreg() {
  const userID = useSelector((state: UserState) => state?.user?.id);
  const userAvatarLink = useSelector((state: UserState) => state?.user?.userAvatarLink);
  const userName = useSelector((state: UserState) => state?.user?.userName);
  const [userNameAndF, setUserNameAndF] = useState(null);

  const genUserNameAndF = () => {
    const userN = userName?.split(" ")[0];
    const userF = userName?.split(" ")[2].slice(0, 1);
    const userNameAndF = userN + " " + userF + ".";
    setUserNameAndF(userNameAndF);
  }

  const hideCompactMenu = () => {
    document.querySelector(".menu-right__compact-wrapper").classList.remove("active");
  }

  const showCompactMenu = (event) => {
    event.preventDefault();
    document.querySelector(".menu-right__compact-wrapper").classList.add("active");
  }

  const showLoginWindow = () => {
    hideCompactMenu();
    document.querySelector(".login-window__wrapper").classList.add("active");
    document.querySelector(".login-window__fade").classList.add("active");
  }

  useEffect(() => {
    genUserNameAndF();
  }, [userName]);

  return (
    <>
      <a className="menu-right__compact" href="" aria-label="Меню сайта" onClick={showCompactMenu}><img src="./menu_compact.svg" alt="Меню сайта" title="Меню" /></a>
      <div className="menu-right__compact-wrapper">
        <div className="menu-right__compact-header">
          <Logo />
          <div className="menu-right__compact-close">
            <a onClick={hideCompactMenu} target="_blank" aria-label="Закрыть меню"><img src="./close_cross.svg" alt="" aria-hidden="true" title="Закрыть меню" /></a>
          </div>
        </div>
        {!userID && <div className="menu-right__compact-links">
          <div className="link"><Link to="/about" aria-label="О нас" onClick={hideCompactMenu}>О нас</Link></div>
          <div className="link"><Link to="/" aria-label="Условия" onClick={hideCompactMenu}>Условия</Link></div>
          <div className="link"><Link to="/faq" aria-label="Частые вопросы" onClick={hideCompactMenu}>Частые вопросы</Link></div>
        </div>}
        {userID && <div className="menu-right__compact-links">
          <div className="link"><Link to="" aria-label="Бронирования" onClick={hideCompactMenu}>Бронирования</Link></div>
          <div className="link"><Link to="" aria-label="Мои автомобили" onClick={hideCompactMenu}>Мои автомобили</Link></div>
          <div className="link"><Link to="" aria-label="Сообщения" onClick={hideCompactMenu}>Сообщения</Link></div>
        </div>}
        <div className="menu-right__compact-footer">
          {!userID && <button className="compact-button" onClick={showLoginWindow}>Войти</button>}
          {userID &&
            <div className="menu-right__avatar-and-name">
              {!userAvatarLink && <div className="menu-right__avatar"><img src={defaultAvatar} /></div>}
              {userAvatarLink && <div className="menu-right__avatar"><img src={`${API_URL}/${userAvatarLink}`} /></div>}
              <div className="menu-right__short-name">{userNameAndF}</div>
            </div>}
        </div>
      </div>
    </>
  )
}

export default TopMenuCompactUnreg;