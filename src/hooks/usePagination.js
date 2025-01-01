/**
 * 페이지네이션을 위한 커스텀 훅
 * page, limit, total, startPage, pageSize, hasNext, hasPrev
 */

import { useState } from "react";

//
const usePagination = (pageSize = 5, initialLimit = 20) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const [totalPage, setTotalPage] = useState(1);

  const curBlock = Math.ceil(page / pageSize);
  const startPage = 1 + (curBlock - 1) * pageSize;
  const totalBlock = Math.ceil(totalPage / pageSize);
  const hasNext = curBlock < totalBlock;
  const hasPrev = curBlock > 1;

  return {
    page,
    setPage,
    limit,
    setLimit,
    totalPage,
    setTotalPage,
    startPage,
    pageSize,
    hasNext,
    hasPrev,
  };
};

export default usePagination;
