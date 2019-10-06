import React, { Component } from 'react';
import { Loading } from '../components/Utilities';
import {
  fetchCourses
} from '../actions/courses'
import { connect } from 'react-redux'
import CourseCards from '../components/CourseCards'

class CourseList extends Component
{
    componentDidMount() {
        this.props.fetchCourses(this.props.list, this.props.page)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.list !== this.props.list || prevProps.page !== this.props.page) {
            this.props.fetchCourses(this.props.list, this.props.page)
        }
    }

    render() {
        const { courses, isFetching, page, lastPage, list } = this.props
        
        if (isFetching) return <Loading />;
        return <CourseCards courses={courses} page={page} lastPage={lastPage} list={list} />
    }
}

function mapStateToProps(state, ownProps) {
  const list = ownProps.match.params.list || 'current';
  const { courses } = state
  const { coursesById, currentCourses, archivedCourses, myCourses } = courses;
  const courseList = 
    list === 'current' ? currentCourses
    : list === 'archive' ? archivedCourses
    : list === 'mine' ? myCourses
    : [];

  const page = parseInt(ownProps.match.params.page || 1);
  const courseIds = courseList.pages[page];
  const coursesOnCurrentPage = courseIds ? courseIds.map(courseId => coursesById[courseId]) : [];

  return {
    courses: coursesOnCurrentPage,
    isFetching: courseList.isFetching,
    list: list,
    page: page,
    lastPage: courseList.lastPage
  }
}

const actionCreators = {
    fetchCourses
}

export default connect(mapStateToProps, actionCreators)(CourseList);