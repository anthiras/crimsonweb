import React from 'react';
import CourseEditor from './CourseEditor'
import CourseList from '../containers/CourseList'
import CourseNavigation from './CourseNavigation'
import CourseDetails from './CourseDetails';
import UserList from '../containers/UserList'
//import UserProfile from './UserProfile';
import MyProfile from '../containers/MyProfile'
//import Membership from './Membership';
import MembershipForm from '../containers/MembershipForm'
import Navigation from './Navigation'
import { Loading } from './Utilities';
import { Router, Route, Redirect, Switch } from "react-router-dom";
import Auth from './Auth'
import history from './History';
import { withNamespaces } from 'react-i18next';

const auth = new Auth();

const App = ({ t }) => (
    <Router history={history}>
        <React.Fragment>
            <Navigation/>
            <div className="container">
                <Switch>
                    <Route exact path="/" >
                        <Redirect to="/courses" />
                    </Route>
                    <Route path="/courses">
                        <React.Fragment>
                            <CourseNavigation/>
                            <Switch>
                                <Route exact path="/courses" component={CourseList} />
                                <Route exact path="/courses/create" component={CourseEditor} />
                                <Route exact path="/courses/:courseId/edit" component={CourseEditor} />
                                <Route exact path="/courses/:courseId" component={CourseDetails} />
                            </Switch>
                        </React.Fragment>
                    </Route>
                    <Route path="/users/:page?" component={UserList} />
                    <Route path="/profile" component={MyProfile} />
                    <Route path="/membership" component={MembershipForm} />
                    <Route path="/callback" render={(props) => {
                        auth.handleAuthentication(props);
                        return <Loading />;
                    }}/>
                </Switch>
            </div>
        </React.Fragment>
    </Router>
);

export default withNamespaces()(App);
