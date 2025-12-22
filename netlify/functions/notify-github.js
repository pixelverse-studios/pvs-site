export const handler = async (event) => {
  console.log('notify-github invoked');
  try {
    const {
      GITHUB_PAT,
      GH_OWNER,
      GH_REPO,
      DISPATCH_EVENT_TYPE = 'netlify_deploy_success',
    } = process.env;

    if (!GITHUB_PAT || !GH_OWNER || !GH_REPO) {
      console.error('Missing GITHUB_PAT, GH_OWNER, or GH_REPO env vars');
      return { statusCode: 500, body: 'Server not configured' };
    }

    // Netlify sends the deploy payload as JSON
    const payload = JSON.parse(event.body || '{}');
    console.log('payload', payload);
    const branch = payload?.branches?.[0] || payload?.branch || 'unknown';
    const commit = payload?.commit_ref || payload?.commit || 'unknown';
    const deployUrl = payload?.deploy_ssl_url || payload?.deploy_url || 'unknown';

    const body = {
      event_type: DISPATCH_EVENT_TYPE,
      client_payload: {
        branch,
        commit,
        deploy_url: deployUrl,
      },
    };

    const res = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_PAT}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('GitHub dispatch failed', res.status, text);
      return { statusCode: 500, body: 'Failed to dispatch' };
    }

    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error('notify-github error', err);
    return { statusCode: 500, body: 'Error' };
  }
};
