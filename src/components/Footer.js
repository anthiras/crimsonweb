import React from 'react';
import { withTranslation } from 'react-i18next';

const Footer = ({t}) => (
	<div className="row">
	    <div className="col-12">
	        <address className="text-muted">© {new Date().getFullYear()} {t('content:copyright')}</address>
	    </div>
	</div>
);

export default withTranslation()(Footer);