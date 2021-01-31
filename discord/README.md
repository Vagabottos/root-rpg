
# Pellenicky

A bot for Root RPG related lookups.

## Developing

* `npm run start:dev` to run in dev mode (with livereload)
* `npm run start` to run in prod mode

## Environment Variables

Put these values in a [`.env`](https://www.npmjs.com/package/dotenv) file or in the projects environment variables.

### Required

* `DISCORD_TOKEN` - the Discord token for the bot.

### Optional

* `COMMAND_PREFIX` - the command prefix for the bot. Defaults to `!`.
* `IGNORE_PRESENCE` - do not set presence values.
* `TEST_SERVER` - set this to a Discord Guild ID
