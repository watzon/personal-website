---
title: Facilitating Postgres database migration
description: How to migrate your Postgres database to another server
tags:
  - databases
  - devops
  - servers
  - postgres
date: 2023-10-18T00:01:39.322Z
thumbnail: /images/uploads/facilitating-postgres-database-migration.jpg
---

On the back of today's other post about [migrating your redis database across servers](/posts/migrating-your-redis-database-to-another-server/) I thought it only made sense to talk about migrating your Postgres database as well, seeing as I migrated my Postgres database for my [Firefish](https://joinfirefish.org) instance as well.

## Postgres' built-in migration tool

This probably isn't going to be breaking news to anyone, but Postgres has a built-in tool for migrating databases. It's called `pg_dump` and it's pretty easy to use. The syntax is as follows:

```bash
pg_dump -h <host> -p <port> -U <username> -d <database> > <outputfile>
```

This allows you to pretty easily dump your entire database to a file. This file can then be imported into another database using the `psql` command:

```bash
psql -h <host> -p <port> -U <username> -d <database> < <inputfile>
```

You can also pretty easily combine the two commands using a pipe:

```bash
pg_dump -h <host> -p <port> -U <username> -d <database> | psql -h <host> -p <port> -U <username> -d <database>
```

## Making it even easier

I'm lazy, so I don't want to have to type out that entire command every time I want to migrate my database. Thankfully, I don't have to. I can just write a simple bash script to do it for me. Here's what I came up with:

```bash
#! /usr/bin/env bash
# This script is used to migrate a postgres database from one server to another.
# Usage: pgmigrate <source> <destination>
# Example: pgmigrate postgres://user:pass@localhost:5432/source postgres://user:pass@localhost:5432/destination

set -e

if [ $# -ne 2 ]; then
  echo "Usage: pgmigrate <source> <destination>"
  exit 1
fi

SOURCE=$1
DESTINATION=$2

echo "Migrating from $SOURCE to $DESTINATION"

echo "Dumping source database"
pg_dump $SOURCE > /tmp/dump.sql

if ! psql $DESTINATION -c "select 1" > /dev/null 2>&1; then
  echo "Destination database does not exist. Creating it"
  dbname=$(echo $DESTINATION | sed -e 's/.*\///')
  dest=$(echo $DESTINATION | sed -e 's/\/[^/]*$//')
  psql $dest -c "create database $dbname"
fi

echo "Restoring to destination database"
psql $DESTINATION < /tmp/dump.sql

echo "Cleaning up"
rm /tmp/dump.sql

echo "Done"
```

This script takes two arguments, the source database and the destination database. It then dumps the source database to a file, creates the destination database if it doesn't exist, and then restores the source database to the destination database. It then cleans up after itself and exits.

Here's an example of how to use it:

```bash
pgmigrate postgres://user:pass@localhost:5432/source postgres://user:pass@localhost:5432/destination
```

How simple is that?

## Conclusion

I hope this post was helpful to you. I don't see this one being as niche and potentially useful as the redis one, but I figured I'd write it up anyway, if for no othr reason than my propensity for borking my linux system, losing my files, and having to start over from scratch.
