import React from 'react';
import { withTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = ({t}) => (
	<Row>
	    <Col>
	        <address className="text-muted">© {new Date().getFullYear()} {t('content:copyright')}</address>
	    </Col>
	</Row>
);

export default withTranslation()(Footer);