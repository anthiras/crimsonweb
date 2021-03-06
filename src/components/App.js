import React from 'react';
import CourseEditorContainer from '../containers/CourseEditorContainer'
import CourseList from '../containers/CourseList'
import CourseNavigationContainer from '../containers/CourseNavigationContainer';
import CourseDetailsContainer from '../containers/CourseDetailsContainer';
import UserList from '../containers/UserList'
import MyProfile from '../containers/MyProfile'
import MembershipForm from '../containers/MembershipForm'
import Navigation from './Navigation'
import AuthCallback from '../containers/AuthCallback'
import ErrorBoundary from '../containers/ErrorBoundary'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import { Router, Route, Redirect, Switch } from "react-router-dom";
import history from '../shared/History';
import { withTranslation } from 'react-i18next';

const App = ({ t }) => (
    <Router history={history}>
        <React.Fragment>
            <Navigation />
            <div className="container">
                <Alert text={t('content:notice')} />
                <ErrorBoundary>
                <Switch>
                    <Route exact path="/" >
                        <Redirect to="/courses/current" />
                    </Route>
                    <Route path="/courses">
                        <React.Fragment>
                            <Switch>
                                <Route exact path="/courses/:list(current|archive|mine)/:page?" component={CourseNavigationContainer} />
                                <Route path="/courses" component={CourseNavigationContainer} />
                            </Switch>
                            <Switch>
                                <Route exact path="/courses">
                                    <Redirect to="/courses/current" />
                                </Route>
                                <Route exact path="/courses/:list(current|archive|mine)/:page?" component={CourseList} />
                                <Route exact path="/courses/create" component={CourseEditorContainer} />
                                <Route exact path="/courses/:courseId/edit" component={CourseEditorContainer} />
                                <Route exact path="/courses/:courseId" component={CourseDetailsContainer} />
                            </Switch>
                        </React.Fragment>
                    </Route>
                    <Route exact path="/users">
                        <Redirect to="/users/all" />
                    </Route>
                    <Route path="/users/:list(all|members|unpaid|paid)/:page?" component={UserList} />
                    <Route path="/profile" component={MyProfile} />
                    <Route path="/membership" component={MembershipForm} />
                    <Route path="/callback" component={AuthCallback} />
                </Switch>
                </ErrorBoundary>
                <Footer />
            </div>
        </React.Fragment>
    </Router>
);

export default withTranslation()(App);
