if(getCookie('consent') !== 'true'){
    const cookieBanner = byId('cookie-banner');
    byId('cookie-banner-location').appendChild(cookieBanner.content.cloneNode(true));
}