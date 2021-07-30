---
layout: post
title:  "Python (Not the Snake)"
date:   2020-10-22 23:56:48 +0200
categories: programming
thumbnail: "/assets/thm/programming.jpg"
thumbnail-alt: "Programming"
featured: false
author: Martin Toms

published: true

---
Hiss there! Let's take a look at one of my favorite languages, which, admittedly, I don't use much lately. It's still neat. This will be, as usually, a very short article. I'll mention just the basics, just enough for a person to get to know the language. After installing Python, you may use it to interpret your code, for example in Linux: `file.py`.

Python is a general purpose language, much like many other currently popular languages. It's often used for data science, partially for its integers. You may be asking, what's so special about Pythonic (In truth, this isn't the correct way to use this word. Pythonic means using Python code the way it was intended / the right way, maintainable etc.) integers? There's no upper bound! Well.. there is, but it's your memory size, so that doesn't count.

## What's the Syntax?

Python reminds me of C, probably because it's written in C. It's like a... better version of C, I guess? One where people actually wanted a usable language. Similarly to C, you may include libraries to use. Python is a dynamically typed language, that means you don't have to bother with stating your data types. Unlike most other languages, Python doesn't use semicolons, instead it uses indentation. This improves readability, as you literally need to indent your code for it to work.

### Variables, Functions and all that jazz

Now, variables, as I mentioned, only need names. `a = 0` would create and initialize a variable, and you may use it within your code happily. Actually, if you create a variable like this within a function, you may use it later in code, even outside this very function. That's called implicit declaration. There's a multitude of generic data types available, everything from a bool to a dictionary.

I've mentioned functions, those are declared through the def word, like so: `def something(parameter, anotherParameter):`. You may then call it with `something()`

Finally, you're able to output stuff using the `print(1, "yes")` function. Print takes a string or variables and other arguments. Let's take a look at the three most common uses:

```python
a = 10

print("Hello world!")
print("Value of a is: " + a)
print(f"Value of a is: {a})
```

### Terms... No, Loops and Conditions

Python, like every other programming language (well, maybe not every, but most) has the general if, while and for available for your convenience. Now, the syntax of these is a tiny bit different. Actually, it looks a lot like the syntax you'd use while programming in Bash (Usually the default shell within Linux operating systems, located at /bin/bash). It's very minimalist and surprisingly usable.

#### Let's Take a Look at the If First..

```python
if a > b:
    print("a > b")
elif a < b:
    print("a < b")
else:
    print("Strange, isn't it?")
```

As you may have noticed, there are no parentheses required. If you think about it, they're not really needed in these cases, are they? Sure, you may say, 'but best practices,' but on the other hand.. let's be honest, this is readable. It really is.

Note the colons. Similarly to BashUsually the default shell within Linux operating systems, located at /bin/bash we're using **elif** instead of elseif or else if. It's a bit lazy, but you'll get used to it in no time.

####  Time for Loops! No Pun Intended.

Now, brace yourself. If you've never come in contact with the aforementioned Bash or similar languages, the for loop might seem a bit alien. I assure you, it's not. Let's start with the friendly while though...

```python
while a > b:
    print("a > b")
    a += 1
```

Pretty mundane, right? Now the for:

```python
for a in ["first", "second", "third"]:
    print(a)
```

Strange, isn't it? Well.. much like in Bash (sorry, I won't mention it again, I think), this iterates over a list of values. This list may be anything from arrays to a string (for what are strings, if not arrays of characters, right?). Strictly speaking, this syntax pushes the items in place of our variable 'a' up until it reaches the end of our array. You may be more comfortable with this:

```python
for a in range(3):
    print(a)
```

This would give you something similar to PHP's `for($i = 0; $i < 3; $i++) { echo $i; }`. Side note, you may use the keywords break and continue within your loops. Continue sends you back to the beginning of a loop, while break ends it prematurely. Useful when you invoke an infinite loop like `while True:`

### Extension

Let's be honest, I'm not writing a manual, just a quick overview. I mentioned most important aspects, enough for one to get the basic feel for the language. Only one part remains. How do we use some existing libraries? Well, it's simple really. I won't go into detail, you'll look it up when you need it, just know that it's possible with something like this:

```php
from nameOfModule import function1 as amazing
amazing(something)
```

That's right - you can rename the functions you import.

## Summary

You have an idea of what Python looks like. You know the very basics and understand what the differences between it and most other languages are.