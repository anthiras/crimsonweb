import React from 'react';
import { withTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';

const Footer = ({t}) => (
	<Container fluid>
	    <address className="text-muted">© {new Date().getFullYear()} {t('content:copyright')}</address>
	</Container>
);

export default withTranslation()(Footer);