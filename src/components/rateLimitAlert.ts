import { OctokitResponse } from '@octokit/types';

export const alertOnRateLimit = (resp: OctokitResponse<any>) => {
  try {
    const rateLimit = parseInt(resp.headers['x-ratelimit-remaining'] || '60');
    if (rateLimit <= 3) {
      alert(`Github Rate limit - Only ${rateLimit} requests left`);
    }
  } catch (e) {}
};
