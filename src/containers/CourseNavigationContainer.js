import { connect } from 'react-redux'
import CourseNavigation from '../components/CourseNavigation'

function mapStateToProps(state, ownProps) {
  const list = ownProps.match.params.list || null;
  const { courses } = state
  const { currentCourses, archivedCourses, myCourses } = courses;
  const courseList = 
    list === 'current' ? currentCourses
    : list === 'archive' ? archivedCourses
    : list === 'mine' ? myCourses
    : null;
  const links = courseList == null ? null : courseList['links']
  return {
  	list: list,
  	links: links
  }
}

export default connect(mapStateToProps, null)(CourseNavigation);