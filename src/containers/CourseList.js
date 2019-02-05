import React, { Component } from 'react';
import { Loading } from '../components/Utilities';
import {
  fetchCourses
} from '../actions/courses'
import { connect } from 'react-redux'
import { CourseCards } from '../components/CourseCards'

class CourseList extends Component
{
    componentDidMount() {
        this.props.dispatch(fetchCourses())
    }

    render() {
        const { courses, isFetching } = this.props
        
        if (isFetching) return <Loading />;
        return <CourseCards courses={courses} />
    }
}

function mapStateToProps(state) {
  const { courses } = state
  const { coursesById, currentCourses } = courses;
  const { isFetching, items } = currentCourses || {
    isFetching: true,
    items: null
  }
  const courseObjects = items ? items.map(courseId => coursesById[courseId]) : [];

  return {
    courses: courseObjects,
    isFetching: isFetching
  }
}

export default connect(mapStateToProps)(CourseList);