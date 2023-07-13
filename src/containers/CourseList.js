import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCourseActions from '../actions/courses'
import { useSelector } from 'react-redux'
import CourseCards from '../components/CourseCards'

function mapStateToProps(state, ownProps) {
  const list = ownProps.list || 'current';
  const { courses } = state
  const { coursesById, currentCourses, archivedCourses, myCourses } = courses;
  const courseList = 
    list === 'current' ? currentCourses
    : list === 'archive' ? archivedCourses
    : list === 'mine' ? myCourses
    : [];

  const page = parseInt(ownProps.page || 1);
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

const CourseList = ({ list }) => {
  let { page } = useParams();
  page = page ? parseInt(page) : 1;
  const { fetchCourses } = useCourseActions();
  const { courses, isFetching, lastPage } = useSelector((state) => mapStateToProps(state, { list, page }))

  useEffect(() => {
    fetchCourses(list, page);
  }, [list, page]);

  return <CourseCards courses={courses} page={page} lastPage={lastPage} list={list} isFetching={isFetching} />
}


export default CourseList;