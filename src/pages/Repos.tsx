import { Link, Tooltip } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import cx from 'classnames';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Container } from '../components/Container';
import { alertOnRateLimit } from '../components/rateLimitAlert';
import { TableFetcher } from '../components/TableFetcher';
import { Column } from '../components/TableRender';
import { Title } from '../components/Title';
import styles from '../table.module.css';

const octokit = new Octokit(); // TODO: move to its own file and create once for the entire app

const repoKeys = ['name', 'description', 'html_url', 'stargazers_count', 'forks_count', 'updated_at'] as const;
type RepoResponseItem = RestEndpointMethodTypes['search']['repos']['response']['data']['items'][number];
type RepoData = Pick<RepoResponseItem, typeof repoKeys[number]> & { score: number };

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
  { key: 'score', header: 'Score' },
  { key: 'stargazers_count', header: 'Stars' },
  { key: 'forks_count', header: 'Forks' },
  { key: 'updated_at', header: 'Last Update' },
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

export const Repos: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const fetchQuery = React.useCallback(
    async (page: number) => {
      const resp = await octokit.search.repos({
        q: `user:${userId}`,
        sort: 'stars',
        per_page: 50,
        page,
      });
      // const resp = await new Promise<OctokitResponse<UserReposResponseItem[]>>((resolve, reject) => {
      //   resolve({ data: require('../fakeReposResponse.json') } as OctokitResponse<UserReposResponseItem[]>);
      // });
      alertOnRateLimit(resp);
      const repoItems = resp.data.items.map((item) => ({
        ...pick(item, repoKeys),
        score: 2 * item.forks_count + item.stargazers_count,
      }));
      return sortBy(repoItems, (item) => -1 * item.stargazers_count);
    },
    [userId],
  );

  const queryId = React.useMemo(() => ({ name: 'repos', props: { userId } }), [userId]);

  return (
    <Container>
      <Title tooltip="Repos are sort by # of stars. More robust sorting coming soon">{userId} Repos </Title>
      <TableFetcher columns={columns} fetchQuery={fetchQuery} queryId={queryId} />
    </Container>
  );
};
