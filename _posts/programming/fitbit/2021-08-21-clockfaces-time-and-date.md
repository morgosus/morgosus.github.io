---
title:              "Time and Date"
date:               2021-08-21 13:20:16 +0200

categories:         programming fitbit
tags:               JavaScript SVG CSS

thumbnail:          fitbit-1
comment-section:    24

meta:
  author:           morgosus
  series:           Fitbit
  order:            2
  genre:            Programming

redirect_from: https://www.toms.click/programming/fitbit/clockfaces-time-and-date

layout: post
---
The most essential part of a **clock** face is the time display. Fortunately for us, Fitbit has provided the Clock API. It's a nifty thing that allows you to run code every second/minute or hour.

Before we forget, we need to add `<text id="someId">placeholder</text>` into the index.view file in /resources. for every item we get through `document.getElementById`.

Every component used in a Fitbit app uses a similar template. We import an API and then work through it. The clock API[^1] is no different.

```javascript
import clock from "clock";
import document from "document";

// I like to keep my clock and AM/PM as a separate label, this is completely up 
// to you to decide
const timeLabel = document.getElementById('timeLabel');
const timeIndicator = document.getElementById('timeLabel');

// Tick every second, minute, hour; it can also be disabled with off
clock.granularity = "seconds";

// This is where the clock ticking happens, we can access time here
clock.ontick = (evt) => { }
```

Now, notice that even the `document` keyword needs to be imported. By default, you have almost nothing except variables and imports available within your scripts. This is due to resource limitations. You see, Fitbit devices use the JerryScript engine. The computer within your Fitbit watch is pretty much a miniature equivalent of a 90s computer. This comes with the disadvantage of a... slightly different way the engine works.

To quote one of my favorite optimization guidelines:

> Keep in mind that in contrast to the desktop JS engines, JerryScript is a pure interpreter, so optimization techniques you're probably familiar with don't work. Don't expect any smart optimization from the runtime; it's not smart. Every extra operation costs you performance. It might seem scary at first, but it's not that bad because the rendering pipeline is hardware accelerated, and JS is used for the reaction on events from sensors and user input only.[^2]

Scared? Don't be. You don't need optimization if you're creating just a pet project and don't really want to sell it or anything like that. Even if you do, you can learn it pretty quickly.

## Let's Continue the Clock Creation

Everything time-related will happen within the ticking now, that means within the `clock.ontick = (evt) => { }`. I'll make a few strange moves, but don't worry. All will be explained.

First, let's grab the zeroPad() function that fitbit provides us with. It just places a zero in front of single digit numbers. That way we can get 09:05 instead of 9:5.
```javascript
function zeroPad(i) {
  if (i < 10)
    i = "0" + i;
  return i;
}
```

Next, we'll work on the clock itself. We'll need some variables to store the numeric values in... that's hours, minutes, and seconds. Let's not worry about the date just yet.

Remember that you can freely omit the seconds and change the granularity to minutes if you do not need to display seconds or execute functions at second intervals. That will give your app a tiny optimization boost. We'll be using the `Date()`[^3] object.

```javascript
clock.ontick = (evt) => {
  // We'll need the time data from the evt.date object, which is just the regular 
  // Date() object I mentioned.
  let today = evt.date;
  let hour = today.getHours();
  
  // We have the actual hour, but we still have to convert it to either 12h or 24h format
  let hours;
  
  // TODO: Convert format here

  // We'll use the zeroPad function on the minutes and seconds.
  let mins = zeroPad(today.getMinutes());
  let secs = zeroPad(today.getSeconds());

  // Finally, we can safely say that this is what our time label will look like: hh:mm
  timeLabel.text = `${hours}:${mins}`;
  
  // TODO: Date here
}
```

The format is actually pretty simple. What you'll need to do, though, is access the user's preferences. We'll need another import for that: `import { preferences } from "user-settings";`. Once you add this to the top of your file, you can access it.

```javascript
//The value will be either 12h or 24h
if(preferences.clockDisplay === "12h") {
    // 12 hour format can not go beyond 12, modulo by 12 will do the job. If it's 0 (24, 
    // we just use 12)
    hours = hour % 12 || 12;
    hours = zeroPad(hours);
    
    // I like to keep my AM/PM as a separate label, this is completely up to you to 
    // decide
    timeIndicator.text = ( hour >= 12 ) ? 'PM' : 'AM';
    timeIndicator.style.display = "inline";
} else {
    // No change needed in the 24 hour format
    hours = zeroPad(hour);
    
    // But we don't really need the AM/PM, so we can hide it
    timeIndicator.style.display = "none";
}
```

## What About the Date?

Well, you can do it the same way you do the clock thing... but I do it this way. Place a `previousDay` variable outside the clocks ticking `let previousDay = 8;`.

Next, within the ticking, we'll check if the date on the tick is the same as the previous tick. Why are we doing this? Well, it's undoubtedly more efficient to do a single check than get all items such as date, day, labels, updating labels every second. Besides, you actually separate your code a bit this way, which is always lovely.

```javascript
if(previousDay !== today.getDay())
    updateDate(today, previousDay);
```

I do not recommend using functions for everything, though, as we're still working with JerryScript for smart devices. It would just use resources for the extra call. Back to the issue at hand... since we've already got everything we need, we can just pop in the rest... the date displaying function.

```javascript
function updateDate(today, previousDayNumber) {
    // There is no native way to display days in text, we have to make our own
    const dayNames = ["su", "mo", "tu", "we", "th", "fr", "sa"];

    const dateLabel = document.getElementById('timeLabel');
    
    // As this function is executed only once a day, we can afford all of this even in an 
    // unoptimized form... not like there's many things we could do to improve this.    
    let dayNumber = today.getDay();
    let dayOfWeek = dayNames[dayNumber];
    let dayOfMonth = zeroPad(today.getDate());
    let month = zeroPad(today.getMonth()+1);
    let year = today.getFullYear();
    
    // This will be the displayed date
    dateLabel.text = `${dayOfWeek} ${year}-${month}-${dayOfMonth}`;
    
    // Make sure to update the day; otherwise, you'll just be running this function every 
    // tick and it will have missed its purpose
    previousDay = dayNumber;
    
    // We can always unset the variables manually
    dayNumber, dayOfWeek, dayOfMonth, month, year = null;
}
```

And there we go. Our app has a clock and a date, as well as the day of the week.

[^1]: Fitbit LLC. (n.d.). *Clock API*. Fitbit Developer. Retrieved August 21, 2021, from https://dev.fitbit.com/build/reference/device-api/clock/#interface-clock
[^2]: Balin, V. (2018, June 11). *FitbitOS JavaScript Optimization Guidelines*. GitHub. https://github.com/gaperton/ionic-views/blob/master/docs/optimization-guidelines.md
[^3]: Mozilla and individual contributors. (2021, July 31). *Date*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
