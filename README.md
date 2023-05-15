# OpenWorld Game Node Template

Following is a basic overview of useful commands and project structure. Each module has it's own README file with more detailed information.

## Fist time setup
Use node version from .nvmrc  
`nvm install && nvm use`

**IMPORTANT**: Put the entire repo into another empty parent folder.  
Get paima engine. Put it in that parent folder. Name it `paima-engine`. Make sure it's executable.

Install dependencies/initial setup with  
`npm run init`

If you want to deploy your own contracts, see [contracts](contracts.md)

## Building

Compile everything for backend:  
`npm run pack`
 - backend itself: api, db, state transition function, (not funnel, we don't change the funnel code at all, only define extensions.yml)
 - parts that are **also** run by backend: middleware, game-logic (i.e. round executor)
 - if you've read a template README, this also runs that "build" script

Compile middleware for frontend  
`npm run pack:middleware`

## Env Setup:

.env.development or .env.production must be in the parent folder
`../.env.name`

## Frontend  
`npm run frontend`  
If you make changes to the middleware, you have to rerun frontend (it will also pack the middleware for you).

## Development  
(TODO: not sure what this section means/does)

To reflect changes in `API` use `npm run compile:api`. This regenerates all `tsoa` routes.

In case of any DB schema or query changes use `npm run compile:db`. This starts a `pgtyped` watcher process that regenerates all of the DB types used in the project.

## Backend

Start Database  
`npm run database:up`  
Output will contain "fast shutdown request", but no errors. Process keeps running in the terminal.

Run Game Node  
`npm run backend`

## Migrations  
(TODO: 1.sql doesn't exist)

Database is set at relative blockheight "1" file: `1.sql`

## Resync with current table structure:

In docker terminal, connect to the DB instance:

```bash
psql -h localhost -U <username> -d <database>
```

This clears all rows from the existing tables:

```sql
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

If you just want to delete the database completely:  
`npm run database:wipe`
