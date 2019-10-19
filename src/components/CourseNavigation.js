import React from 'react';
import { NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import { withPermissions } from '../containers/PermissionContainer';
import Auth from '../shared/Auth'

const auth = new Auth();

const CourseNavigation = ({ t, permissions, list, links }) => (
    <div className="row">
        <div className="col-10">
            <ul className="nav nav-pills mb-3">
                <li className="nav-item">
                    <NavLink to="/courses/current" className="nav-link" activeClassName="active" exact={false}>{t('courses:current')}</NavLink>
                </li>
                {auth.isAuthenticated() &&
                <li className="nav-item">
                    <NavLink to="/courses/mine" className="nav-link" activeClassName="active" exact={false}>{t('courses:mine')}</NavLink>
                </li>
                }
                {permissions['courses:create'] &&
                <li className="nav-item">
                    <NavLink to="/courses/archive" className="nav-link" activeClassName="active" exact={false}>{t('courses:archive')}</NavLink>
                </li>
                }
                {permissions['courses:create'] &&
                <li className="nav-item">
                    <NavLink  to="/courses/create" className="nav-link" activeClassName="active" exact={true}>
                        <span className="oi oi-plus"/> {t('courses:createNew')}
                    </NavLink>
                </li>
                }
            </ul>
        </div>
        {list === 'mine' && links != null &&
            <div className="col-2 text-right">
                <div className="dropdown">
                  <button className="btn btn-outline-secondary" type="button" id="courseListActions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    …
                  </button>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="courseListActions">
                    <a className="dropdown-item" href={links['ics']}>{t('courses:iCalFeed')}</a>
                  </div>
                </div>
            </div>
        }
    </div>
);

export default withTranslation()(withPermissions(CourseNavigation));