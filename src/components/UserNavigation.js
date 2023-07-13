import React from 'react';
import { withTranslation } from 'react-i18next';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap'

const UserNavigation = ({ t }) => (
    <Nav variant='pills' className="mb-3">
        <Nav.Item>
            <LinkContainer to="/users/all" end={false}>
                <Nav.Link>{t('users:all')}</Nav.Link>
            </LinkContainer>
        </Nav.Item>
        <Nav.Item>
            <LinkContainer to="/users/members" end={false}>
                <Nav.Link>{t('users:members')}</Nav.Link>
                </LinkContainer>
        </Nav.Item>
        <Nav.Item>
            <LinkContainer to="/users/paid" end={false}>
                <Nav.Link>{t('users:paidMembers')}</Nav.Link>
            </LinkContainer>
        </Nav.Item>
        <Nav.Item>
            <LinkContainer to="/users/unpaid" end={false}>
                <Nav.Link>{t('users:unpaidMembers')}</Nav.Link>
            </LinkContainer>
        </Nav.Item>
    </Nav>
)

export default withTranslation()(UserNavigation);