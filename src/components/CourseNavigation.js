import React from 'react';
import { withTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { LinkContainer } from 'react-router-bootstrap'
import usePermissions from '../hooks/usePermissions';

const CourseNavigation = ({ t, list, links }) => {
    const { isAuthenticated } = useAuth0();
    const permissions = usePermissions();

    return (<Container fluid>
    <Row>
        <Col>
            <Nav variant="underline" className="mb-3">
                <Nav.Item>
                    <LinkContainer to="/courses/current">
                        <Nav.Link>{t('courses:current')}</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                    <LinkContainer to="/courses/events">
                        <Nav.Link>{t('courses:events')}</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                {isAuthenticated &&
                <Nav.Item>
                    <LinkContainer to="/courses/mine">
                        <Nav.Link>{t('courses:mine')}</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                }
                {permissions['courses:create'] &&
                <Nav.Item>
                    <LinkContainer to="/courses/archive">
                        <Nav.Link>{t('courses:archive')}</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                }
            </Nav>
        </Col>
        {list === 'mine' && links != null &&
            <Col className="text-end">
                <DropdownButton title="…" id="courseListActions" variant="outline-secondary">
                    <Dropdown.Item href={links['ics']}>{t('courses:iCalFeed')}</Dropdown.Item>
                </DropdownButton>
            </Col>
        }
    </Row>
    </Container>)
}

//const CourseNavigationWithPermissions = () => (<PermissionContainer><CourseNavigation /></PermissionContainer>);

export default withTranslation()(CourseNavigation);