function setCookie(e, t, o) {
    let n = new Date;
    n = new Date(n.getTime() + 24 * o * 60 * 60 * 1e3), document.cookie = e + "=" + t + "; expires=" + n + "; path=/"
}

function getCookie(e) {
    for (let t, o = document.cookie.split("; "), n = o.length; n--;) if ((t = o[n].split("="))[0] === e) return t[1];
    return !1
}

function deleteCookie(e) {
    document.cookie = e + "=null; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"
}