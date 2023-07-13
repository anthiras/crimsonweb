import React from 'react';
import { withTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
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

    return (<Row>
        <Col>
            <Nav variant="pills" className="mb-3">
                <Nav.Item>
                    <LinkContainer to="/courses/current">
                        <Nav.Link>{t('courses:current')}</Nav.Link>
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
                {permissions['courses:create'] &&
                <Nav.Item>
                    <LinkContainer to="/courses/create">
                        <Nav.Link><span className="oi oi-plus"/> {t('courses:createNew')}</Nav.Link>
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
    </Row>)
}

//const CourseNavigationWithPermissions = () => (<PermissionContainer><CourseNavigation /></PermissionContainer>);

export default withTranslation()(CourseNavigation);