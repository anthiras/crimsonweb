import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index'
import logger from 'redux-logger'
import callApiMiddleware from './middleware/callApiMiddleware'
import * as Sentry from '@sentry/react';
import Auth0ProviderWithRedirectCallback from './components/Auth0ProviderWithRedirectCallback';
import { BrowserRouter, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "react-datepicker/dist/react-datepicker.css";
import './index.css';

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: {
			ignoredActionPaths: ['shouldCallApi', 'callApi', 'onSuccess', 'response']
		}
	}).concat([logger, callApiMiddleware]),
})

if (process.env.REACT_APP_SENTRY_DSN) {
	Sentry.init({
	  dsn: process.env.REACT_APP_SENTRY_DSN,
	  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
	  tracesSampleRate: 1.0,
	  replaysSessionSampleRate: 0.1,
	  replaysOnErrorSampleRate: 1.0,	
	  integrations: [
		Sentry.reactRouterV6BrowserTracingIntegration({
		  useEffect: React.useEffect,
		  useLocation,
		  useNavigationType,
		  createRoutesFromChildren,
		  matchRoutes,
		}),
	  ],	
	});
}

const auth0Config = {
	domain: process.env.REACT_APP_AUTH0_DOMAIN,
	clientId: process.env.REACT_APP_AUTH0_FRONTEND_CLIENT_ID,
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
	authorizationParams: {
		redirect_uri: window.location.origin,
		audience: process.env.REACT_APP_AUTH0_AUDIENCE,
		scope: 'openid profile email'
	}
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<Provider store={store}>
		<BrowserRouter>
        	<Auth0ProviderWithRedirectCallback {...auth0Config}>
				<App />
			</Auth0ProviderWithRedirectCallback>
		</BrowserRouter>
	</Provider>);
