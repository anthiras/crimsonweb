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
        this.props.fetchCourses(this.props.list)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.list !== this.props.list) {
            this.props.fetchCourses(this.props.list)
        }
    }

    render() {
        const { courses, isFetching } = this.props
        
        if (isFetching) return <Loading />;
        return <CourseCards courses={courses} />
    }
}

function mapStateToProps(state, ownProps) {
  const list = ownProps.match.params.list || 'current';
  const { courses } = state
  const { coursesById, currentCourses, archivedCourses } = courses;
  const courseList = list === 'archive' ? archivedCourses : currentCourses;
  const { isFetching, items } = courseList || {
    isFetching: true,
    items: null
  }
  const courseObjects = items ? items.map(courseId => coursesById[courseId]) : [];

  return {
    courses: courseObjects,
    isFetching: isFetching,
    list: list
  }
}

const actionCreators = {
    fetchCourses
}

export default connect(mapStateToProps, actionCreators)(CourseList);