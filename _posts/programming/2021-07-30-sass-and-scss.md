---
title:              "SASS and SCSS"
date:               2021-07-30 15:45:37 +0200

categories:         programming
tags:               SASS CSS

thumbnail:          programming-1

meta:
  author:           morgosus
  genre:            Programming

redirect_from: /programming/sass-and-scss

layout: post
---
SASS is the ideal preprocessor for CSS. It's a sort of syntax enhancer for it. SASS needs to be compiled into CSS, the 
advantage of this is the fact that you can use SASS and SCSS (or even a combination of both, for example if you wanted 
to include an existing SCSS stylesheet within a new SASS application) within a SASS master file. Keep in mind that an 
invalid stylesheet will not compile.

You can also set up a file watcher that will compile your code for you every time you save the file and
profit. Most IDEs will allow you to do so along with attributes. You can also pass the `--style compressed` argument
or its variant to most compilers, resulting in having your code auto-compiled and auto-minified.

Some technologies come with built-in SASS support, an example would be the Jekyll static site generator.

## SASS vs SCSS
The only real difference between these two preprocessors is the syntax. SCSS is more native, using brackets `{ }` and 
semicolons `;`. The advantage of SCSS is the fact that indentation doesn't matter. Hence, in SCSS, these classes are 
the same:

```scss
//SCSS
* {
  box-sizing: border-box;
  
  body {
    font-family: monospace;
  }
}

//SCSS
* { box-sizing: border-box; body { font-family: monospace; }}
```

SASS on the other hand uses python-like indentation instead of brackets and semicolons. You don't really need them 
if your code is properly indented and styled. In my opinion it improves code readability a lot. It also reduces the 
code size, but that's insignificant, as the final stylesheet is still compiled to CSS, which contains both brackets and 
semicolons. The disadvantage of this is that a single error in your indentation will have a semantic destructive effect

```sass
//Parent and a Child
.parent
  box-sizing: border-box
  .child
    font-family: monospace
    
//Siblings
.parent
  box-sizing: border-box
.child
  font-family: monospace
```

Note that both allow you to use single line comments `// comment` and nesting.


## Ampersand nesting

To further improve nesting, you may refer to an element with the `&` symbol:

```sass
.clickMe
  background-color: cornflowerblue
  &:hover
    background-color: royalblue
```

This is an ideal mix with the BEM (Block Element Modifier) methodology:
```sass
.post
  &--aside //.post--aside
  &__heading //.post__heading
  &__content //.post__content
    &-item //.post__content-item
    p //.post__content p
```

## Importing
SASS allows you to split your code into multiple files, to import a SASS file and append or prepend it to your code, 
you can use the `@import "/path/to/file"` tag. You may omit the extension or keep it. both `"/path/to/file.sass"` and
`"/path/to/file` will work. You may use both .scss and .sass within your stylesheets, as long as they're valid.

```sass
*
  box-sizing: border-box

@import "component/font.sass"

@import "minima/_syntax-highlighting.scss"

@import "component/header.sass"
@import "component/footer.sass"
```

## Variables
Let's face it, variables are useful and CSS ones where you declare `--name:` value within some weird `:root` element just doesn't 
cut it, especially if you have to use `var(--name);` every time you wish to use it.
```sass
$site-width: 1024px
$font-family: "monofonto", monospace
$font-size: 18px
$background-color: white

body
  width: $site-width
  background-color: $background-color
  font-family: $font-family
  font-size: $font-size
```

## Loops

SASS is capable of utilizing loops. Sometimes you arrive at a problem that is easily solved or requires multiple 
classes, which differ only in percentages or numbers, but there's a clear loop relation to it. I'll give you an 
example.

Recently I felt the need to use a loop in my travel portfolio app. It has a gallery component that needed some way of 
making images' width in rows depend on the class assigned to it and its number. Let's say an image in a row that 
contains 5 images would have a width of 20%, an image in a row with 3 would have a 100%/3 width and so on. I also want 
an 0.5% spacing between the items. Loops make this really easy without having to write out the classes by hand, and 
they work pretty much the same way they do in any other language:

```sass
&__row
  display: flex
  justify-content: space-between
  
  @for $i from 1 through 10
    &--#{$i} /* ( 100 - 0.5 * n - 1) / n; where 0.5 = spacing in % */
      .image, .video
        $w: ((100% - 0.5% * ($i - 1))/$i)
        max-width: $w
```

Now, it might look complex, but it really isn't. I want 10 classes that looks like this for each number 
starting from 1 and leading up to 10 (these are the classes for the numbers 3 and 4):

```css
/* A row containing 5 pieces of media (images or videos) */
.row--3 .image, .row--3 .video {
  /* factors in the four 0.5% width spaces */
  max-width: 32.6666666667%;
}

.row--4 .image, .row--4 .video {
    /* factors in the three 0.5% width spaces */
    max-width: 24.625%;
}
```

Now, let check the same piece of code in SASS for clarity:

```sass
.row
  &--3
    .image, .video
      max-width: 32.6666666667%
  &--4
    .image, .video
      max-width: 24.625%
```

And finally using the equation and variable for readability:

```sass
.row
  &--3
    .image, .video
      //3 items have 3 spaces between them
      $w: ((100% - 0.5% * (2))/3)
      max-width: $w
  &--4
    .image, .video
      //4 items have 3 spaces between them
      $w: ((100% - 0.5% * (3))/4)
      max-width: $w
```

Clearly there's an `n-1` relation in the spaces and a subtracting `spaces * spacing / number of items` relation in the 
width itself. That's where the `( (100% - 0.5% * ($i - 1 ) ) / $i )` width equation comes from. The $i is the number 
of items, which is within the classname, so `.row &--$i`.

## Mixins
Finally, you can use mixins, embedding a piece of code within another. Let's say you have a lot of stretching elements 
and constantly repeat width: 100% and height: 100%... you can just do this:

```sass
$f: 100%

@mixin stretch //full width and height
  width: $f
  height: $f
  
@for $i from 1 through 10
    &--#{$i} /* ( 100 - 0.5 * n - 1) / n; where 0.5 = spacing in % */
      include @stretch
      .image, .video
        $w: (($f - 0.5% * ($i - 1))/$i)
        max-width: $w
```


## Summary
You should be able to write and understand SASS code now. Once you get used to the syntax, it's really much easier to 
design anything.