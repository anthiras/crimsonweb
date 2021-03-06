import React, { Component } from 'react';
import Auth from '../shared/Auth'
import { NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import i18n from '../shared/i18n';
import { withPermissions } from '../containers/PermissionContainer';

class Navigation extends Component
{
    constructor() {
        super();
        this.auth = new Auth();
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login(e) {
        e.preventDefault();
        this.auth.login();
    }

    logout(e) {
        e.preventDefault();
        this.auth.logout();
    }

    render() {
        const t = this.props.t;
        const permissions = this.props.permissions;

        const isAuthenticated = this.auth.isAuthenticated();
        const profile = isAuthenticated ? this.auth.getProfile() : {};

        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark mb-3">
                <ul className="navbar-nav mr-auto">
                    <NavLink to="/courses" className="nav-link" activeClassName="active">{t('titles:courses')}</NavLink>
                    <NavLink to="/membership" className="nav-link" activeClassName="active">{t('titles:membership')}</NavLink>
                    {permissions['users:list'] && permissions['roles:assignRole:instructor'] && <NavLink to="/users" className="nav-link" activeClassName="active">{t('titles:users')}</NavLink>}
                </ul>
                <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                        <button className="btn btn-link nav-link dropdown-toggle" id="languageDropdown"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {t('common:language:this')}
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <button className={"btn btn-link dropdown-item" + (i18n.language === "da" ? " active" : "")} onClick={() => i18n.changeLanguage('da')}>{t('common:language:da')}</button>
                            <button className={"btn btn-link dropdown-item" + (i18n.language === "en" ? " active" : "")} onClick={() => i18n.changeLanguage('en')}>{t('common:language:en')}</button>
                        </div>
                    </li>
                    {!isAuthenticated && (
                        <li className="nav-item">
                            <button className="btn btn-link nav-link" onClick={this.login}>{t('actions:signIn')}</button>
                        </li>
                    )}
                    {isAuthenticated && (
                        <li className="nav-item dropdown">
                            <button className="btn btn-link nav-link dropdown-toggle" id="navbarDropdownMenuLink"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src={profile.picture} width="20" height="20" className="align-middle mr-1" alt={profile.name} />
                                <span className="d-none d-md-inline">{profile.name}</span>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                <NavLink to="/profile" className="dropdown-item" activeClassName="active">{t('titles:myProfile')}</NavLink>
                                <button className="btn btn-link dropdown-item" onClick={this.logout}>{t('actions:signOut')}</button>
                            </div>
                        </li>
                    )}
                </ul>
            </nav>
        );
    }
}

export default withTranslation()(withPermissions(Navigation));