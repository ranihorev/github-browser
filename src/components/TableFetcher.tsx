import { Button, CircularProgress } from '@material-ui/core';
import React from 'react';
import { usePaginatedQuery } from 'react-query';
import { BaseProps, TableRender } from './TableRender';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

interface Props<T> extends BaseProps<T> {
  fetchQuery: (page: number) => Promise<T[]>;
  queryId: { name: string; props: Record<string, string> };
}

const MIN_PAGE = 1;

export function TableFetcher<T extends Record<string, string | number>>({
  queryId,
  fetchQuery,
  ...tableRenderProps
}: Props<T>) {
  const { sortBy } = tableRenderProps;
  const [page, setPage] = React.useState(MIN_PAGE);
  const { latestData, resolvedData, isLoading, error, isFetching } = usePaginatedQuery(
    [queryId.name, { ...queryId.props, page, ...sortBy }],
    () => fetchQuery(page),
    { refetchOnWindowFocus: false },
  );

  return (
    <React.Fragment>
      {isLoading ? (
        <CircularProgress />
      ) : !error ? (
        <TableRender {...tableRenderProps} data={resolvedData} isFetching={isFetching} />
      ) : (
        <div>Failed to fetch data - {(error as any)?.message}</div>
      )}
      {resolvedData && (
        <div className="flex flex-row items-center justify-center">
          <Button disabled={page === MIN_PAGE} onClick={() => setPage((old) => Math.max(old - 1, MIN_PAGE))}>
            <NavigateNextIcon className="transform rotate-180" />
          </Button>{' '}
          <div>Page {page}</div>
          <Button
            onClick={() => setPage((old) => (!latestData ? old : old + 1))}
            disabled={!latestData || !latestData.length}
          >
            <NavigateNextIcon className="" />
          </Button>{' '}
        </div>
      )}
    </React.Fragment>
  );
}
