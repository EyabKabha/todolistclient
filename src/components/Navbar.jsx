import React from "react";
import { Menu } from "antd";
import "../styles//index.css";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseUser, faStickyNote ,faHelmetSafety, faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import authService from "../services/auth";
function Navbar() {
  return (
    <div className="nav" style={{ display: "contents" }}>
      <Menu mode="horizontal" style={{ backgroundImage: "radial-gradient(circle, rgba(238,238,238,1) 0%, rgba(201,201,201,1) 100%)" }}>
        <Menu.Item key="mail">
          <div>
          <FontAwesomeIcon icon={faHouseUser} size={"xl"} />
            <Link to="/home" style={{marginLeft:'10px'}}>Home</Link>
          </div>
        </Menu.Item>
        <Menu.Item key="alipay">
            <div>
            <FontAwesomeIcon icon={faStickyNote}size={"xl"}/>
                      <Link to="/reports" style={{marginLeft:'10px'}}>Reports</Link>
            </div>
        </Menu.Item>
        <Menu.Item key="worker">
        <FontAwesomeIcon icon={faHelmetSafety} size={"xl"}/>
          <Link to="/worker" style={{marginLeft:'10px'}}>Add Worker</Link>
        </Menu.Item>

        <Menu.Item key="logout">
          <div style={{ position:'d-flex',justifyContent:'flex-end'}}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size={"xl"}/>
          <Link to="/logout" onClick={authService.deleteAuth}>Log Out</Link>
          </div>
        </Menu.Item>

      </Menu>
      
    </div>
  );
}

export default Navbar;
