import React from 'react';
import CourseEditorContainer from '../containers/CourseEditorContainer'
import CourseList from '../containers/CourseList'
import CourseNavigation from './CourseNavigation'
import CourseDetailsContainer from '../containers/CourseDetailsContainer';
import UserList from '../containers/UserList'
import MyProfile from '../containers/MyProfile'
import MembershipForm from '../containers/MembershipForm'
import Navigation from './Navigation'
import AuthCallback from '../containers/AuthCallback'
import ErrorBoundary from '../containers/ErrorBoundary'
import { Router, Route, Redirect, Switch } from "react-router-dom";
import history from '../shared/History';
import { withTranslation } from 'react-i18next';

const App = ({ t }) => (
    <Router history={history}>
        <React.Fragment>
            <Navigation />
            <div className="container">
                <ErrorBoundary>
                <Switch>
                    <Route exact path="/" >
                        <Redirect to="/courses" />
                    </Route>
                    <Route path="/courses">
                        <React.Fragment>
                            <CourseNavigation/>
                            <Switch>
                                <Route exact path="/courses" component={CourseList} />
                                <Route exact path="/courses/:list(current|archive)" component={CourseList} />
                                <Route exact path="/courses/create" component={CourseEditorContainer} />
                                <Route exact path="/courses/:courseId/edit" component={CourseEditorContainer} />
                                <Route exact path="/courses/:courseId" component={CourseDetailsContainer} />
                            </Switch>
                        </React.Fragment>
                    </Route>
                    <Route path="/users/:page?" component={UserList} />
                    <Route path="/profile" component={MyProfile} />
                    <Route path="/membership" component={MembershipForm} />
                    <Route path="/callback" component={AuthCallback} />
                </Switch>
                </ErrorBoundary>
            </div>
        </React.Fragment>
    </Router>
);

export default withTranslation()(App);
