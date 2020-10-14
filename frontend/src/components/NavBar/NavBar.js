import React from "react";
import { Navbar, Nav, NavLink, NavbarBrand } from "reactstrap";
import { NavLink as RouterNavLink, Link } from "react-router-dom";

import "assets/style/NavBar.css";

import { useAuth0 } from "components/common/ReactAuth0SPA";

import SeisTechLogo from "assets/seistech_long_logo_simple.png";

import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

const MainNav = () => {
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
      <NavLink
        tag={RouterNavLink}
        to="/hazard"
        exact
        activeClassName="router-link-exact-active"
      >
        Hazard Analysis
      </NavLink>
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
