---
title: Using n8n to create a simple Mastodon bot
description: How to use n8n to create a simple Mastodon bot
date: 2023-12-09T23:53:19.889Z
thumbnail: /images/uploads/using-n8n-to-create-a-simple-mastodon-bot.png
tags:
    - bot
    - fediverse
    - mastodon
    - n8n
---

I am no stranger to bot development. One of the projects listed on my [projects page](/projects) is actually a bot framework written for Telegram which I've been working on for the past several years. I've also dipped my toe into the Mastodon bot scene with a simple Crystal-based take on the `!remindme` bot from Reddit. However, that bot is not currently running and that leads me to the topic of this post.

## n8n

For those that are unaware, [n8n](https://n8n.io/) is a node-based workflow automation tool. It's similar to Zapier or IFTTT but it's open source and can be self-hosted. It has a ton of integrations ranging from the usual suspects like Twitter (no I will not be calling it X) and Telegram, to ones you might not suspect like Postgres, AWS, and pretty much everything from Google. While it's lacking a Mastodon specific integration, it does have a generic HTTP request node which can be used to interact with the Mastodon API.

## The bot

The bot we're going to be working on here is a very simple one. You see, I have this blog and I want to post links to new posts on Mastodon. I could do this manually, but there's always the chance that I'll forget; and anyway, why not automate it if I can? So, what we're going to do is scrape the RSS feed for this blog, check if there are any new posts, and if there are, post them to Mastodon.

Now I keep saying Mastodon here, but in reality my instance of choice is [Firefish](https://joinfirefish.org/) which is a fork of Misskey, but I tend to use the term Mastodon as a catch-all for the fediverse. Anyway, let's get started.

### The workflow

We'll be using the following nodes (more or less in order):

##### RSS Feed Trigger

This is our input node. It will check the RSS feed periodically and trigger the wokflow with the most recent post.


##### Postgres - Check if post exists

You can use whatever you want, but I chose Postgres as it was what I already had ready to go. This node will check the database to see if the post has already been posted. Since the lack of a post will return an empty result which isn't the easiest to use, we will run `SELECT COUNT(*) FROM posts WHERE guid = ...`.

##### IF/ELSE

This node will check the result of the Postgres node. If the result is less than 1 we can continue on.

##### HTTP Request

This is the node that will actually post to Mastodon (or whatever service you're using). All it has to do is send a JSON request to your instance, along with the auth token. In the case of Misskey the auth token is included in the JSON body as the `i` field, but your results may vary.

##### Postgres - Insert post

Lastly we'll update the database with the new post.

### The finished workflow

![The finished workflow](/images/uploads/using-n8n-to-create-a-simple-mastodon-bot.png)

You can check out the JSON for the entire finished workflow [here](https://0x45.st/repeat-gain-sum.json), and import it into your own n8n instance if you want to use it as a starting point for your own bot. You can check out the actual bot in action [@watzontech@watzonmanor.com](https://watzonmanor.com/@watzontech).

## Conclusion

As always, you're going to have more control if you write your own bot from scratch. For lots of things this probablt isn't the right workflow. However, if you're just looking to automate something simple, n8n is a great tool to have in your toolbox. I hope this post has been helpful to you, and if you have any questions feel free to reach out to me in the fediverse at [@watzon@watzonmanor.com](https://watzonmanor.com/@watzon).
