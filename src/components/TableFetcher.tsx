import { Button, CircularProgress } from '@material-ui/core';
import React from 'react';
import { usePaginatedQuery } from 'react-query';
import { TableRender } from './TableRender';

export interface Column<T> {
  key: keyof T;
  header: string;
  renderFunc?: (value: string | number) => React.ReactElement;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  fetchQuery: (page: number) => Promise<T[]>;
  queryId: { name: string; props: Record<string, string> };
}

const MIN_PAGE = 1;

export function TableFetcher<T extends Record<string, string | number>>({ columns, queryId, fetchQuery }: Props<T>) {
  const [page, setPage] = React.useState(MIN_PAGE);
  const { latestData, resolvedData, isLoading, error } = usePaginatedQuery(
    [queryId.name, { ...queryId.props, page }],
    () => fetchQuery(page),
    { refetchOnWindowFocus: false },
  );

  return (
    <React.Fragment>
      {!error && <div className="mb-2">Current Page: {page}</div>}
      {isLoading ? (
        <CircularProgress />
      ) : !error ? (
        <TableRender columns={columns} data={resolvedData} />
      ) : (
        <div>Failed to fetch data - {(error as any)?.message}</div>
      )}
      {resolvedData && (
        <div className="flex flex-row items-center">
          <Button disabled={page === MIN_PAGE} onClick={() => setPage((old) => Math.max(old - 1, MIN_PAGE))}>
            Previous Page
          </Button>{' '}
          <Button
            onClick={() => setPage((old) => (!latestData ? old : old + 1))}
            disabled={!latestData || !latestData.length}
          >
            Next Page
          </Button>{' '}
        </div>
      )}
    </React.Fragment>
  );
}
