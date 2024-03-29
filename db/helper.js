const getOffset = (currentPage = 1, listPerPage) => {
  return (currentPage - 1) * [listPerPage];
};

const emptyRows = (rows) => {
  if (!rows) {
    return [];
  }

  return rows;
};

module.exports = {
  getOffset,
  emptyRows,
};
