---
layout: main
title: 快速查表 Article
description: 所有能透過瀏覽器直接執行而無須下載或安裝軟體的工具，免費網路資源﹑免費網絡工具﹑免費線上工具﹑免費資源工具﹑免費網頁工具。
permalink: /article/
---

<main class="home" id="post" role="main" itemprop="mainContentOfPage" itemscope="itemscope" itemtype="http://schema.org/Blog">
    <div id="grid" class="row flex-grid">
        {% for post in site.posts %}
            {% if post.category == 'article' %}
                <article class="box-item" itemscope="itemscope" itemtype="http://schema.org/BlogPosting" itemprop="blogPost">
                    <span class="category">
                        <a href="{{ site.url }}{{ site.baseurl }}/category/{{ post.category }}">
                            <span>{{ post.category }}</span>
                        </a>
                    </span>
                    <div class="box-body">
                        <div class="cover">
                            {% include new-post-tag.html date=post.date %}
                            <a href="{{ post.url | prepend: site.baseurl }}" {%if isnewpost %}class="new-post"{% endif %}>
                                {% if post.image %}
                                    <img src="/assets/img/placeholder.png" data-url="{{ post.image }}" class="preload">
                                {% else %}
                                    <img src="/assets/img/placeholder.png" data-url="/assets/img/off.jpg" class="preload">
                                {% endif %}
                            </a>
                        </div>
                        <div class="box-info">
                            <meta itemprop="datePublished" content="{{ post.date | date_to_xmlschema }}">
                            <time itemprop="datePublished" datetime="{{ post.date | date_to_xmlschema }}" class="date">
                                {% include date.html date=post.date %}
                            </time>
                            <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">
                                <h2 class="post-title" itemprop="name">
                                    {{ post.title }}
                                </h2>
                            </a>
                            <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">
                                <p class="description">{{ post.introduction }}</p>
                            </a>
                            <div class="tags">
                                {% for tag in post.mintags %}
                                    <a href="{{ site.baseurl}}/tags/#{{tag | slugify }}">{{ tag }}</a>
                                {% endfor %}
                            </div>
                        </div>
                    </div>
                </article>
            {% endif %}
        {% endfor %}
    </div>
    {% include pagination.html %}
</main>
