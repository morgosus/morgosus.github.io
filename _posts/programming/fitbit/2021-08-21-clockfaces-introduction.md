---
title:              "Introduction"
date:               2021-08-21 10:37:03 +0200

categories:         programming fitbit
tags:               JavaScript SVG CSS

thumbnail:          fitbit-1
comment-section:    22

meta:
  author:           morgosus
  series:           Fitbit
  order:            1
  genre:            Programming

layout: post
---
In this series, I will dissect and explain creating a clock face for Fitbit Sense and Versa 3. Piece by piece. Now, while I will be using code examples from my app, the principles are more of a general kind. If you follow this series through, you should have a good idea of creating any Fitbit SDK clockface. It's really similar to web development. As the current version is SDK 6.0.0, I will be working under it. However, the code is identical to the previous version.

## So, What Are the Languages and Tools?
We'll be using the tools and languages Fitbit provides and requires.

1. **JavaScript**, which isn't as horrible as it sounds. It's pretty fitting for this, elementary to use, and there isn't that much programming if you're in it just to win it.
2. **SVG** is another item on the list we won't be able to avoid. While web apps use HTML, Fitbit apps use SVG.
3. **CSS** will be used for any styling whatsoever. It's a tiny bit different than the one used for web design, but it's still the same old syntax.
    - The main difference you'll notice is that the stylesheets don't use `px` units... let's be honest, if the display is 336px by 336px, we can ditch the px without any confusion.
    - Some of the attributes are slightly different, as we're styling pieces of a vector image. For example, fill is used where you'd use color in HTML. Then again, you'd use the same syntax if you were styling an SVG embedded in an HTML page.
4. **Fonts** are a bit of a pain. You'll need to either stick to the few provided fonts or generate font images through some external tool (more on that later).
5. If you feel the desire to **localize** (translate) your app, the system uses a really simple `i18n` system of *.po* files. We'll get to that too.
    - Note that you can localize your app only for the Fitbit available languages. This includes the most widespread languages.
    - Watch out for symbols. Suppose you're not using the default fonts. In that case, you might need to generate additional characters, such as when you're using а́збука (Russian alphabet).
        - I added the Cyrillic text (azbuka) on purpose. You can notice the radical shift in font, as there's no Cyrillic in the font which I'm using on this website.

### Do I Need to Install Anything?

Yes and no. Everything will work even without installing anything. That being said, you're going to be better off if you do install some items. You're going to need the following two things, but you only need one of each.

#### An SDK Interface, Something to Make the App In
1. [SDK CLI: Command Line Interface]()
- Easy to set up, and you get the comfort of your own IDE, text editors, computer, and whatever else you wish to use. While it is a command-line interface, the only actual commands you'll be running are `npx fitbit` to log in and `bi` to *build and install* your app while developing and testing it.
2. [Fitbit Studio](https://studio.fitbit.com/)
- A web interface, not advanced, but it gets the job done. It allows you to connect to a device or the simulator.

#### A Display Interface, Something to Test Your Clock Face On
1. [Fitbit Simulator](https://simulator-updates.fitbit.com/download/latest/win)
- Super easy to use. Free. What more do I need to say?
2. Actual Fitbit Device
- I do not recommend this. Some nasty bugs can force you to factory reset your device.


## So, What Can the Clock Face Actually Do?

Everything. But let's restrict ourselves to these items at first. Then we can expand upon it all.

- **Time** and **date**, potentially the **day of the week** as well
- Daily **stats** (steps, ...), heart rate, potentially goals, and other Fitbit **sensor data**
- **Battery** charge - the last thing you want is for your user to lose battery and not be aware of it

Now, most stats can be found in other places by swiping left or down... you don't always want to rely on this. It's there, but it's a new press or swipe. So if the data is essential, don't be afraid to position it somewhere on your clock face.

There are many further improvements you can include, whether it be an effect on tapping the screen, an animation, an image, or anything else.

Let's begin.
