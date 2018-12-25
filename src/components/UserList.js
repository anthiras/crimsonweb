import React, { Component } from 'react';
import {get} from "./Api";
import UserRow from "./UserRow";
import { Loading, Pagination } from './Utilities';

class UserList extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            users: [],
            loading: false,
            page: 1,
            lastPage: 1
        }
        this.setPage = this.setPage.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        get('/v1/roles').then(roles => {
            this.setState({ roles })
        });
        this.loadUsers(this.state.page);
    }

    loadUsers(page) {
        get('/v1/users?include[]=roles&include[]=memberships&page='+page).then(result => {
            this.setState({ users: result.data, loading: false, lastPage: result.meta.last_page });
        });
    }

    setPage(page) {
        this.setState({ page: page });
        this.loadUsers(page);
    }

    render() {
        if (this.state.loading) return <Loading />;
        const page = this.state.page;
        const lastPage = this.state.lastPage;
        return (
            <React.Fragment>
            <table className="table">
                <thead>
                    <tr>
                        <th width="50"></th>
                        <th>Name</th>
                        <th>Roles</th>
                        <th>Membership</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.map(user =>
                        <UserRow key={user.id} user={user} allRoles={this.state.roles} />
                    )}
                </tbody>
            </table>
            <Pagination page={page} lastPage={lastPage} onSetPage={this.setPage} />
            </React.Fragment>
        );
    }
}

export default UserList;