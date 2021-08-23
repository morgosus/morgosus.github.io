---
title:              "Displaying Stats and Sensor Data"
date:               2021-08-22 11:34:14 +0200

categories:         programming fitbit
tags:               JavaScript SVG CSS

thumbnail:          fitbit-1
comment-section:    25

meta:
  author:           morgosus
  series:           Fitbit
  order:            3
  genre:            Programming

layout: post
---
It only makes sense to include various stats since we're working with a Fitbit device. Stats can be gathered from two primary sources - **sensors** and **user activity**. The main difference is that sensors provide a current value. At the same time, user activity is usually a sum of readings for the day/week.

From a design perspective, you only really have two options.
- **Minimal**
  - Focuses on displaying the most important stats
  - Better suited for 'looks' oriented clock faces
  - Other stats can be available by tapping the screen
- **Stats heavy**
  - Jams in as many stats as possible
  - Usually comes at a UI/UX cost

Now, we'll need another set of imports. User activity has a single import, but each sensor has its own. We'll want to display all of the stats, heart rate, and battery level. So we'll have 3 imports.

Note that the battery import is a bit special. It's the API for all battery-related operations.
{: .note}

```javascript
import { today } from "user-activity";

import { HeartRateSensor } from "heart-rate";

import { battery } from "power";
```

## Let's Do the Sensors First

For the heart rate monitor, we only need these lines, which will initialize it and mark down the changes - in real-time:

```javascript
const hrmData = document.getElementById('heart');

const hrm = new HeartRateSensor({ frequency: 1 });

hrm.addEventListener("reading", () => {
  hrmData.text = hrm.heartRate ? hrm.heartRate : "--";
});

hrm.start();
```

All sensors work kinda similarly, so the battery sensor is just this...

```javascript
battery.addEventListener("change", () => {
  // Do something with the changed value of battery
});
```

...but there's a better way to do this one. We don't really need to update the battery in real-time. It really doesn't matter if there's 37 or 38% left; besides - it's not 100% accurate. So we'll update it only when the screen turns on. Also, note that we didn't need to initialize the battery sensor. That's because it's used by the device itself for displaying the battery.

## In Comes the Display API

As you've probably guessed, there's an import for display too. We can use it to keep track of the display status and change the brightness or anything else related to it. Again, as with the battery one, it doesn't need initializing.

```javascript
import { display } from "display";

display.addEventListener("change", () => {
    
  if(display.on)
    wake();
  else
    sleep();
  
});
```

This is perfectly sufficient for our cause. The `wake()` function will fire whenever the display gets turned on, while the `sleep()` one will allow us to turn stuff off - if we desire to do so...

## Forth Cometh the BodyPresence Sensor

Power preservation. Whenever I optimize battery, I'm thinking of that Stargate: Atlantis scene from the first episode:[^1]

> GRODIN: That's not all. Look at this.  
> (He pushes a button and a shimmering force shield appears across the Stargate.)  
> SUMNER: Just like the iris on the Earth Gate.  
> McKAY (quietly but pointedly): Using power, using power, using power.  
> (Grodin finally realizes what he means and shuts the shield off.)

Let's make one thing clear, it would really suck if you turned off a sensor while the user was using it. They wouldn't notice, probably, but they also wouldn't get accurate results. So if they expect a real-time stat display, you'd better deliver it.

This is what the body presence sensor is for. It tells you if the device is on the user's wrist. Or rather if there's something in front of the heart-rate sensor, but don't worry about the details.

```javascript
import { BodyPresenceSensor } from "body-presence";

const bodyPresence = new BodyPresenceSensor();

/*bodyPresence.addEventListener("reading", () => {
    // You can use this to change the screen when the user 
    // is/isn't wearing their device
});*/

bodyPresence.start();
```

We can now use the body presence sensor variable within our `wake()` function.

```javascript
function wake() {
    
  if (bodyPresence.present)
    hrm.start();
  
  else
    bodyPresence.start();
  
}
```

Make sure to keep the `bodyPresence` sensor on even when the device isn't on the wrist. Otherwise, you will not detect when the device is "equipped" again.
{: .note}

And of course inside the `sleep()` one too. We can go a step further, add our sensors into an array and then just map the stop/start functions to that array. This is incredibly useful if you're using many sensors, such as the power costly GPS one. I'll show you what I mean using the `sleep()` function.

```javascript
const sensors = new Array(0);

sensors.push(hrm);

function sleep() {
  sensors.map(sensor => sensor.stop());
}
```

## And Now the Last Item on the Menu - Daily Stats

This is the easy part. We just need to retrieve the stats from the `user-activity` we imported earlier. For clarity, I'll repeat the import here. We also said that we'll update the battery display on-screen wake because we don't really need it in real-time.

We are going to use the `adjusted` property of `user-activity`. It means that the value displayed on the watch will be the same as the one in the mobile app. An alternative is to use the `local` value, which contains only the *locally* measured values. If you have other apps connected to your Fitbit account, that isn't counted into the `local`.

I'm omitting all the `const statNameLabel = document.getElementById('statName');`
{: .note}

```javascript
import { today } from "user-activity";
import { user } from "user-profile";

stepsTakenLabel.text = today.adjusted.steps;
activeZoneMinutesLabel.text = today.adjusted.activeZoneMinutes.total;
caloriesBurnedLabel.text = today.adjusted.calories;
distanceWalkedLabel.text = (today.adjusted.distance/1000).toFixed(2);
floorsClimbedLabel.text = today.adjusted.elevationGain;

restingHeartRateLabel.text = `${user.restingHeartRate} rbpm`;
loggedWeightLabel.text = `${user.weight} KG`;

batteryLabel.text = `${battery.chargeLevel}%`;
```

User activity contains the weekly active zone minutes, past records, and such, too. You can query the history as well if you need specific records.[^2]
{: .note}

I sneaked in and separated the `user-profile`, resting heart rate, and weight from the rest. That's because these values may not actually contain anything, and it's unusual to see them on a device. I just wanted you to know that getting these from the Fitbit app as quickly as the other stats is possible.

Finally, we'll add this bit of code into the wake() function. That way, the stats are updated every time our clock's display turns on. That way, we always see the current values.

```javascript
export function wake() {
    
  // Toggle sensors based on body presence
  if(bodyPresence.present)
    sensors.map(sensor => sensor.start());
  else
    bodyPresence.start();
  
  // Update the stats
  stats.update();
}
```

And... I guess that's it for this one.

## Summary

There are two types of stats - sensor gained and the ones within the user's activity. On top of that, some stats, such as their gender, are contained within the user profile. We can access those too. A sensor needs to be started with the `sensorVar.start()` and stopped using the `sensorVar.stop()` for battery optimization.

Displaying stats from the user activity is incredibly simple; it's just a matter of putting `today.adjusted.statName` into a `text` field.

All sensors have some event where we can watch for changes. Thus we can display the stats in real-time. However, this isn't always desired, as it may just be an unnecessary frequent battery drain. Therefore, some sensors, such as the battery one, are better accessed only when the screen is turned on.

You should now know how to
- Display any and all stats
- Detect if the device is on the wrist and act on the information
- Detect if the screen is on or off
- Display sensor values in real-time
- Display sensor values on-screen wake
- Turn on sensors when the display wakes up
- Turn off sensors when the display shuts down

[^1]: https://www.gateworld.net/atlantis/s1/rising-part-1/transcript/
[^2]: https://dev.fitbit.com/build/reference/device-api/user-activity/#interface-activityhistory