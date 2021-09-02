if(getCookie('consent') !== 'true'){
    const cookieBanner = byId('cb');
    byId('cbl').appendChild(cookieBanner.content.cloneNode(true));
}