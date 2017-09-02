import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default () => (
  <Navbar collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">MemoryTrail</Link> <small>Explore and share</small>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <LinkContainer to='/post/new'>
          <NavItem>Write a Story</NavItem>
        </LinkContainer>
        <Navbar.Text >
          <Navbar.Link href="/profile">Profile</Navbar.Link>
        </Navbar.Text>
        <Navbar.Text >
          <Navbar.Link href="/logout">Logout</Navbar.Link>
        </Navbar.Text>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
