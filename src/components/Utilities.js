import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner} from "@fortawesome/free-solid-svg-icons/index";
import { withTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker'
import { format } from 'date-fns-tz'
import AsyncSelect from 'react-select/async';
import BootstrapPagination from 'react-bootstrap/Pagination';
import { LinkContainer } from 'react-router-bootstrap'
import useApi from '../shared/Api';

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
        <BootstrapPagination>
            <LinkContainer to={urlForPage(1)}>
                <BootstrapPagination.First disabled={page === 1} />
            </LinkContainer>
            <LinkContainer to={urlForPage(page-1)}>
                <BootstrapPagination.Prev disabled={page === 1} />
            </LinkContainer>
            {pageNumbers.map(pageNumber => 
                <LinkContainer to={urlForPage(pageNumber)} key={pageNumber}>
                    <BootstrapPagination.Item active={pageNumber === page}>{pageNumber}</BootstrapPagination.Item>
                </LinkContainer>
            )}
            <LinkContainer to={urlForPage(page+1)}>
                <BootstrapPagination.Next disabled={page === lastPage} />
            </LinkContainer>
            <LinkContainer to={urlForPage(lastPage)}>
                <BootstrapPagination.Last disabled={page === lastPage} />
            </LinkContainer>
        </BootstrapPagination>
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
        let date = format(value, "yyyy-MM-dd");
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

const UserPicker = (props) => {
    const { get } = useApi();

    const searchUsers = (input) => {
        const url = input
        ? '/v1/users?query='+(input || '')
        : '/v1/users?isRecentInstructor=true'
        return get(url)
            .then(result => result.data.map(user => {
                    return {
                        value: user.id,
                        label: user.name
                    }
                })
            );
    }

    return <AsyncSelect cacheOptions isMulti defaultOptions loadOptions={searchUsers} {...props} />
}


export { Loading, Pagination, DatePicker, UserPicker };