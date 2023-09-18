---
tags:
  - javascript
  - go
  - hugo
description: 'First post describing how this page is deployed'
title: 'First post'
pubDate: '2022-08-21T21:02:41+12:00'
---

## Thoughts

When deciding on my workflow for adding posts and deployment I wanted a few core things.

- write posts in markdown
- statically render to html
- easy to deploy with hands off approach for the most part

Since I've been writing a lot more Go recently, I found Hugo a good choice. It covered most of my requirements out of the box.
Hugo doesn't have a deploy feature though, but a good github action and YAML takes care of this.

For deployment I chose github actions and a handy github action provider [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

## Whats next

I've been working on a prototype for scripting part of Golang from Javascript using [v8go](https://github.com/rogchap/v8go). Not sure what I intend to get out of this yet or the bigger project but it is fun and challenging so far.
