export class PaginationData<R> {
  totalRecords: number;
  currentPage: number;
  totalPage: number;
  data: R[];
  constructor(
    totalRecords: number,
    currentPage: number,
    totalPage: number,
    data: R[],
  ) {
    this.totalRecords = totalRecords;
    this.currentPage = currentPage;
    this.totalPage = totalPage;
    this.data = data;
  }
}

export interface FindAndCountResponse<M> {
  rows: M[];
  totalRecords: number;
}

export const getPagingData = <M>(
  data: FindAndCountResponse<M>,
  page: number,
  limit: number,
): PaginationData<M> => {
  const { totalRecords, rows } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalRecords / limit);
  return new PaginationData(totalRecords, currentPage, totalPages, rows);
};
