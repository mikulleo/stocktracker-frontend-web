// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';

const Navbar: React.FC = () => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          Osprey Ledger
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/add-new-entry">
              Add New Entry
            </Nav.Link>
            <Nav.Link as={Link} to="/positions">
              Positions
            </Nav.Link>
            <Nav.Link as={Link} to="/open-positions">
              Open Positions
            </Nav.Link>
          </Nav>
          <Nav>
            <div className="nav-item">
              <Link to="/settings" className="nav-link">
                <i className="fa fa-cog"></i>
              </Link>
            </div>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
