---
title: Building a Pastebin in Go for Fun and Profit
description: Most people probably don’t think about pastebins anymore. They came into existence long ago, when the internet was young as a way of sharing code snippets and other long form text in places like Usenet, IRC, and forums. That being said, those of us...
date: 2024-11-13T13:30:00.000Z
tags:
    - go
    - programming
    - project
thumbnail: https://utfs.io/f/GHqStrFUzb1ar266vp4jJNdk40Kt6mcqWwj8QuClHEFbMGav
---

Most people probably don't think about pastebins anymore. They came into existence long ago, when the internet was young as a way of sharing code snippets and other long form text in places like Usenet, IRC, and forums. That being said, those of us who still spend a lot of time in those places and others such as Telegram, Discord, and Slack probably still find them useful.

Now I lied in the title when I said "for fun and profit". This project was built for fun, but profitable it is not. If anything, doing what I'm doing and hosting a pastebin publically on your own server will definitely cost you more money than it makes you, but we aren't in this for the money. Right?

_Right?_

## The State of Open Source

_Con permiso_, I'm going to take a little step back and talk about the state of open source, why I continue to contribute so much to it, and why you should care.

Some people are, and I'm sure we all know at least one, are evangellical about open source to the point of being obnoxious. The RMS fanbois and Suckless zealots are the most obvious examples that come to mind, but there are many who think that software should be free, and that the only way to do it is to make it open source. I am not one of those people.

Don't get me wrong, I love open source. My GitHub profile contains over 100 original repositories from the past decade, and I actually could not put a number on the number of contributions I've made to other people's projects. Sometimes... Ok even most of the time, I contribute out of boredom or necessity more than just a "desire to do good", but I digress. Open source is about giving back to the community that has given you so much, and I am all for that.

However, even with the thousands of hours I've spent contributing to open source, it is not something you get into for the money. Even with a wildly successful project, the chances you'll be able to pay yourself adaquately for the hours you put in are slim to none. People in general just don't donate to the open source projects they use, and that's sad.

So no, this is not for profit. This is for fun.

## The State of Pastebins

Creating a basic pastebin is not a hard task, and that's why, just like pet blog projects, there are hundreds of them out there. There are a couple of big names that come to mind, such as [Pastebin.com](https://pastebin.com) and the now defunct but still open source [Hastebin](https://github.com/seejohnrun/haste-server), along with tons of smaller ones like [0x0.st](https://0x0.st).

And the thing is, none of them are really bad. They cater to different audiences, and that's why they are successful.

My project is no different.

## Meet Paste69

I know what you're thinking. _"Paste69? Really?"_

Yes, I am immature. Sue me.

**[Paste69](https://0x45.st)** is my attempt at creating an ubiquitous, open source pastebin for command line enthusiasts. Like 0x0, it features a simple and short URL, and an easily CURLable API. But unlike 0x0 the features don't stop there.

Want to give it a try? It's as simple as:

```shell
curl -F "file=@file.txt" https://0x45.st
```

Want a prettier output? Just pipe to `jq`:

```shell
curl -F "file=@file.txt" https://0x45.st | jq
```

Or with nushell things are even nicer:

```shell
curl -F "file=@file.txt" https://0x45.st | into json
```

**But the fun doesn't stop there!**

Paste69 can be used for text files, but it can also be used for binary files. Want to share an image? No problem:

```shell
curl -F "file=@image.png" https://0x45.st
```

How about a PDF?

```shell
curl -F "file=@document.pdf" https://0x45.st
```

How about sending a JSON request instead of a multipart form?

```shell
curl -X POST -d '{"content": "Hello, world!", "extension": "txt"}' https://0x45.st
```

**And that's not all!**

Paste69 doesn't only function as a pastebin and file host, it also features a link shortener. Note that this does require an API key.

```shell
curl -X POST https://0x45.st/url \
    -H "Content-Type: application/json" \
    -d '{"url": "https://github.com/0x45/paste69"}'
```

And speaking of API keys, you can request one from your terminal as well:

```shell
curl -X POST https://0x45.st/api-key \
    -H "Content-Type: application/json" \
    -d '{
    "email": "your@email.com",
    "name": "Your Name"
}'
```

## Conclusion

Open source is about the fun and the community, and now I have yet another project to put out into the ether and share with you all. Thanks for being here, thanks for reading, and I hope you stick around to see what's next.