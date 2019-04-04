import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner} from "@fortawesome/free-solid-svg-icons/index";
import { NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker'
import moment from 'moment';
import AsyncSelect from 'react-select/lib/Async';
import { get } from '../shared/Api'

const Loading = () => (
    <div className="d-flex justify-content-center text-secondary p-4">
        <FontAwesomeIcon icon={faSpinner} size="4x" className="fa-spin" />
    </div>
);

const Pagination = withTranslation()(({page, lastPage, urlForPage, t }) => {
    const pageDiffs = [-2, -1, 0, 1, 2];
    const underflow = Math.min(0, page - 2 - 1);
    const overflow = Math.max(lastPage, page + 2) - lastPage;
    const pageNumbers = pageDiffs
        .map(diff => page + diff - underflow - overflow)
        .filter(pageNo => pageNo > 0 && pageNo <= lastPage);

    return (
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={"page-item" + (page === 1 ? " disabled" : "")}>
                <NavLink className="page-link" to={urlForPage(page-1)}>{t('common:previous')}</NavLink>
            </li>
            
            {pageNumbers.map(pageNumber => 
                <li key={pageNumber} className={"page-item" + (pageNumber === page ? " active": "")}>
                    <NavLink className="page-link" to={urlForPage(pageNumber)}>{pageNumber}</NavLink>
                </li>
            )}

            <li className={"page-item" + (page === lastPage ? " disabled" : "")}>
                <NavLink className="page-link" to={urlForPage(page+1)}>{t('common:next')}</NavLink>
            </li>
          </ul>
        </nav>
    );
})

// Accepts date input in the format YYYY-MM-DD and returns date in the same format
class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(value) {
        if (value == null) return;
        let date = moment(value).format("YYYY-MM-DD");
        this.props.onChange(date);
    }

    render() {
        return (
            <div>
                <ReactDatePicker selected={new Date(this.props.date)} dateFormat="dd/MM/yyyy" showYearDropdown onChange={this.handleInput} className="form-control" />
                <small className="form-text">DD/MM/YYYY</small>
            </div>
        )
    }
}

class UserPicker extends Component {
    searchUsers(input) {
        return get('/v1/users?query='+input)
            .then(result => result.data.map(user => {
                    return {
                        value: user.id,
                        label: user.name
                    }
                })
            );
    }

    render() {
        return <AsyncSelect cacheOptions isMulti loadOptions={this.searchUsers} {...this.props} />
    }
}

export { Loading, Pagination, DatePicker, UserPicker };