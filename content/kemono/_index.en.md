---
title: "Heyo! I'm 乾太(Kantai) 🦊"
layout: "simple"
---

{{< alert icon="fire" cardColor="#e63946" iconColor="#1d3557" textColor="#f1faee" >}}
Pardon my English, I rely on a translator. 🥺
{{< /alert >}}

{{< lead >}}
Taiwan furry, Tainan furry, chonky, homebody, a bit denpa!

Born in Tainan, living in Tainan, thriving in Tainan, loving Tainan — proud **Tainaner**!

I’m a software engineer who jokingly calls himself the team’s janitor. I occasionally write a little code.

Furries are great, beast-boys are awesome, and **chonky beast-boys** absolutely melt my heart!

I’m naturally shy with a small social battery; once it’s empty I go quiet and passive.

Still, please keep talking to me—I’ll be happy the whole time (⁎˃ᴗ˂)و

Sometimes I reply slowly: I might be cooking, sleeping, riding my scooter, or running simulations in my head to find “the most fitting reply.”

Interaction logic: the closer we are, the more blunt I get; the less I like someone, the more politely I act. I try not to show dislike.

I love **coffee, matcha, and ramen**, and I’m a fan of single-player, story-driven games.

I like going out but not leaving home—door-to-door pickup instantly adds +100 points.

I don’t think I’m good at coding, so my professional advice is usually just: “I don’t know.”

**Feel free to poke and follow**, or just [ping me on Telegram](https://t.me/KantaiDeveloper).

If you want to be friends, let’s warm up slowly 👉👈
{{< /lead >}}

{{< kemono-setup >}}
{{< kemono-interface >}}

<div class="kemono-container">
  <!-- Background container (supports video and image) -->
  <div id="background-after" class="kemono-background active">
    <video id="background-video-after" autoplay muted loop playsinline class="nozoom mt-0 mr-0 mb-0 ml-0 h-[1000px] w-full object-cover" style="display: none;">
      <source type="video/mp4">
    </video>
    <img id="background-img-after" alt="Current Fursona" class="nozoom mt-0 mr-0 mb-0 ml-0 h-[1000px] w-full object-cover" style="display: none;">
  </div>
  <div id="background-before" class="kemono-background">
    <video id="background-video-before" autoplay muted loop playsinline class="nozoom mt-0 mr-0 mb-0 ml-0 h-[1000px] w-full object-cover" style="display: none;">
      <source type="video/mp4">
    </video>
    <img id="background-img-before" alt="Previous Fursona" class="nozoom mt-0 mr-0 mb-0 ml-0 h-[1000px] w-full object-cover" style="display: none;">
  </div>
  <div id="background-fursuit" class="kemono-background">
    <video id="background-video-fursuit" autoplay muted loop playsinline class="nozoom mt-0 mr-0 mb-0 ml-0 h-[1000px] w-full object-cover" style="display: none;">
      <source type="video/mp4">
    </video>
    <img id="background-img-fursuit" alt="Partial Fursuit" class="nozoom mt-0 mr-0 mb-0 ml-0 h-[1000px] w-full object-cover" style="display: none;">
  </div>

  <!-- Tab 切換按鈕 -->
  <div class="kemono-tabs">
    <button class="kemono-tab active" data-tab="after">Current Fursona</button>
    <button class="kemono-tab" data-tab="before">Previous Fursona</button>
    <button class="kemono-tab" data-tab="fursuit">Partial Fursuit</button>
  </div>

  <!-- Tab 內容 -->
  <div id="tab-after" class="kemono-tab-content active">
    <div class="p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg background-white/90 dark:background-gray-800/90 backdrop-blur">
      <div class="flex flex-col md:flex-row gap-8 mb-6">
        {{< artwork-gallery collection="kemono.after.gallery" class="mt-0 mb-0 rounded-lg shadow-lg" >}}
      </div>
      {{< artwork-gallery collection="kemono.after.artworks" class="grid-w50 md:grid-w33 xl:grid-w25 rounded-lg shadow-lg" >}}
    </div>
  </div>

  <div id="tab-before" class="kemono-tab-content">
    <div class="p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg background-white/90 dark:background-gray-800/90 backdrop-blur">
      <div class="flex flex-col md:flex-row gap-8 mb-6">
        {{< artwork-gallery collection="kemono.before.gallery" class="mt-0 mb-0 rounded-lg shadow-lg" >}}
      </div>
      {{< artwork-gallery collection="kemono.before.artworks" class="grid-w50 md:grid-w33 xl:grid-w25 rounded-lg shadow-lg" >}}
    </div>
  </div>

  <div id="tab-fursuit" class="kemono-tab-content">
    <div class="p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg background-white/90 dark:background-gray-800/90 backdrop-blur">
      {{< artwork-gallery collection="kemono.fursuit.artworks" class="grid-w50 md:grid-w33 xl:grid-w25 rounded-lg shadow-lg" >}}
    </div>
  </div>
</div>

## Sticker Collection 🎨

{{< sticker-gallery >}}

## Favorites ☕🍵🍜🎮

### Drinks ☕🍵
- **Coffee**: Black coffee or a latte. No creamer, no sugar.
- **Matcha**: I'm a big fan of the "Isuzu" blend from Marukyu Koyamaen in Uji.

### Ramen Shortlist 🍜
- **Tainan | Horai-ken**: Super Rich "Mega Ton" Ramen, Tonkotsu Gyokai Tsukemen (pork & fish dipping noodles).
- **Tainan | Ore-ni Ramen**: Special Rich Pork, Chicken & Fish Tsukemen.
- **Kaohsiung | Menya Sho**: Special SP Rich Soup Ramen, Chashu Rice Bowl.
- **Kyoto | Kaidashi-men Kitada**: Hamaguri Ramen (clam broth ramen).

### Games 🎮
- **PS5 Pro**: Death Stranding, Ghost of Tsushima, Astro's Playroom, Elden Ring, Sekiro: Shadows Die Twice.
- **NS2**: The Legend of Zelda series, Hollow Knight, Pokémon series.
- **PC**: Final Fantasy XIV
- **Mobile Games**: Pokémon TCG Pocket, XXL Woofia, Persona 5: The Phantom X.

## Going-Out Threshold 🚶‍♂️➡️🏠
- If fare > 100 or ride > 30 min, I’m likely to stay home
- But love beats all! I’ll still hop the HSR to Taipei for the 2025 Cultural Expo (zoom)

## How I Interact 💬
- I love when people start the conversation; if you keep coming, I keep smiling ✧
- Want to be friends? Let’s follow each other first and get close step by step 👉👈
- I sometimes chat with Zhuyin, kaomoji, emoji, and stickers
- The closer we get, the blunter I am; the more I dislike someone, the more polite I act
- I dislike noise—ANC headphones are my default for peace and quiet
- For “pro” questions, it’s often just “I don’t know,” but I’ll cheer you on!

## Contact & Hangout

Feel free to say hi or hit me up! ฅ^•ﻌ•^ฅ

Email: kantai.developer@gmail.com

{{< social-links mainTitle="Mainly on" othersTitle="Others" >}}
