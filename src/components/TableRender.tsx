import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

export interface Column<T> {
  key: keyof T;
  header: string;
  renderFunc?: (value: string | number) => React.ReactNode;
  className?: string;
  isSortable?: boolean;
}

export type SortBy<T> = { key: keyof T; direction: 'asc' | 'desc' };

export interface BaseProps<T> {
  sortBy?: SortBy<T>;
  setSortBy?: React.Dispatch<React.SetStateAction<SortBy<T>>>;
  columns: Column<T>[];
}
interface Props<T> extends BaseProps<T> {
  isFetching: boolean;
  data?: T[];
}

export function TableRender<T extends Record<string, string | number>>({
  data,
  columns,
  sortBy,
  setSortBy,
  isFetching,
}: Props<T>) {
  const setSortByHelper = (column: Column<T>) => {
    setSortBy?.((currentSortBy) => ({
      key: column.key,
      direction: currentSortBy.key === column.key ? (currentSortBy.direction === 'asc' ? 'desc' : 'asc') : 'desc',
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="repos table" size="small">
        <TableHead>
          <TableRow className="bg-gray-700">
            {columns.map((column, index) => (
              <TableCell
                key={index}
                className="pr-2"
                onClick={() => {
                  if (column.isSortable) {
                    setSortByHelper(column);
                  }
                }}
              >
                <div
                  className={cx('font-bold text-white flex flex-row items-center', {
                    'cursor-pointer': column.isSortable,
                  })}
                >
                  {column.header}{' '}
                  {sortBy &&
                    sortBy.key === column.key &&
                    (isFetching ? (
                      <CircularProgress size={12} className="ml-1" />
                    ) : sortBy.direction === 'asc' ? (
                      <ArrowDropUpIcon fontSize="small" />
                    ) : (
                      <ArrowDropDownIcon fontSize="small" />
                    ))}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="odd:bg-gray-50">
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className="border-b-0">
                  <div className={cx('truncate', column.className)}>
                    {column.renderFunc?.(row[column.key]) || row[column.key]}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
