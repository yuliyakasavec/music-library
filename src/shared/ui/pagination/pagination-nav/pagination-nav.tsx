import { getPaginationPages } from '../utils/get-pagination-pages';
import s from './pagination-nav.module.css';

type Props = {
  current: number;
  pagesCount: number;
  onChange: (page: number) => void;
  isFetching: boolean;
};

const SIBLING_COUNT = 1;

export const PaginationNav = ({
  current,
  pagesCount,
  onChange,
  isFetching,
}: Props) => {
  const pages = getPaginationPages(current, pagesCount, SIBLING_COUNT);

  return (
    <div className={s.pagination}>
      {pages.map((item, idx) =>
        item === '...' ? (
          <span className={s.ellipsis} key={`ellipsis-${idx}`}>
            ...
          </span>
        ) : (
          <button
            key={item}
            className={
              item === current
                ? `${s.pageButton} ${s.pageButtonActive}`
                : !isFetching
                  ? s.pageButton
                  : `${s.pageButton} ${s.disabled}`
            }
            onClick={() =>
              !isFetching && item !== current && onChange(Number(item))
            }
            disabled={item === current}
            type="button"
          >
            {item}
          </button>
        )
      )}
    </div>
  );
};
