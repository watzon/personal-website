---
title: Meet PostPilot
description: Making email testing for developers just a little bit easier, and a whole lot prettier
date: 2024-11-11T15:39:00.000Z
tags:
    - go
    - programming
    - project
thumbnail: https://utfs.io/f/GHqStrFUzb1avCinuYHFtQuKnfVMo0DC7BJaqcXwy5284bYs
---

Anyone that's been in web development long enough is familiar with the struggles of testing email, since so many applications require the ability to send emails for one reason or another. Whether it be for authentication, notifications, or just about anything else, email is a crucial part of of the web as it has been for the past few decades.

The problem is that testing email sending is a pain, and for most developers it means setting up SendGrid, Mailgun, or enabling SMTP on their personal email account. Moreover, once you start actually sending emails you have to deal with them clogging up your inbox while you're testing.

Granted there are a ton of ways around this. Just to name a few:

1. Use your personal email account (Gmail, Fastmail, ProtonMail, etc.) and enable SMTP
2. Have a local mail server be part of your development environment, along with a frontend like [SquirrelMail](https://squirrelmail.org/) or [RainLoop](https://rainloop.net/)
3. Go the tried and true route of setting up an email service like SendGrid, Mailgun, or Postmark

While these are all valid solutions which I've tried (other than setting up a local mail server), they all have their own drawbacks.

For example, using your personal email account is great for a quick and dirty solution, but it doesn't scale well when you're testing a large number of emails. Setting up a local mail server is a bit more involved, and while it does scale it adds another layer of complexity to your development environment. Using an email service is a good middle ground, but it adds another dependency to your project and can incur additional costs.

## Enter PostPilot

For these reasons and more, I've been working on [PostPilot](https://postpilot.watzon.tech), a free and open source email testing tool inspired by [Mailpit](https://github.com/axllent/mailpit) and Laravel Herd.

For those that aren't aware, the Herd developers [solved this issue](https://herd.laravel.com/docs/1/herd-pro/mail) as a part of the Laravel stack a while ago by creating a nice GUI that lists sent emails and allows you to view and interact with them. It's a beautiful solution and makes the $100 for a Herd Pro license almost worth it (the other parts of Herd take it from an almost to a definite yes). Unfortunately, it's not free, not open source, only available on macOS and Windows, and is mostly useful for the Laravel ecosystem.

Like Mailpit, PostPilot is written in Go and comes complete with a beatiful UI, notifications, and the ability to interact with incoming emails. Unlike Mailpit, PostPilot is a GUI application rather than a headless server with a web interface. I won't say either is better or worse, but they do cater to a different audience as far as preferences go.

## What's next?

PostPilot is in very active development and is very much still in the early stages. I just released version 0.1.2 which is the first actual release, and I have managed so far to get a build process in place for Linux and Windows. As of right now, the recommended way to run PostPilot on macOS would be to build it from source. Once I get to the point where I can afford an Apple developer account and a Windows signing certificate, I'll start working on installers for both platforms.

The next things I'll be working on are better documentation for the development process, and then I'll be attempting to get some of the more popular features from Mailpit working, like SpamAssassin integration and the ability to filter emails based on certain criteria.

If you're interested in following along or contributing, you can find the project on [GitHub](https://github.com/watzon/postpilot), and if you want to help me with the ability to get Windows and macOS builds out you can always support me on [Patreon](https://patreon.com/watzon), [Github Sponsors](https://github.com/sponsors/watzon), or [Ko-Fi](https://ko-fi.com/watzon).