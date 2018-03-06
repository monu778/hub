Open-Exchange Integration to Hub for Orange
===

This is the Hub integration for Open Exhange


To Do
-----

As of 8/9/2017 EOD:

* Get up and down arrow working for show more, show less on mail view
* Implement SASS if time allows
* ~~Cleanup Styles in Mail and Calendar to match syleguide~~
* ~~Ensure correct icons are in place either from Broadsoft icon file or SVG~~
* ~~Add additional calendar test data via web interface~~
* ~~Investigate deep linking options by looking at links generated in web interface (maybe look again at docs)~~ (impossible)

Architecture
===

This project uses a simple HTML + CSS + JavaScript.  A Future Java middleware will be added.



Running
---

Use the 'serve' target to run a local webserver on port 8522.  Use it like this:

  http://localhost:8522/components/mail/index.html

```
    grunt sass watch
```


Developer notes
---

This project uses NPM and grunt to get things done.  Start by running these commands:

```
    npm install
    npm install -g grunt-cli
    grunt
```

Mock Data
---

If you want to load mock data add '#mock' to the end of index.html

Deployment guide
---

TODO
