const paginationDetails = (count, limit, page) => {
  let totalPages = Math.ceil(count / limit);

  if (!limit || count <= limit) return;

  page = (isNaN(page) || page < 1) ? 1 : page;

  let prevPage = (page > 1 && page <= totalPages) ? page - 1 : null;
  let nextPage = (totalPages > page) ? page + 1 : null;

  return { count, totalPages, prevPage, nextPage }
}

module.exports = paginationDetails;