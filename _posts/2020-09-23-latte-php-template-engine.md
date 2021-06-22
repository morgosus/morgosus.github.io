---
layout: post
title:  "Latte PHP Template Engine"
date:   2020-09-23 12:51:02 +0200
categories: programming
thumbnail: "placeholder-alpha"
thumbnail-alt: "A photo of stairs and a tree near a river."
featured: false
author: Martin Toms

published: true

---
Let's check out [Latte](https://latte.nette.org). I'll show you how I used it in my current project, a pretty clear example of how to use it.

## What is Latte?

Imagine not having to use php `<?= ?>` and `<?php ?>` tags constantly within your .php templates. Imagine the ability to use `if` and `foreach` clauses within your HTML markup, as attributes - in a way that makes them look like they belong to the same language. Imagine using milk (Latte isn't coffee in Italian, it's milk) instead of the .php/.phtml file extension. Imagine the template dealing with escaping on its own. That's Latte.

Note that Latte is used within the Nette framework. It can be used with any app through, for example, Composer.

### How does it work? What's the syntax?

Well, my understanding is this - you create a `.latte` template using the Latte syntax, Latte parses it and creates a `.php` file. This file is refreshed when you make changes to the template, so you needn't worry about having to keep running some weird build commands or manually refreshing cache.

The syntax is really simple. There are three main components to this language / engine. Tags, filters and attributes. The tags have a nigh HTML syntax, there are a few differences though. Instead of `<>`, latte uses `{}` and self closing tags simply omit the closing tag. Don't worry, there will be an example in the next section.

Filters are... parameters or modifiers of the tags, they're within tags, separated by a pipe `{tag|filter|filter2|...}`.

Finally, attributes work the same way as the HTML ones, but they start with `n:`.

.latte file doesn't need anything like `<?php` at the top of the file. It's just a plain old .html file with the latte syntax in it.

## A simple exercise

We have a PHP array `$people` filled with an unspecified number of person objects with the following structure:

```php
object(Person)
  public $name
  public object $dob
      public $year, $month, $day
  public $content
  
  //Note: Capitalize the name
  //Note: Content is some info about the person
  //Note: Don't escape $content
  //Note: Add content only if not false
```

Do a **foreach** and create a section for each of the `$people`. I'll show you both versions, I'll be using the `{foreach}` tag in latte:

```php
<?php foreach ($people as $person): ?>
    <section>
    </section>
<?php endforeach; ?>
```

```html
{foreach $people as $person}
    <section>
    </section>
{/foreach}
```

Now I'll add the **variables**, echo looks the same way in Latte,  it just contains a variable instead of a keyword:

```php
<?php foreach ($people as $person): ?>
    <section>
        <h2><?= $person->name ?> was born in the year <?= $person->dob->year ?></h2>
        <section><?= $content ?></section>
    </section>
<?php endforeach; ?>
```

```html
{foreach $people as $person}
    <section>
        <h2>{$person->name} was born in the year {$person->dob->year}</h2>
        <section>{$content}</section>
    </section>
{/foreach}
```

Some basic **escaping** in the php and deal with the '**no escaping**' clause in latte, using the `noescape` filter:

```php
<?php foreach ($people as $person): ?>
    <section>
        <h2><?= htmlspecialchars($person->name) ?> was born in the year <?= htmlspecialchars($person->dob->year) ?></h2>
        <section><?= $content ?></section>
    </section>
<?php endforeach; ?>
```

```html
{foreach $people as $person}
    <section>
        <h2>{$person->name} was born in the year {$person->dob->year}</h2>
        <section>{$content|noescape}</section>
    </section>
{/foreach}
```

I forgot to add the **if clause** and **capitalization**, let's do that now; the Latte one is just a tag with the if keyword `{if $condition}`  :)

```php
<?php foreach ($people as $person): ?>
    <section>
        <h2><?= htmlspecialchars(ucfirst($person->name)) ?> was born in the year <?= htmlspecialchars($person->dob->year) ?></h2>
        <?php if($content): ?>
            <section><?= $content ?></section>
        <?php endif;?>
    </section>
<?php endforeach; ?>
```

```html
{foreach $people as $person}
    <section>
        <h2>{$person->name|capitalize} was born in the year {$person->dob->year}</h2>
        {if $content}
            <section>{$content|noescape}</section>
        {/if}
    </section>
{/foreach}
```

I also mentioned some mysterious **attributes starting with n:**, let's add them and compare the final templates...

```php
<?php foreach ($people as $person): ?> //filename: template.php
    <section>
        <h2><?= htmlspecialchars(ucfirst($person->name)) ?> was born in the year <?= htmlspecialchars($person->dob->year) ?></h2>
        <?php if($content): ?>
            <section><?= $content ?></section>
        <?php endif;?>
    </section>
<?php endforeach; ?>
```

```html
//filename: template.latte
<section n:foreach="$people as $person">
    <h2>{$person->name|capitalize} was born in the year {$person->dob->year}</h2>
    <section n:if="$content">{$content|noescape}</section>
</section>
```

That final step really made a big difference, didn't it? Yeah! You can inline your conditions and loops within the HTML. Looks a lot like XHTML, doesn't it?

## How would we actually use the template? Installing Latte!

First we need to install Latte! That's very simple, use Composer `composer require latte/latte` or go to [GitHub](https://github.com/nette/latte/releases).

The next step really depends on the way you serve your files. I'll show you a real life example  though! Let's assume we have a simple MVC project, the view is called at the end. `$this->parameters` would be an associative array `[ 'people' => [...] ]` that contains the objects for the .php template we made a second ago. It would be extracted, that means we could use the `'people'` as `$people` within the included file after it (The `__DIR__` is within the Controller folder next to the View folder in this case). So, we're in the Controller namespace.

```php
namespace App\Controller;
```

The view is served through some function:

```php
public function view()
{
    $template = __DIR__ . '/../View/template.php';
    extract($this->parameters);
    include($template);
}
```

This would work. Time to change it up, so that it uses .latte instead. We'll be using the installed `latte/latte package`. Of course we'll use the autoloading, so we'll have this under our namespace:

```php
namespace App\Controller;
use Latte\Engine;
```

Our parameters are already in the required format for the render function! It also accepts an object.

The function itself would look like this:

```php
public function view()
{
    $template = __DIR__ . '/../View/template.latte';
    $latte = new Engine();
    $latte->render ($template, $this->parameters);
}
```

To save a little bit of resources, you may disable the cache refreshing on template change in your production app using the `$latte->setAutoRefresh(false);`.

And that's it! Now it would render .latte instead of .php files. Note that if the .latte file doesn't exist (which may be the case if you're porting a small app, it'll throw the usual `\RuntimeException.` Just a little something to watch out for.

There's a lot more that Latte can do, but I feel like this was a nice and short introduction to it.

## Summary

You know what Latte is, that it's used within Nette as its template engine, and the basics of how it works. You have a general idea of how to implement it in both an existing and new apps. You remember that you can inline keywords like `if` within the `n:` attributes. You know what a Latte tag looks like and how to use it. You understand what a .latte file looks like and that it's pretty much a nifty mix of HTML and PHP!