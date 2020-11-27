import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';

export interface Column<T> {
  key: keyof T;
  header: string;
  renderFunc?: (value: string | number) => React.ReactElement;
  className?: string;
}

interface Props<T> {
  data?: T[];
  columns: Column<T>[];
}

export function TableRender<T extends Record<string, string | number>>({ data, columns }: Props<T>) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="repos table" size="small">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} className="font-bold">
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
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
