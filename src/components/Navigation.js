import React from 'react';
import { NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap'
import i18n from '../shared/i18n';
import { useAuth0 } from '@auth0/auth0-react';
import usePermissions from '../hooks/usePermissions';

const Navigation = ({ t }) => {
    const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
    const permissions = usePermissions();

    return (
        <Navbar bg="dark" data-bs-theme="dark" className="mb-3">
            <Nav className="me-auto">
                <LinkContainer to="/courses/current">
                    <Nav.Link>{t('titles:courses')}</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/membership">
                    <Nav.Link>{t('titles:membership')}</Nav.Link>
                </LinkContainer>
                {permissions['users:list'] && permissions['roles:assignRole:instructor'] && 
                    <LinkContainer to="/users">
                        <Nav.Link>{t('titles:users')}</Nav.Link>
                    </LinkContainer>}
            </Nav>
            <Nav activeKey={i18n.language}>
                <NavDropdown title={t('common:language:this')} align='end'>
                    <NavDropdown.Item eventKey="da" onClick={() => i18n.changeLanguage('da')}>
                        {t('common:language:da')}
                    </NavDropdown.Item>
                    <NavDropdown.Item  eventKey="en" onClick={() => i18n.changeLanguage('en')}>
                        {t('common:language:en')}
                    </NavDropdown.Item>
                </NavDropdown>
                {!isAuthenticated && (
                    <Nav.Link onClick={() => loginWithRedirect({ appState: { returnTo: window.location.pathname } })}>
                        {t('actions:signIn')}
                    </Nav.Link>
                )}
                {isAuthenticated && (
                    <NavDropdown align='end' title={
                        <div className='d-inline'>
                            <img src={user.picture} width="20" height="20" className="align-middle me-1" alt={user.name} />
                            <span className="d-none d-md-inline">{user.name}</span>
                        </div>
                    }>
                        <NavLink to="/profile" className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")}>{t('titles:myProfile')}</NavLink>
                        <NavDropdown.Item onClick={() => logout({ returnTo: window.location.origin })}>{t('actions:signOut')}</NavDropdown.Item>
                    </NavDropdown>
                )}
            </Nav>
        </Navbar>
    );
}

//const NavigationWithPermissions = (props) => { return <PermissionContainer ><Navigation {...props} /></PermissionContainer> };

export default withTranslation()(Navigation);