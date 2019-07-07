---
layout: page
title: 聯絡我 Contact
description: Let's talk.
permalink: /contact/
---

<style type="text/css" media="screen">
  .container {
    margin: 0px auto;
    max-width: 600px;
  }
</style>

<div class="container">

  <h2>Talk to us</h2>

  <div id="form" class="contact-form">
    <form accept-charset="UTF-8" method="POST" action="https://formspree.io/{{ site.email }}" v-on:submit.prevent="validateBeforeSubmit" ref="contact">
      <fieldset>
        <input type="hidden" name="_subject" value="New contact!" />
        <input type="hidden" name="_next" value="{{ site.url }}/contact/message-sent/" />
        <input type="hidden" name="_language" value="en" />
        <input type="text" name="name" placeholder="Your name" required>
        <input type="email" name="email" placeholder="Your e-mail" required>
        <textarea type="text" name="message" onkeyup="adjust_textarea(this)" placeholder="Your message" required></textarea>
        <button type="submit">送出</button>
      </fieldset>
    </form>
  </div>

</div>