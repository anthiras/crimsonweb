import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import CourseNavigation from '../components/CourseNavigation'

function mapStateToProps(state, ownProps) {
  const list = ownProps.list || null;
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

const CourseNavigationContainer = () => {
  const { list } = useParams();
  const { links } = useSelector((state) => mapStateToProps(state, { list }))

  return <CourseNavigation list={list} links={links} />
}

export default CourseNavigationContainer;