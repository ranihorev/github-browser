import { Link, Tooltip } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Octokit } from '@octokit/rest';
import cx from 'classnames';
import copy from 'copy-to-clipboard';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../components/Container';
import { alertOnRateLimit } from '../components/rateLimitAlert';
import { TableFetcher } from '../components/TableFetcher';
import { Column } from '../components/TableRender';
import { Title } from '../components/Title';
import styles from '../table.module.css';

const octokit = new Octokit();

const ShaRender: React.FC<{ value: string | number }> = ({ value }) => {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [copied]);
  return (
    <Tooltip title={`${value} - ${copied ? 'Copied!' : `click to copy`}`} placement="top-start">
      <div
        className="pointer"
        onClick={() => {
          copy(value.toString());
          setCopied(true);
        }}
      >
        {value.toString().slice(0, 8)}
      </div>
    </Tooltip>
  );
};

type CommitData = {
  sha: string;
  author: string;
  message: string;
  url: string;
  numComments: number;
  date: string;
};

const columns: Column<CommitData>[] = [
  {
    key: 'sha',
    header: 'SHA',
    renderFunc: (value) => <ShaRender value={value} />,
  },
  {
    key: 'author',
    header: 'Author',
  },
  { key: 'numComments', header: 'Comments' },
  { key: 'date', header: 'Date' },
  {
    key: 'message',
    header: 'Message',
    renderFunc: (value) =>
      value ? (
        <Tooltip title={value} placement="top-start">
          <div className={cx(styles.message, 'truncate')}>{value}</div>
        </Tooltip>
      ) : (
        <React.Fragment>{value}</React.Fragment>
      ),
  },
  {
    key: 'url',
    header: 'URL',
    renderFunc: (value) => (
      <Link href={value.toString()} rel="noopener noreferrer" target="_blank">
        <OpenInNewIcon fontSize="small" />
      </Link>
    ),
  },
];

export const Commits: React.FC = () => {
  const { userId, repoName } = useParams<{ userId: string; repoName: string }>();

  const fetchQuery = React.useCallback(
    async (page: number) => {
      const resp = await octokit.repos.listCommits({ owner: userId, repo: repoName, per_page: 50, page });
      // const resp = await new Promise<RestEndpointMethodTypes['repos']['listCommits']['response']>((resolve, reject) => {
      //   resolve({
      //     data: require('../fakeCommitsResponse.json').slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      //     headers: {},
      //   } as RestEndpointMethodTypes['repos']['listCommits']['response']);
      // });
      alertOnRateLimit(resp);

      const data: CommitData[] = resp.data.map((item) => ({
        sha: item.sha,
        author: item.commit.author.name,
        message: item.commit.message,
        numComments: item.commit.comment_count,
        url: item.html_url,
        date: item.commit.author.date,
      }));
      return data;
    },
    [repoName, userId],
  );

  const queryId = React.useMemo(() => ({ name: 'commits', props: { userId, repoName } }), [repoName, userId]);

  return (
    <Container>
      <Title>
        {userId}/{repoName} commits
      </Title>
      <TableFetcher columns={columns} fetchQuery={fetchQuery} queryId={queryId} />
    </Container>
  );
};
