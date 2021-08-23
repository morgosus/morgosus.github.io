---
title:              "Recursive CTEs"
date:               2020-10-19 14:10:35 +0200

categories:         programming
tags:               SQL MariaDb

thumbnail:          mariadb

meta:
  author:           morgosus
  genre:            Programming

layout: post
---
This is just a quick explanation of the topic on a simple example. It won't deal with optimization, merely wrapping your mind around the concept. CTE (Common Table Expression) is a... hmm.. think of it as a temporary view. You bring in some set of results and then you're able to query it. Recursive CTE just adds recursion to the ploy.

Recursion is generally known concept in programming - a function calls itself. In SQL it's similar in that the CTE references itself.  There's a certain learning curve to all things recursive, so let's try to simplify it into two queries.

## Imagine the Following Structure

We'll have two tables, one for topics and another one for articles. A topic may have a parent - which would be a (:self-referencing foreign key|A foreign key created from the same table, basically the foreign key is tied to the primary key of the very table it's located in, for example an article might have a 'next' foreign key that's merely the next-in-series articles primary key within the same table:). Our articles will have an id_topic. Let's simplify it to the bare necessities:
article (id_article AI UN INT, id_topic FK UN INT, content VARCHAR)
topic (id_topic AI UN INT, parent FK UN INT, name VARCHAR)

Now, our goal is to:
1. Count the number of all nested sub-topics within a topic
2. Count the number of articles under a topic, including articles within all sub-topics

## Let's Do It

When dealing with recursion, you usually want to have a clear image of what you actually want to accomplish. In our case it's going to be some way of finding all topics with the parent id of the uppermost topic and then their children. For the second goal, it's going to be something similar, only that time we'll be looking for articles with id_topic matching those 'fetched' topics.

CTEs are created through the keyword `WITH`. It takes a name and then a command bringing in your set of data. Finally you're able to query it. Recursive CTEs use the keyword `RECURSIVE` Read the command, I'll explain it right after.

```sql
WITH RECURSIVE topicsUnderTopic AS (
    SELECT * FROM topic WHERE parent = 1
    UNION
    SELECT children.* FROM topic AS children,
    topicsUnderTopic AS thisWholeThing
    WHERE children.parent = thisWholeThing.id_topic
) SELECT COUNT(*) AS subCount FROM topicsUnderTopic;
```

On the first line I defined the recursive CTE, I gave it a fitting name and continued. The starting query brings in all direct sub-topics of the topic with id_topic = 1. You could also use WHERE parent IS NULL if you wanted to count the top level topics. For prepared statements in PHP or anything similar like that you'd replace the 1 with a ? or other relevant way of marking the prepared statements, but let's get back to the topic at hand. On the next line we're creating a union. Union merely connects multiple results of SELECTs into one set of results. It's a merge of sorts.

Now, this is where the query gets interesting. We don't just want the direct sub-topics, we want their sub topics too and all of theirs too! That's where the `WHERE children.parent = thisWholeThing.id_topic` comes in. This is the reference to self, as you may notice, topicsUnderTopic is the name of our recursive CTE - and it's within the `AS thisWholeThing` part `AS` well, pun intended.

The last part of our query, the last line, is where we use the CTE results. We're able to use it as (more or less) a regular table.

### Let's Modify the Query

We'll take the same approach, the general idea is to grab the topics as well and then just match their ids to the id_topic of articles:

```sql
WITH RECURSIVE articlesUnderTopic AS (
    SELECT * FROM topic WHERE id_topic = ?
    UNION
    SELECT children.* FROM topic AS children,
    articlesUnderTopic AS thisWholeThing
    WHERE children.parent = thisWholeThing.id_topic
) SELECT COUNT(*) AS articleCount
  FROM article
  WHERE id_topic IN (SELECT id_topic FROM articlesUnderTopic);
```

## Summary

You know what a CTE is, as well as a recursive one. You have a general idea of how to use them. While I'm sure these queries could be optimized and improved, the goal wasn't an überquery, merely an example that might just help you wrap your mind around recursion in SQL.