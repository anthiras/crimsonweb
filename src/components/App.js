import React from 'react';
import Container from 'react-bootstrap/Container';
import CourseEditorContainer from '../containers/CourseEditorContainer';
import CourseList from '../containers/CourseList'
import CourseNavigationContainer from '../containers/CourseNavigationContainer';
import CourseDetailsContainer from '../containers/CourseDetailsContainer';
import UserList from '../containers/UserList'
import MyProfile from '../containers/MyProfile'
import MembershipForm from '../containers/MembershipForm'
import Navigation from './Navigation'
import ErrorBoundary from '../containers/ErrorBoundary'
import Alert from 'react-bootstrap/Alert';
import Footer from '../components/Footer'
import { Route, Routes, Navigate } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import AuthCallback from '../containers/AuthCallback';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from '../components/Utilities';

const App = ({ t }) => {
    const { isLoading, error } = useAuth0();

    if (error) {
        return <div>{error.message}</div>;
    }
    
    if (isLoading) {
        return <Loading />;
    }

    return (<React.Fragment>
        <Navigation />
        <Container>
            {t('content:notice') && <Alert variant="primary">{t('content:notice')}</Alert>}
            <ErrorBoundary>
            <Routes>
                <Route path="" element={<Navigate to="/courses/current" />} />
                <Route path="courses">
                    <Route path="current/:page?" element={
                        <React.Fragment><CourseNavigationContainer /><CourseList list="current" /></React.Fragment>
                    } />
                    <Route path="mine/:page?" element={
                        <React.Fragment><CourseNavigationContainer /><CourseList list="mine" /></React.Fragment>
                    } />
                    <Route path="archive/:page?" element={
                        <React.Fragment><CourseNavigationContainer /><CourseList list="archive" /></React.Fragment>
                    } />
                    <Route path="create" element={<CourseEditorContainer />} />
                    <Route path=":courseId/edit" element={<CourseEditorContainer />} />
                    <Route path=":courseId" element={<CourseDetailsContainer />} />
                </Route>
                <Route path="/users" element={<Navigate to="/users/all" />} />
                <Route path="/users/:list/:page?" element={<UserList />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/membership" element={<MembershipForm />} />
                <Route path="/callback" element={<AuthCallback/>} />
            </Routes>
            </ErrorBoundary>
            <Footer />
        </Container>
    </React.Fragment>);
}

export default withTranslation()(App);
