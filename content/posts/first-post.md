+++
categories = []
description = 'First post describing how this page is deployed'
title = 'First post'
date = '2022-08-21T21:02:41+12:00'
+++

When deciding on how my workflow for adding posts and deployment I wanted a few core things.

- write posts in markdown
- statically render to html
- easy to deploy with hands off approach for the most part

Since I've been writing a lot more Go recently, i found Hugo a good choice. It covered most of my requirements out of the box.
The only hugo doesnt take care of out of the box is easy mostly hands off deploy.

For deployment I chose github actions and a handy github action provider [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
