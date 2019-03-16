import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers/index'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import callApiMiddleware from './middleware/callApiMiddleware'
import * as Sentry from '@sentry/browser';

const store = createStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware,
		createLogger(),
		callApiMiddleware))

if (process.env.REACT_APP_SENTRY_DSN) {
	Sentry.init({
	  dsn: process.env.REACT_APP_SENTRY_DSN,
	  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT
	});
}

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
