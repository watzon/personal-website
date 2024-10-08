---
date: 2023-10-17T18:53:50.702Z
title: Migrating your Redis database to another server
description: How to migrate your Redis database to another server
tags:
  - databases
  - redis
  - servers
  - devops
thumbnail: /images/uploads/migrating-your-redis-database-to-another-server.jpeg
---

Seeing this title you might be thinking to yourself, _why would I ever need to do that?_. After all, redis is meant to be used as a throwaway cache right? Caches by their very nature are generally disposable, so what would posess you to want to migrate that cache somewhere else? Well, I can't speak for you, but I can tell you why I needed to do it.

I currently host my own [Firefish](https://joinfirefish.org) instance and have been doing so for the last couple months. In that couple of months I have moved from [Caprover](https://caprover.com), to [Coolify](https://coolify.io), to finally running it in its own VPS. Why all the moving? Because as it turns out, something like Firefish likes to be on its own, especially if you plan on opening your instance up to other people.

Firefish relies on two databases. Postgres for standard data storage, and Redis for caching. The Postgres database is easy enough to migrate, I even wrote a [simple bash script](https://0x45.st/mostly-eventually-themselves.bash) to make it even easier. Redis, however, doesn't have an easy way to dump all of its data to a file, and it doesn't have a way to import that data either. It does have something that might be even easier though.

## Redis replication

Redis has a built-in replication system that allows you to replicate a master database to one or more slave databases. This is useful for a number of reasons, but the one we're interested in is the ability to replicate a database to another server. This is exactly what we need to do in order to migrate our Redis database to another server.

Thankfully this can also be done without editing any configuration files. All you need is access to `redis-cli` on the new server, and a way to connect to the old server. This means that your old server does have to, at least temporarily, be accessible from the outside world (though this can be done over a VPN, or using an internal network). Once you have access to both servers, open a shell in the new server and run the following command:

```bash
redis-cli
```

This will open the redis command line interface. From here we can run the `REPLICAOF` command to tell redis to replicate a master database. The syntax is as follows:

```bash
REPLICAOF <masterip> <masterport>
```

So if your master server is at `10.0.0.2` and is running on port `6379`, you would run the following command:

```bash
REPLICAOF 10.0.0.2 6379
```

This will immediately start the replication process. You can check the status of the replication by running the `INFO` command. This will give you a lot of information, but the part we're interested in is the `master_link_status` field. If this is `up` then the replication is working. If it's `down` then something went wrong.

You can also check the status of the incoming keys by listing all the keys:

```bash
KEYS *
```

This will list all the keys in the database. If you see the keys you expect to see, then the replication is working. If you don't see any keys, then something went wrong.

## Authentication

If you have authentication enabled on your master server via `requirepass`, you'll need to provide the password to the replica server. This can be done by running the following command:

```bash
config set masterauth <password>
```

## Stopping replication

Once you're done with the replication, you can stop it by running the following command:

```bash
REPLICAOF NO ONE
```

This will stop the replication process and allow you to use the replica server as a standalone server. From this point you should be free to delete the master server, or do whatever you want with it.

## Conclusion

I hope this post was helpful to you. I know it's a bit of a niche topic, but I had a hard time finding any information on how to do this, so I figured I'd write it up in case anyone else needs to do this in the future.
