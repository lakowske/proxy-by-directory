/*
 * (C) 2014 Seth Lakowske
 *
 * inspired by dominictarr/proxy-by-url
 */

var httpProxy  = require('http-proxy');

/*
 * Takes an object containing urls and targets
 *
 * @param {Object} urls where each key is a directory and its value is the target
 */
module.exports = function (urls, proxy) {
    // 'matchers' is the array of URL matcher functions
    var matchers = [];

    // proxy is a 1.0 style http-proxy function.
    // If one is not given as an argument, we'll create one.
    if (!proxy) {
        proxy = httpProxy.createProxyServer({});
    }

    for (var url in urls) {
        // Create function that matches the url and add it to the list
        matchers.push(matcher(url, urls[url]));
    }

    // This closure is returned as the request handler.
    return function (req, res) {

        for (var k in matchers) {
            // for each URL matcher, try the request's URL.
            var matcher = matchers[k];
            var m = matcher(req.url);
            // If it's a match:
            if (m) {
                proxy.web(req, res, m.dest);
            }
        }

    }
}

function matcher (url, dest) {
    // First, turn the URL into a regex.
    // NOTE: Turning user input directly into a Regular Expression is NOT SAFE.
    var r = new RegExp(url.replace(/\//, '\\/'));
    // This next block of code may look a little confusing.
    // It returns a closure (anonymous function) for each URL to be matched,
    // storing them in an array - on each request, if the URL matches one that has
    // a function stored for it, the function will be called.
    return function (url) {
        var m = r.exec(url);
        if (!m) {
            return;
        }
        var path = url.slice(m[0].length);
        console.log('proxy:', url, '->', dest);
        return {url: path, dest: dest};
    }
}
