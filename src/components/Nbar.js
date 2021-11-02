import React from 'react';
import {
 Navbar,
 Nav,
} from "react-bootstrap";//導入需要的component

export default function Nbar (props) {
    console.log(props.manager)
    return (
      <Navbar bg="light" expand="lg">
         <Navbar.Brand href="/">Data sharing platform</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
           <Nav className="mr-auto">
              <Nav.Link href="/CreatePage">Create member</Nav.Link>
              <Nav.Link href="/Request">Data Request</Nav.Link>
              <Nav.Link href="/MemberInform">Member information</Nav.Link>
              <Nav.Link href="/RequestList">Request list</Nav.Link>
              {props.manager&&<Nav.Link href="/PendingList">Pending list</Nav.Link>}
           </Nav>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text-black"><span id="account">{props.account}</span></small>
              </li>
            </ul>
         </Navbar.Collapse>
      </Navbar> 
    );
}
