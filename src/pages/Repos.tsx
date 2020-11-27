import { Link, Tooltip } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import cx from 'classnames';
import { format } from 'date-fns';
import pick from 'lodash/pick';
import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Container } from '../components/Container';
import { alertOnRateLimit } from '../components/rateLimitAlert';
import { TableFetcher } from '../components/TableFetcher';
import { Column, SortBy } from '../components/TableRender';
import { Title } from '../components/Title';
import styles from '../table.module.css';

const octokit = new Octokit(); // TODO: move to its own file and create once for the entire app

const repoKeys = ['name', 'description', 'html_url', 'stargazers_count', 'forks_count', 'pushed_at'] as const;
type RepoResponseItem = RestEndpointMethodTypes['search']['repos']['response']['data']['items'][number];
type RepoData = Pick<RepoResponseItem, typeof repoKeys[number]>;

const NameCol: React.FC<{ value: string | number }> = ({ value }) => {
  const { userId } = useParams<{ userId: string }>();
  return (
    <Link component={RouterLink} to={`/user/${userId}/repo/${value}/commits`}>
      {value}
    </Link>
  );
};

const columns: Column<RepoData>[] = [
  { key: 'name', header: 'Name', className: styles.name, renderFunc: (value) => <NameCol value={value} /> },
  {
    key: 'description',
    header: 'Description',
    renderFunc: (value) =>
      value ? (
        <Tooltip title={value} placement="top-start">
          <div className={cx(styles.description, 'truncate')}>{value}</div>
        </Tooltip>
      ) : (
        <React.Fragment>value</React.Fragment>
      ),
  },
  { key: 'stargazers_count', header: 'Stars', isSortable: true },
  { key: 'forks_count', header: 'Forks', isSortable: true },
  {
    key: 'pushed_at',
    header: 'Last Update',
    isSortable: true,
    renderFunc: (value) => {
      try {
        return format(new Date(value), 'Pp');
      } catch (e) {
        return value;
      }
    },
  },
  {
    key: 'html_url',
    header: 'URL',
    renderFunc: (value) => (
      <Link href={value.toString()} rel="noopener noreferrer" target="_blank">
        <OpenInNewIcon fontSize="small" />
      </Link>
    ),
  },
];

const sortMapping: { [key in keyof RepoData]?: RestEndpointMethodTypes['search']['repos']['parameters']['sort'] } = {
  stargazers_count: 'stars',
  forks_count: 'forks',
  pushed_at: 'updated',
};

type ResponseType = RestEndpointMethodTypes['search']['repos']['response'];

export const Repos: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [sortBy, setSortBy] = React.useState<SortBy<RepoData>>({ key: 'stargazers_count', direction: 'desc' });
  const fetchQuery = React.useCallback(
    async (page: number) => {
      let resp;
      if (process.env.REACT_APP_USE_FAKE_DATA) {
        resp = await new Promise<ResponseType>((resolve, reject) => {
          resolve({
            data: { items: require('../fakeReposResponse.json').slice((page - 1) * 20, page * 20) },
            headers: {},
          } as ResponseType);
        });
      } else {
        resp = await octokit.search.repos({
          q: `user:${userId}`,
          sort: sortMapping[sortBy.key] || 'stars',
          order: sortBy.direction,
          per_page: 50,
          page,
        });
      }

      alertOnRateLimit(resp);
      return resp.data.items.map((item) => pick(item, repoKeys));
    },
    [sortBy, userId],
  );

  const queryId = React.useMemo(() => ({ name: 'repos', props: { userId } }), [userId]);

  return (
    <Container>
      <Title>
        <Link component={RouterLink} to={`/user/${userId}/repos`}>
          {userId}
        </Link>
        &nbsp;- Repos{' '}
      </Title>
      <TableFetcher {...{ columns, fetchQuery, queryId, sortBy, setSortBy }} />
    </Container>
  );
};
