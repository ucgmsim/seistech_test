import React, { useContext } from "react";

import { Navbar, Nav, NavLink, NavbarBrand } from "reactstrap";
import { NavLink as RouterNavLink, Link } from "react-router-dom";

import { useAuth0 } from "components/common/ReactAuth0SPA";
import { GlobalContext } from "context";

import { LogoutButton, LoginButton } from "components/NavBar";

import "assets/style/NavBar.css";
import SeisTechLogo from "assets/seistech_long_logo_simple.png";

const MainNav = () => {
  const { hasPermission } = useContext(GlobalContext);

  return (
    <Nav className="mr-auto" navbar>
      <NavLink
        tag={RouterNavLink}
        to="/"
        exact
        activeClassName="router-link-exact-active"
      >
        Home
      </NavLink>
      {hasPermission("hazard") ? (
        <NavLink
          tag={RouterNavLink}
          to="/hazard"
          exact
          activeClassName="router-link-exact-active"
        >
          Hazard Analysis
        </NavLink>
      ) : null}

      {hasPermission("project") ? (
        <NavLink
          tag={RouterNavLink}
          to="/project"
          exact
          activeClassName="router-link-exact-active"
        >
          Projects
        </NavLink>
      ) : null}
    </Nav>
  );
};

const AuthNav = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Nav className="justify-content-end">
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </Nav>
  );
};

const NavBar = () => {
  return (
    <Navbar color="light" light expand="md" bg="dark">
      <div className="container-fluid max-width">
        <NavbarBrand tag={Link} to={"/"}>
          <img
            src={SeisTechLogo}
            alt=""
            width="150"
            className="nav-brand-logo"
          />
        </NavbarBrand>

        <MainNav />

        <AuthNav />
      </div>
    </Navbar>
  );
};

export default NavBar;
