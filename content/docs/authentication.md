---
title: Authentication
description: Authenticate your API requests with Auths API keys
---

## API Keys

The Auths API uses API keys to authenticate requests. You can view and manage your API keys in the Auths Dashboard.

Test mode secret keys have the prefix `sk_test_` and live mode secret keys have the prefix `sk_live_`. Alternatively, you can use restricted API keys for granular permissions.

## Security

Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.

## Using Your API Key

Use your API key by assigning it to `Auths.apiKey`. The library will then automatically send this key in each request.

You can also set a per-request key with an option. This is often useful for applications that use multiple API keys during the lifetime of a process.

## HTTPS Required

All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.
