import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner} from "@fortawesome/free-solid-svg-icons/index";
import { NavLink } from "react-router-dom";

const Loading = () => (
    <div className="d-flex justify-content-center text-secondary p-4">
        <FontAwesomeIcon icon={faSpinner} size="4x" className="fa-spin" />
    </div>
);

const Pagination = ({page, lastPage, urlForPage }) => {
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
                <NavLink className="page-link" to={urlForPage(page-1)}>Previous</NavLink>
            </li>
            
            {pageNumbers.map(pageNumber => 
                <li key={pageNumber} className={"page-item" + (pageNumber === page ? " active": "")}>
                    <NavLink className="page-link" to={urlForPage(pageNumber)}>{pageNumber}</NavLink>
                </li>
            )}

            <li className={"page-item" + (page === lastPage ? " disabled" : "")}>
                <NavLink className="page-link" to={urlForPage(page+1)}>Next</NavLink>
            </li>
          </ul>
        </nav>
    );
}

export { Loading, Pagination };