import React from 'react';
import { NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';

const queryString = (query) => query ? '?query=' + encodeURIComponent(query) : '';

const UserNavigation = ({ t, query }) => (
    <ul className="nav nav-pills mb-3">
        <li className="nav-item">
            <NavLink to={"/users/all"+queryString(query)} className="nav-link" activeClassName="active" exact={false}>{t('users:all')}</NavLink>
        </li>
        <li className="nav-item">
            <NavLink to={"/users/members"+queryString(query)} className="nav-link" activeClassName="active" exact={false}>{t('users:members')}</NavLink>
        </li>
        <li className="nav-item">
            <NavLink to={"/users/paid"+queryString(query)} className="nav-link" activeClassName="active" exact={false}>{t('users:paidMembers')}</NavLink>
        </li>
        <li className="nav-item">
            <NavLink to={"/users/unpaid"+queryString(query)} className="nav-link" activeClassName="active" exact={false}>{t('users:unpaidMembers')}</NavLink>
        </li>
    </ul>
)

export default withTranslation()(UserNavigation);