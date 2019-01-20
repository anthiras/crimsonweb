import React, { Component } from 'react';
import { Loading } from '../components/Utilities';
import {
  fetchCoursesIfNeeded
} from '../actions/courses'
import { connect } from 'react-redux'
import { CourseCards } from '../components/CourseCards'

class CourseList extends Component
{
    componentDidMount() {
        this.props.dispatch(fetchCoursesIfNeeded())
    }

    render() {
        const { courses, isFetching } = this.props
        
        if (isFetching) return <Loading />;
        return <CourseCards courses={courses} />
    }
}

function mapStateToProps(state) {
  const { courses } = state
  const { isFetching, lastUpdated, items } = courses || {
    isFetching: true,
    items: null
  }

  return {
    courses: items,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(CourseList);