---
title: Run GitHub Actions locally and never have a failed deploy again
description: How to run GitHub Actions locally and never have a failed deploy again
date: 2022-07-01T16:15:44.093Z
tags: []
thumbnail: /images/uploads/run-github-actions-locally-and-never-have-a-failed-deploy-again.webp
---

One of the worst things about any CI in my opinion is making configuration changes. Typically there's no way of knowing if your changes are going to work or not until you attempt a deploy, which generally means committing that change and then pushing it to your repository.

If you're having issues this can lead to tons of unnecessary commits.

![Github actions with a number of failed deploys](/image/uploads/failed-deploys.png)

Look familiar? Well not anymore!

## Introducing: Act

[Act](https://github.com/nektos/act) is a docker based command line tool for running GitHub actions locally. With it you can make config changes and then test those changes without ever deploying to GitHub. This could be useful in a number of circumstances, as it will also allow you to test your pull requests before you ever push them.

Installing Act is a breeze as well. It's supported by all major platforms, including Windows. You can find full install instructions [here](https://github.com/nektos/act#installation-through-package-managers), but it usually comes down to running `install act` or `install act-cli` with your package manager. Make sure you have Docker installed as well, as it's required to run Act.

Now just go into your project directory (make sure it has a .yaml file in `.github/workflows` and that your code is committed and pushed) and run `act`. You should see several logs being output to the console as Act downloads the required docker containers and starts running your deploy. This might fail, but it's a good way to check that things are working.

Act fully supports secrets, including `GITHUB_TOKEN`, but it's not capable of fetching those secrets itself. If you're using `secrets.GITHUB_TOKEN` in your workflow you'll need to create a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the proper permissions, then run

`act -s GITHUB_TOKEN=your_personal_access_token`

You can add other secrets the same way, or you can go the more secure route and store your secrets in a file and import them with the `--secret-file` flag. This keeps your secrets out of your shell history. Just make sure you don't commit that file 😜

There are probably some third-party actions that won't run correctly in Act. For instance, [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) gives me the error `"Cannot read properties of undefined (reading 'fork')"` when I try to run it locally, but when I deployed to GitHub it worked just fine. The tool is only as good as the ecosystem.

Hopefully this was something new for you. I was super happy to learn about it myself. Please consider subscribing to this blog to get notified when I post new tutorials like this one; and as always, happy coding!