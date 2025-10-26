# axios-toolkit

Simple wrapper around axios for quick HTTP client setup.

## What it does

Creates a configured axios instance with convenient request methods. Supports interceptors, timeouts, and request cancellation.

## Usage

```typescript
import { api } from 'axios-toolkit';

const client = api({
  url: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' },
  interceptors: {
    request: { onFulfilled: (config) => config },
    response: { onFulfilled: (response) => response }
  }
});

// GET with query params - full response
const response = await client.get('/users', { page: 1 });

// GET - data only
const users = await client.$get('/users', { page: 1 });

// POST with payload
const user = await client.$post('/users', { name: 'John' });

// DELETE
await client.del('/users/123');
```

## Methods

- `get`, `post`, `put`, `patch`, `del` — return full axios response
- `$get`, `$post`, `$put`, `$patch`, `$del` — return only data from `response.data`

All methods support optional `signal` (AbortSignal) and `timeout` parameters. Methods without `$` return full axios response, `$`-prefixed methods return only `response.data`.
