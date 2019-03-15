import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error, errorInfo) {
    	console.log(error)
    	console.log(errorInfo)
      this.setState({ error });
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.captureException(error);
      });
    }

    render() {
    	const { t } = this.props;
        if (this.state.error) {
            return (
              <p className="lead text-center text-muted my-5">{t('common:anErrorOccurred')}</p>
            );
        } else {
            return this.props.children;
        }
    }
}

export default withNamespaces()(ErrorBoundary);