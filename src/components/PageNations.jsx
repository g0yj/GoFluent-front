import classNames from "classnames";
import Buttons from "./Buttons";

const PageNations = ({ data }) => {
  return (
    <div className="ui-pagination-wrap">
      {data.hasPrev && <Buttons className="start" onClick={() => data.setPage(1)}></Buttons>}
      {data.hasPrev && (
        <Buttons
          className="prev"
          onClick={() => data.setPage(data.startPage - data.pageSize)}
        ></Buttons>
      )}
      {Array.from({ length: data.pageSize }).map((_, index) => {
        const pageNum = data.startPage + index;
        const className = classNames({ active: pageNum === data.page });

        if (pageNum < data.totalPage + 1) {
          return (
            <Buttons
              key={`page-${pageNum}`}
              className={className}
              onClick={() => data.setPage(pageNum)}
            >
              {pageNum}
            </Buttons>
          );
        }

        return null;
      })}
      {data.hasNext && (
        <Buttons
          className="next"
          onClick={() => data.setPage(data.startPage + data.pageSize)}
        ></Buttons>
      )}
      {data.hasNext && (
        <Buttons className="end" onClick={() => data.setPage(data.totalPage)}></Buttons>
      )}
    </div>
  );
};

export default PageNations;
