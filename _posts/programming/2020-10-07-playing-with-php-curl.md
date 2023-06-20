---
title:              "Playing with PHP cURL"
date:               2020-10-07 23:56:48 +0200

categories:         programming
tags:               PHP cURL

thumbnail:          programming-1

meta:
  author:           morgosus
  genre:            Programming

layout: post
---
Sometimes you might want to grab a page or two on the web. See, cURL allows you to send a bot of sorts - and it does just that. This 'bot' isn't limited to visiting pages, it can post data or even login and carry a session. I guess you could make a cURL script for logging in and adjusting user settings or something.

Warning, this will be very code oriented. Most explanations will be within the code as comments.

I wrote this years ago and just found it within a 'playing-with-curl' repository on my GitLab just now.

## Let's do something simple first

Imagine that you have a search script, somewhere on some website. This script uses `$_POST` parameters to return search results. For the sake of simplicity, let's say that the script is wrapped in `if($_POST['searchSubmit'] === 'GO') {` and the value used in search is within `$_POST['searchbar']`. This means we'll need a script that will a) reach the website, b) post data, c) return with the page that appears. HTML parsers are everywhere, so let's just grab the entire page.

```php
function remoteSearch($searchFor) {
    // This is the location of the script
    $url = 'https://www.example.com/search';

    $posts = [
    // For the if clause around the script
    'searchSubmit' => 'GO', 
     // Typed into the searchbar
    'searchbar' => $searchFor
    ];

    // A cURL handler
    $ch = curl_init();

    // This sets the $url as our target
    curl_setopt($ch, CURLOPT_URL, $url);

    // We'll need POSTing
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($posts));

    // If we're on a localhost machine or something,
    // just testing, we won't verify https
    // In reality, you'd usually want to check these
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    // Enable redirects
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    // Up to 10 of them, if there are more, abort
    curl_setopt($ch, CURLOPT_MAXREDIRS, 10);

    // And of course, we want the results
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    return curl_exec($ch);
}
```

## How about using a cookie after login?

It's kinda similar, however, we'll need to deal with cookies. You see, when you login somewhere, it's usually done through a $_SESSION, which uses the SESSID cookie.

```php
function remoteLogin($username, $password, $loginUrl, $getUrl) {

// Create a cookie file, empty for now
file_put_contents('tmp/cookie.txt', '');

// We'll be posting these
$fields = [
    'loginSubmit' => true, 
    'username' => $username, 
    'password' => $password
];

// Handler, again
$login = curl_init();

curl_setopt($login, CURLOPT_URL, $loginUrl);

curl_setopt($login, CURLOPT_COOKIESESSION, true);

// Send cookies
curl_setopt($login, CURLOPT_COOKIEFILE, realpath('tmp/cookie.txt'));

// Receive and save cookies
curl_setopt($login, CURLOPT_COOKIEJAR, realpath('tmp/cookie.txt'));

curl_setopt($login, CURLOPT_HEADER, 1);
curl_setopt($login, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);

curl_setopt($login, CURLOPT_POST, 1); 
curl_setopt($login, CURLOPT_POSTFIELDS, http_build_query($fields));

curl_setopt($login, CURLOPT_SSL_VERIFYPEER, false);

curl_setopt($login, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($login, CURLOPT_MAXREDIRS, 30);

curl_setopt($login, CURLOPT_RETURNTRANSFER, true);

curl_exec($login);

curl_setopt($login, CURLOPT_URL, $getUrl);

$result = curl_exec($login);

// Now we have the cookie
curl_close($login);

// We can easily grab the cookie into a variable...
$pattern = "#Set-Cookie: (.*?; path=.*?;.*?)\n#";
preg_match_all($pattern, $result, $matches);
array_shift($matches);
$cookie = implode("\n", $matches[0]);

$get = curl_init($getUrl);
// ...And use it within another cURL
curl_setopt($get, CURLOPT_COOKIE, $cookie);

curl_setopt($get, CURLOPT_COOKIESESSION, true);

curl_setopt($get, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($get, CURLOPT_SSL_VERIFYHOST, false);

curl_setopt($get, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($get, CURLOPT_MAXREDIRS, 10);

curl_setopt($get, CURLOPT_RETURNTRANSFER, true);

return curl_exec($get);}
```

## Finally, Some  Real Life Example of Something That Once Worked:

This is something I wrote a few years ago. Just in case I forgot how cURL works :D. The goal was to login as a user and then grab a page using the cookie.

```php
function useSessionTomsUser($username, $password){
echo '<h1>Toms.click grab user account page contents (after login)</h1>';
echo '<h3>Page to grab before login:</h3><br>';
file_put_contents('tmp/tomsCookie.txt', '');

/*** CHECK-PAGES-BEFORE-LOGIN ***/

$checkForNothing = curl_init('https://toms.click/user');
curl_setopt($checkForNothing, CURLOPT_RETURNTRANSFER, true);
curl_setopt($checkForNothing, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($checkForNothing, CURLOPT_MAXREDIRS, 15);

curl_setopt($checkForNothing, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($checkForNothing, CURLOPT_SSL_VERIFYHOST, false);

echo curl_exec($checkForNothing) . '<br><br><h3>Form: (before submit)</h3><br>';

$checkForNothing = curl_init('https://toms.click/user');
curl_setopt($checkForNothing, CURLOPT_RETURNTRANSFER, true);
curl_setopt($checkForNothing, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($checkForNothing, CURLOPT_MAXREDIRS, 15);

curl_setopt($checkForNothing, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($checkForNothing, CURLOPT_SSL_VERIFYHOST, false);

echo curl_exec($checkForNothing) . '<br><br><h3>Form: (after login)</h3><br>'; 

/*** LOGIN ***/

curl_close($checkForNothing);

// If I were to send it just to /user, it would redirect without the post
$login = curl_init('https://toms.click/user/login');

curl_setopt($login, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($login, CURLOPT_MAXREDIRS, 15);

curl_setopt($login, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($login, CURLOPT_SSL_VERIFYHOST, false);

curl_setopt($login, CURLOPT_COOKIEFILE, realpath('tmp/tomsCookie.txt'));

curl_setopt($login, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);

curl_setopt($login, CURLOPT_POST, 1);
curl_setopt($login, CURLOPT_POSTFIELDS, http_build_query(
    ['loginSubmit' => true, 'username' => $username, 'password' => $password])
);

curl_setopt($login, CURLOPT_RETURNTRANSFER, true);

echo curl_exec($login) . '<br><br><h3>Grabbed:</h3><br>';

/*** GET-PAGE-AFTER-LOGIN ***/

curl_close($login);

$checkForUserInfo = curl_init('https://toms.click/user');
curl_setopt($checkForUserInfo, CURLOPT_RETURNTRANSFER, true);
curl_setopt($checkForUserInfo, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($checkForUserInfo, CURLOPT_MAXREDIRS, 15);

curl_setopt($checkForUserInfo, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($checkForUserInfo, CURLOPT_SSL_VERIFYHOST, false);

// Send cookies
curl_setopt($checkForUserInfo, CURLOPT_COOKIEFILE, realpath('tmp/tomsCookie.txt'));
// Receive and save cookies 
curl_setopt($checkForUserInfo, CURLOPT_COOKIEJAR, realpath('tmp/tomsCookie.txt'));

return curl_exec($checkForUserInfo);}
```

## Summary

You know what cURL is for. You have a basic understanding of how to use cURL to grab pages and login on a page without a capcha.