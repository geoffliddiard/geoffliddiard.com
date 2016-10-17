#geoffliddiard.com


Single page personal website. Hosted for free on Google Firebase. Static site is compiled using Gulp.

-

**Requirements**

This site requires Node.js and NPM to be installed for local development. If you have both, you will also need to install the following packages globally:

```
npm install -g firebase-cli gulp-cli jeet
```


Initialise your firebase project

```
firebase init
```

Then install project dependencies...

```
npm install
```
-

**Development:**

Lightweight Node.js connect server with live reload is used for development and is available on [http://localhost:3000/](http://localhost:3000/).

HTML is compiled from .pug templates in _./src/templates_ and copied to _./src/index.html_. Edit the pug files to change compiled output.

CSS is compiled from .stylus files in _./src/styl_ and copied to _./src/css/style.css_

JS is edited directly at _./src/js_ and is minified and concatenated during build

Start the dev server with the default command:

```
gulp 
```
-

**Build**

Copies all static files from _./src/app/_ to _./dist/_. Minifies and concatenates CSS and JS files defined within the usemin blocks and replaces references in index.html to point to the updated file revisions.

```
gulp build
```
-
**Deploy:**

Deploys static content directory to Firebase - see firebase.json for configuration options. I've used heavy caching on static assets due to cache busting on CSS and JS applied during build via gulp-rev

```
gulp deploy
```