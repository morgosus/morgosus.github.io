//if not thumbnail and within post, replace with a captioned figure
function byTag(name) {
    document.get
}

const pstImgs = byTag('img');

for (let i = 0; i < pstImgs.length; i++) {
    let img = pstImgs[i];
    if (img.classList.value === "") {
        const fgr = document.createElement("figure");
        const ctn = document.createElement("figcaption");

        fgr.setAttribute('class', 'post__image-wrapper');
        img.setAttribute('class', 'post__image');
        ctn.innerHTML = img.alt;
        ctn.setAttribute('class', 'post__image-caption');
        fgr.appendChild(img.cloneNode());
        fgr.appendChild(ctn);
        img.replaceWith(fgr);
    }
}