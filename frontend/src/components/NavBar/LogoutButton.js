import React, { useContext } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth0 } from "components/common/ReactAuth0SPA";

import { ENV } from "constants/Constants";

import { GlobalContext } from "context";

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const LogoutButton = () => {
  const { user, logout } = useAuth0();

  const { hasPermission } = useContext(GlobalContext);

  return (
    <UncontrolledDropdown nav inNavbar direction="down">
      <DropdownToggle nav caret id="profile-drop-down">
        <img
          src={user.picture}
          alt="Profile"
          className="nav-user-profile rounded-circle"
          width="50"
        />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem header>{user.name}</DropdownItem>
        <DropdownItem disabled>Version: {ENV}</DropdownItem>
        <DropdownItem
          tag={RouterNavLink}
          to="/profile"
          className="dropdown-profile"
          activeClassName="router-link-exact-active"
        >
          <FontAwesomeIcon icon="user" className="mr-3" /> Profile
        </DropdownItem>

        {hasPermission("edit-user") ? (
          <DropdownItem
            tag={RouterNavLink}
            to="/edit-user"
            className="dropdown-profile"
            activeClassName="router-link-exact-active"
          >
            <FontAwesomeIcon icon="tools" className="mr-3" /> Edit User
          </DropdownItem>
        ) : null}

        <DropdownItem
          id="qs-logout-btn"
          onClick={() =>
            logout({
              returnTo: window.location.origin,
            })
          }
        >
          <FontAwesomeIcon icon="power-off" className="mr-3" /> Log out
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default LogoutButton;
