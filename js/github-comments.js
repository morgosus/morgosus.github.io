// Original code taken with permission from : https://github.com/dwilliamson/donw.io/blob/master/public/js/github-comments.js
//

async function getComments(repo_name, comment_id, page_id, acc )
{
    const url = "https://api.github.com/repos/" + repo_name + "/issues/" + comment_id + "/comments" + "?page=" + page_id;
    const resp = await fetch (url, { headers: {Accept: "application/vnd.github.v3.html+json"}});
    if (resp.status !== 200) {
        throw new Error("Response status " + resp.status + " while attempting to fetch comments from: " + url);
    }

    const comments = await resp.json();

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    comments.reverse();

    // Individual comments
    for (let i = 0; i < comments.length; i++)
    {
        const comment = comments[i];
        const date = new Date(comment.created_at);
        const elapsed = timeSince(date.getTime());

        acc += "<div class='comment'>" +
            "<div class='comment__left'>" +
            "<img class='comment__img' alt='Avatar image' src='" + comment.user.avatar_url + "' width='24px' />" +
            "</div><div class='comment__right'>" +
            "<a class='comment__user' href='" + comment.user.html_url + "'>" + comment.user.login + "</a>" +
            "<time class='comment__date' datetime='" + date.toUTCString() + "'>" + elapsed + " ago</time>" +
            "<div class='comment__content'>" + comment.body_html + "</div>" +
            "</div></div>";
    }

    // Call recursively if there are more pages to display

    const links = resp.headers.get("Link");
    if (links) {
        const entries = links.split(",");
        for (let j=0; j<entries.length; j++)
        {
            const entry = entries[j];
            if (-1 != entry.search('rel="next"'))
            {
                acc = await getComments(repo_name, comment_id, page_id+1, acc);
                break; // recurse on "next" and then stop looking for "next".
            }
        }
    }
    return acc;
}

function DoGithubComments(repo_name, comment_id)
{
    document.addEventListener("DOMContentLoaded", async function()
    {
        try {
            // post button
            const url = "https://github.com/" + repo_name + "/issues/" + comment_id + "#new_comment_field";
            const acc = ("<a class='comment-button' href='"+url+"'>〔 Add a Comment 〕</a>");
            const comments = await getComments(repo_name, comment_id, 1, acc);
            const commentsElement = document.getElementById('gh-comments-list');
            commentsElement.innerHTML = comments;
        } catch (err)
        {
            console.log( err.message );
        }
        return null;
    });
}