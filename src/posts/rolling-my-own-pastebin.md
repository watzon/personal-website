---
title: Rolling my own pastebin
description: A look at the code for my own pastebin project, and why I'm not using 0x0.st
date: 2024-01-03T22:41:33.691Z
tags:
    - crystal
    - programming
    - project
    - athena-framework
thumbnail: /images/uploads/rolling-my-own-pastebin.png
---

Anyone who follows me on Mastodon or interacts with me on Telegram and Discord probably knows that I've been working on a paste bin project for a while now. The project has gone through several renditions as I've used it as a testing ground for different languages and frameworks. Ultimately, I was hoping to find the perfect solutions for my personal projects going forward. Some framework that meets all of my needs, but is light weight and easy to deploy. Unfortunately, I wasn't able to find that perfect framework, and it's pretty likely that it doesn't exist. However, I did have a lot of fun experimenting and finally landed on a solution that I'm fairly happy with.

## Why build a paste bin?

It's true that paste bins are plentiful. There are the well known ones like [pastebin.com](https://pastebin.com) and [hastebin](https://hasteb.in), and the more niche ones like [dpaste](https://dpaste.com) and [0x0](https://0x0.st). Some of these are even self-hostable. However, I love building my own tools (when I have the time) and I like learning and exprimenting with new languages and frameworks, so I figured __why not?__.

I tried using [Deno](https://deno.land) and [Fresh](hhttps://fresh.deno.dev) at first, but I honestly don't love the Fresh way of doing things. Next I tried SvelteKit, but like with Fresh it just seemed kinda weird trying to do something like this using what is mostly a front-end framework. Both SvelteKit and Fresh (by themselves) made interacting with a database more trouble than it was worth, but worse was the compile time (especially with SvelteKit). For some reason I was also getting out of memory errors, especially when trying to build the docker container on lower resource systems.

## Taking a step back

Up to this point I was trying to more or less build a hastebin clone. I wanted something pretty and flashy, with all the features. What I build in Svelte and had hosted for a while was a very good looking website (if I do say so myself), but it was also slow. Such is the issue with JavaScript and CSS heavy sites I guess. So while I scratched the itch of building something pretty, and having a functional paste bin, it wasn't really what I wanted.

Fast forward a couple weeks and I decided to check my database to see if anyone had been using it. As it turns out, somewhere along the line I had made a huge mistake and leaked the credentials for the mongo database (which really shouldn't have been public facing anyway). Someone "hacked" into it and was demanding 0.01 BTC for the data back, which obviously wasn't going to happen. Thankfully it was a pretty painless lesson learned, since none of the data was sensitive.

This did give me enough of a reason to go back and re-do the project though. And so I did.

## The solution

Sometimes, the simple way is the best way, and it was looking me in the face the whole time. 0x0.st had everything I was looking for in a paste bin, save one thing. It was written in Python using Flask, and I'm not a huge fan of either. Seeing as how I already had momentum on this project and I didn't just want to let it rot, I had two options.

1. I could just use 0x0 and integrate it into my current deployment pipeline with a simple fork and a Dockerfile.
2. I could rewrite the whole thing in another language and have some fun along the way.

While option 1 would have been quick and easy, I was doing this more out of want for a project and not because I just had to self-host a paste bin. I wanted a project to work on, so option 2 it was. The only thing I needed to decide on was what language (and framework?) I wanted to use.

Really that wasn't much of a question either. Crystal was the obvious choice, given my experience with it. I'd also been looking for an opportunity to get familiar with the [Athena Framework](https://athenaframework.org/), and this was much chance. So with that I had the idea, I had the stack, now I just needed to do it. It ended up being a pretty quick project, and I had it built and deployed in the matter of a couple days.

You can check out the project [on Github](https://github.com/watzon/paste69), and you can see the hosted version at [0x45.st](https://0x45.st). Please star the project if you found it interesting,and consider hosting it yourself if you are in need of your own pastebin.
