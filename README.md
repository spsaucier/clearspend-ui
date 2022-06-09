# capital-ui
#
This is the web app for users to administer ClearSpend to their employees.

It is built with [SolidJS](solidjs.com/), which is similar to React.

## Local development

### Requirements:
- Node 14.17+
- NPM 7.16+

### Against remote back-end

```
cp .env.dev.example .env.dev
npm i
npm start
```

### Against local backend

Additional Requirements For Linux:
- linux or [wsl](https://docs.microsoft.com/en-us/windows/wsl/install)
- /etc/hosts lists `127.0.0.1 localhost` (which might include more synonyms)

1. Create `.env.dev` with the content
    ```sh
    DEV_API=http://localhost:8080
    USE_API_REWRITE=1
    ```
1. `npm i`
1. `npm start -- --port=8081`
