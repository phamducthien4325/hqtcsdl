export function buildPagination(query) {
  const page = Math.max(Number(query.page ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize ?? 10), 1), 100);
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  };
}

export function toPaginatedResponse(items, total, { page, pageSize }) {
  return {
    items,
    meta: {
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize)
    }
  };
}
