import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner} from "@fortawesome/free-solid-svg-icons/index";

const Loading = () => (
    <div className="d-flex justify-content-center text-secondary p-4">
        <FontAwesomeIcon icon={faSpinner} size="4x" className="fa-spin" />
    </div>
);

const Pagination = ({page, lastPage, onSetPage}) => {
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
                <button className="page-link" onClick={() => onSetPage(page-1)}>Previous</button>
            </li>
            
            {pageNumbers.map(pageNumber => 
                <li key={pageNumber} className={"page-item" + (pageNumber === page ? " active": "")}>
                    <button className="page-link" onClick={() => onSetPage(pageNumber)}>{pageNumber}</button>
                </li>
            )}

            <li className={"page-item" + (page === lastPage ? " disabled" : "")}>
                <button className="page-link" onClick={() => onSetPage(page+1)}>Next</button>
            </li>
          </ul>
        </nav>
    );
}

export { Loading, Pagination };