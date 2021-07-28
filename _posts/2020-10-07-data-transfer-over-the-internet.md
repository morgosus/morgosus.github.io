---
layout: post
title:  "Data Transfer Over the Internet"
date:   2020-10-07 11:47:39 +0200
categories: programming
thumbnail: "thm/programming.svg"
thumbnail-alt: "Programming"
featured: false
author: Martin Toms

published: true

---
Everyone knows the internet. Does everyone know how it works? Probably not. I'm not talking hardware, that's easy (not really), I'm talking protocols. We'll start with HTTP and make our way through the most frequently used ones.

Each of these protocols has a default port, but these can be changed by adding :xx after the domain name (http://www.toms.click:4000/), of course the server needs to be configured for that.

## HTTP :80

Hypertext Transfer Protocol is at the very base of the internet. You can send text, videos, images, documents or even audio over HTTP. Sounds great, right? Well, it's **not encrypted**. You see, anything you send over HTTP is pretty much sent in plain text, so anyone (Okay, not anyone, but someone who knows what they're doing.) can step in between you and your target and grab this data. This is actually called MITM (Man-in-the-middle) attack.

### HTTP Message

Let's say we type http://toms.click/ into the address bar and press enter, we're asking the toms.click server (HTTP message) to send us a page (response). This is actually the structure of HTTP messages:

#### Request Message

```bash
Start-line     GET¹    /public/index.html(URI²)    HTTP/1.x³
Headers⁴       HOST: toms.click⁵
(value pairs)  Accept: text/html
               Accept-language: en-us
Body           ⁶
```

¹ Method, typically GET (parameters within url ?foo=bar) or POST (hidden parameters)  
² Uniform resource identifier  
³ HTTP version  
⁴ Information / meta data  
⁵ Server to which we're sending the message  
⁶ If it's just a request, there's nothing in the body

#### Response Message

```bash
Start-line     http/version status code⁷
Headers        HOST: toms.click
               Accept: text/html
               Accept-language: en-us
Body           public/index.html⁸
```

⁷ 2xx - OK, 4xx - Error, etc., we all know 404 Not Found
⁸ File sent back as a response (index.html web page in this case)

## HTTPS :443

HTTPS (HTTP Secure, HTTP over TLS, HTTP over TLS) is an encrypted version of HTTP. Nowadays, pretty much any website that does more than just showing static pages should be using this.

Take a look at any internet banking website, their URL will start with https:// instead of http://. There will also be a green or white lock somewhere nearby (usually on the left side.) This lock  means that the website has a valid certificate issued by a certification authority, in the Czech Republic such authority is the Czech Post and a few others. If the lock is red, it's probably not secure and you might want to reconsider typing in your login details.

Most certificates are paid, however, you can find some free authorities too. **Let's Encrypt** comes to mind. The main difference between the paid and free ones is the 'insurance'. If the encryption is broken, you might get some damages money from the paid ones. A few years ago, most HTTPS pages were safe. Now, anyone can get a certificate for free, very easily - and while the data transfer while you're logging in on a dubious website like https://iwillstealyourcredit.card/ is encrypted... well, let's just say that https:// isn't a guarantee that you're not handing your login info over to someone evil anymore. Spooky.

You can click the lock and view the certificate in most browsers to view the certificate. It should contain the domain, authority name and dates of validity. Each certificate is valid only over a certain period of time, usually a few months or years, and needs to be prolonged afterwards. You can often see expired certificates on smaller websites which have been abandoned or forgotten.

## FTP

The File Transfer Protocol is intended for transferring files. Notice that while HTTP was intended for a multitude of data, this one only does files. As with HTTP, it's not secure. To use FTP, you must enter your password. Ironically, this password is sent in plain text. FTP and its variants are often used to transfer apps to the server, or to access its entrails (files).

### TFTP

A variant of FTP, the Trivial FTP is intended only for read/write operations. It can't rename or delete files. It has no authentication. Could be useful for remote booting or something... then again, it's not safe, is it?

### SFTP and FTPS

The SSH (Secure Shell) FTP or FTP w/ SSH are the encrypted variants. It can send more detailed data, such as the access rights to file, data, size, time, etc. I already mentioned they're encrypted. SSH takes care of the connection, there's a public key and a password within the SFTP.

FTP over SSL, or FTPS uses multiple ports, one for authentication and a second one for data. This need for multiple open ports isn't necessarily safe. SFTP is okay with just one port, which is easier to secure.

## DNS

Finally, why is toms.click a sufficient server name? Because of the Domain Name System... If we type www.toms.click, our browser has ways of translating this information to an IP address. The browser sends a request to the recursive name server. The RNS remembers some IP addresses. If it's not there, it'll ask one of the TLD (Top Level Domain) servers (last time I checked, there were 13 of them, .com, .de, .net, ...) Assume we're trying to get to youtube.com, the request is sent to the .com TLD server. From here, a response is sent to the RNS, which will cache this IP for a while. Next time, the browser will get a result directly from the RNS.

You can clear your DNS Cache through cmd: ipconfig/flushdns. Don't do it though. It can solve some DNS errors though.

Some malware uses this. Let's say your internet banking is at ib.csob.cz - if your cache points to a phishing website which looks just like it, you probably won't notice and you'll enter your internet banking info there. Sweet dreams.

## Summary

You know what HTTP is and what the key difference between it and HTTPS is. You have an idea of the protocols used for file transfer and a general understanding of how domains work.