import React from 'react';
import { withTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react';

const ErrorBoundary = ({ t, children }) => 
  <Sentry.ErrorBoundary className="lead text-center text-muted my-5" fallback={<p>{t('common:anErrorOccurred')}</p>}>
    {children}
  </Sentry.ErrorBoundary>;

export default withTranslation()(ErrorBoundary);