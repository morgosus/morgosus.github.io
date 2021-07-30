---
layout: post
title:  "How to Flex a Box"
date:   2020-10-19 20:00:15 +0200
categories: programming
thumbnail: "/assets/thm/flex.jpg"
thumbnail-alt: "Flex"
featured: false
author: Martin Toms

published: true

---
Quite a few people have told me that they have no experience with Flexbox, yet they deal with CSS and HTML layouts. It's usually a matter of minutes to explain this particular topic and many people are in awe of how simple, yet efficient this tool is. Flexbox, as you may have already deduced, is a CSS... I guess we could say library.

The gist is simple - if you need a layout that follows an axis, either x or y, Flexbox is your.. guy? While flexbox can be used to style both directions, kinda, it's primarily about styling only one direction at a time.

## Consider This

Most websites these days follow the basic structure of Header - Main - Footer in one way or another. These elements are usually under each other, they form a COLUMN. Now, if the website is a blog, it usually contains some form of a two column layout in a ROW on the homepage. Let's pretend semantic tags aren't a thing for a second and remember the good old days.

```html
<div class="row">
    <div class="left-column">New posts</div>
    <div class="right-column">Social, call to action, ...</div>
</div>
```

In the past, you'd usually go for `float: left;` and `float: right;` or some form of `display: inline-block;` and then you'd deal with making it look perfect, removing font-size of the parent to deal with any white space or adding comments for that, etc. Nowadays, a - in my opinion - better way to style these exists. Sure, there's compatibility with browsers to consider, but, let's be honest - most browsers are capable of utilizing Flexbox at least to the basic degree at this point.

You may be thinking, what's styling a row and a column good for, Martin? Well, if you think about it, most websites are just collections of rows and columns. The page layout itself is a column, articles? Column. Headers and footers? Rows. Once you get used to Flexbox, you'll probably see these two elements everywhere.

## So, How Do You Actually Use It?

Very easily. Now, remember this - when you're using Flexbox, you're actually styling the elements inside of some wrapper (parent element). This will help you to understand where the properties should go quicker. I like to call it a wrapper, however it's really a flex container. Force of habit, excuse it.

The entire thing stands on top of two main properties. Display and flex-direction. There are two main displays, that's `display: flex;` and `display: inline-flex;`. Flex is the equivalent of a block element, while inline-flex is an inline-block-like one. Both are able to use other Flexbox properties.

The second main property, flex-direction, merely states which direction elements within your wrapper should line up in. The available values are `row` and `column`. There are also `row-revese` and a similar reversed column which merely change the element direction from left->right to right->left or top->bottom to bottom->top, however, for accessibility reasons, I don't use them. While it looks the way you want it to, the html structure doesn't reflect this - while your HTML would go 123, your reverse row would show as 321. For that reason I'm not even going to go into `order: x;` You are, of course, welcome to use them if you wish to.

### Imagine a Simple Page Like This

```html
<body>
    <header class="header">
        <a class="main__link" href="#">Home</a>
        <a class="main__link" href="#">About</a>
        <a class="main__link" href="#">Gallery</a>
        <a class="main__link" href="#">Contact</a>
    </header>

    <main class="main">Content goes here</main>

    <footer class="footer">
        <span>© 2020 Martin Toms</span>
    </footer>
</body>
```

I'll demonstrate the basics of Flexbox on this page. The first thing we'll want is to add make the entire body into a flex column. Our header, main and footer will correctly align that way. We'll also want to make sure our body is full height... but more about that later.

```css
html, body {
    height: 100%
}

body {
    display: flex;
    flex-direction: column;
}
```

Next on the list would be the header. Our header will be a simple row of links. Let's SPACE them out EVENly along the width of the header.

```css
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
}
```

We could do a text-align: center for the footer, or we could do the same...

```css
.header, .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
}
```

And finally, the footer should be on the bottom of the page - and the main should take up the entire page, not counting the header and footer space. As its parent, the body element, is a flex: column, as well as height: 100%, we can use the FLEX-GROW property for this. Flex grow allows the element to take up the remaining space within its parent element (wrapper.) The opposite would be flex-shirnk.

```css
.main {
    flex-grow: 1;
}
```

We have a working basic layout - the links within our header and spread out nicely, content takes up all free space on the page and our footer will fit to the bottom of the page correctly, meaning it will be pushed further down if main requires more space.

I've used a bunch of properties. Let me explain the justify-content further. Justify content works with the available space. You're able to use a value of space-evenly, space-between or space-around. These differ in how the free space outside of your elements is laid out. They're pretty self-explanitory.

There's a whole lot more properites available to use, let me name a few of them - while justify-content aligns your content along the current direction, align-items (given to the wrapper) / align-self (given to the child) allows you to vertically or horizontally align your elements within the 'opposite' direction. What I mean is that in a row, it'll work vertically and it'll align horizontally in a column. Typically you'd be using center. You can also use flex-start or flex-end values.

Another important feature is the flex-wrap. This neat property allows you to have multiple 'rows' of elements. Let's say you want 5 rows of articles, each should have 3. If the articles are wide enough so that only 3 fit on a line, `flex-wrap: wrap` would (the opposite would be `flex-wrap: nowrap`) make it so that your 15 elements break into 5 lines.

Speaking of width. That's flex-basis. Think of flex-basis as a sort of combination of width, max-width and min-width. It's more or less the ideal width this element should take up. The remaining free space is pretty much anything outside of flex basis. Setting flex-basis to 30% will allow your elements to grow beyond it, but also ensure that they get their 30%, assuming there's enough space and rules to support that.

There's a bunch of shorthands, like the flex: or flex-flow:, but I'm not writing a textbook, so I'll leave those out.

## Summary

You should be able to use flexbox to style any layout that follow the row / column philosophy. You'll remember that you may put columns into rows or rows into columns. You know how to align items within a flex container, as well as how to position these elements using flexbox.