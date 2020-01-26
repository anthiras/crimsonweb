import React from 'react';
import { NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';

const UserNavigation = ({ t }) => (
    <ul className="nav nav-pills mb-3">
        <li className="nav-item">
            <NavLink to="/users/all" className="nav-link" activeClassName="active" exact={false}>{t('users:all')}</NavLink>
        </li>
        <li className="nav-item">
            <NavLink to="/users/members" className="nav-link" activeClassName="active" exact={false}>{t('users:members')}</NavLink>
        </li>
        <li className="nav-item">
            <NavLink to="/users/paid" className="nav-link" activeClassName="active" exact={false}>{t('users:paidMembers')}</NavLink>
        </li>
        <li className="nav-item">
            <NavLink to="/users/unpaid" className="nav-link" activeClassName="active" exact={false}>{t('users:unpaidMembers')}</NavLink>
        </li>
    </ul>
)

export default withTranslation()(UserNavigation);