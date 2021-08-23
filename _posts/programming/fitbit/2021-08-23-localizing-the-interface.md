---
layout: post
title:  "Localizing the Interface"
date:   2021-08-23 11:42:05 +0200
categories: programming fitbit
thumbnail: /assets/thm/programming/fitbit/fitboy.jpg
thumbnail-alt: "Advanced Fitbit SDK: The birth of PIP-BOY!"
featured: false

author:
  name: Martin Toms
  givenName: Martin
  alternateName: morgosus
  familyName: Toms
  gender: male
  email: martin@toms.click
  sameAs: https://github.com/morgosus
  url: https://martin.toms.click
  alumniOf:
    type: CollegeOrUniversity
    name: Czech University of Life Sciences Prague
    url: https://en.wikipedia.org/wiki/Czech_University_of_Life_Sciences_Prague
    startDate: 1906

hidden-meta:
- itemprop: countryOfOrigin
  value: Czech Republic
- itemprop: genre
  value: Programming
- itemprop: backstory
  value: Written by a programmer
- itemprop: accessMode
  value: visual
- itemprop: accessModeSufficient
  value: textual

series: Fitbit
order: 3

github_comments_issueid: 26
published: true

---
As we've gone through the most important parts of programming a clock face, let's take a quick look at something useful that's totally optional - translating our interface.

Fitbit uses i18n (which stands for internationalization - the 18 letters between i and n[^1]). It allows localizing our app for English, Spanish, Italian, Czech, and many more languages. It's also dumbfoundedly simple.

The idea is that for each language you wish to include in your app, you'll create a file with the language tag (BCP-47, e.g., en-US, es-ES) within an i18n folder. Of course, the extension has to be .po as we're dealing with PO files.

## So, What's the Code?
It all revolves around the import, again. We import a `gettext(key)`
function, which will look through the PO file and return the correct value for the key.

## Let's do an example.

Assume that the file we're looking through - en-US.po contains the following lines:

```po
msgid "someKey"
msgstr "Some Text"
```

If we used this snippet anywhere, as long as the `en-US.po` is nearby. The PO files do not have a global scope. (for `/app`, it needs to be in the `/app/i18n` folder, for `/companion` - more about that later - it needs to be in the `/companion/i18n` folder; same for `/settings`)

```javascript
import { gettext } from "i18n";

const someLabel = document.getElementById("sl");

someLabel.text = gettext(someKey);
```

And with that, we just assigned the value "Some Text" to the text field of the SVG element with the id="sl".

## Last Tip

Sometimes you might want to have something specific to only a particular locale. For example, let's say that you have a font specifically for Russian (more about fonts some other time). At that point, you'd use the `user-settings`, namely the `locale` part of it.

```javascript
import { locale } from "user-settings";

if(locale.language === 'ru-ru')
    const font = 'Oswald_16';
else
    const font = 'Monofonto_16';
```

[^1]: https://www.w3.org/International/questions/qa-i18n
