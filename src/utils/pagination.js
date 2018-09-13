export const calculatePageValue = (pager) => {
    const pageSize = pager.pageSize;
    const { total, pageCount, page } = pager;
    const pageCalculationValue = total - (total - ((pageCount - (pageCount - page)) * pageSize));
    const startItem = (pageCalculationValue - pageSize) + 1;
    const endItem = pageCalculationValue;

    return `${startItem} - ${endItem > total ? total : endItem}`;
};

export const filterElementsToPager = (elements, { page, pageSize }) => {
    const pageElements = elements.slice((page - 1) * pageSize, page * pageSize);

    /* first element of the page is open */
    /* FIXME I have the feeling this is not the right place for this -- this a UI issue */
    if (pageElements && pageElements.length) {
        pageElements[0].open = true;
    }

    return pageElements;
};

export const hasNextPage = pager => () => pager.page < pager.pageCount;
export const hasPreviousPage = pager => () => pager.page > 1;
