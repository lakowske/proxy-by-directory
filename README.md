Proxies requests based on the url directory (e.g. /database, /articles, etc...).  It is Similar to [proxy-by-url](https://github.com/dominictarr/proxy-by-url), but works with http-proxy 1.0 api.

```javascript
var server = require('http').createServer(require('proxy-by-directory')({
    '/articles' : { target : 'http://localhost:5555/' },
    '/' : { target : 'http://sethlakowske.com:7777' }
}))
```
