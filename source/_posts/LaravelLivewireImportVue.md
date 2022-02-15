---
cover : /img/banners/LaravelLivewireImportVue.png
title : 如何在 Laravel 上的 Livewire 當中使用 VueJS
description : 在 Laravel 當中有個讓前後端無痛溝通的技術叫做 Livewire，它可以讓你輕鬆建立起單頁應用程式，但它也有個小問題 ...
date : 2021-09-03
tags :
  - laravel
  - livewire
  - vue
category :
  - 技術文件
  - Laravel 實務
---

在 Laravel 當中有個讓前後端無痛溝通的技術叫做 [Livewire](https://laravel-livewire.com)，它可以讓你輕鬆建立起單頁應用程式(Single Page Application, SPA)，但它也有個小問題，就是如果你在 Livewire 當中使用 Vue Component 元件的話，那在 Livewire 第一次渲染時，Livewire 可以正常渲染你的 Vue 元件，但在你執行 Livewire 的搜尋、排序或分頁 Pagination 功能後，Vue 元件將會失效。

![渲染畫面](/img/posts/240984347_1132740450591658_7034226595789490304_n.jpg)
Livewire 頁面載入後，第一次渲染畫面

![搜尋結果](/img/posts/240662413_1132740637258306_3274662513731489093_n.jpg)
Livewire 執行排序後，原本的 Vue 元件將失效

這是因為 Livewire 的運作模式會改變 DOM 的結構，造成 JavaScript 的失效，而 Vue 是使用 Virtual DOM 結構，是以 JavaScript 物件模擬特定 DOM 結構而產生的樹狀結構，因此當 Livewire 運作時，Vue 的 Virtual DOM 並不會因此跟著變更，才會導致 Livewire 的元件是正常顯示的，而 Vue 元件則停止運作。

> The reason I ask is because, the way Livewire works, it breaks JavaScript libraries when Livewire changes DOM elements.
> https://github.com/livewire/livewire/discussions/1949#discussioncomment-120277

# 解決方案
目前這項問題的解決方案是使用 [Livewire VueJS Support Plugin](https://github.com/livewire/vue) 這個套件，它可以允許你在同一個頁面下使用 Livewire 並且不影響 Vue 元件的運行。

你可以透過 `CDN` 的方式去引入
```html
    ...
    @livewireScripts
    <script src="https://cdn.jsdelivr.net/gh/livewire/vue@v0.3.x/dist/livewire-vue.js"></script>
</body>
```

或者是 `NPM` 的方式去安裝套件
```sh
npm install livewire-vue --save-dev
```

最後在你的 package 當中導入它
```js
import 'livewire-vue'
// Or.
require('livewire-vue')
```

而我選擇的方式是在我的 `App.js` 當中去引用 Vue 的同時，也去引入 `livewire-vue`
```js
import Vue from 'vue';
import 'livewire-vue';

window.Vue = Vue;
```

但切記引入 `livewire-vue` 的同時，還需要去 script 當中去引入 `@livewireScripts`，並且要注意到 script 的引入順序會影響到 `livewire-vue`，如果你有其他 script 需要引入，那麼 `livewire-vue` 應該要被引入在最前面的位置，範例如下
```html
    ...
    @stack('before-scripts')
    @livewireScripts()
    <script src="{{ mix('js/manifest.js') }}"></script>
    <script src="{{ mix('js/vendor.js') }}"></script>
    <script src="{{ mix('js/frontend.js') }}"></script>
    @stack('after-scripts')
</body>
</html>
```

另外你可能會遇到 Livewire 未定義的問題
> Uncaught ReferenceError: Livewire is not defined
> Uncaught Livewire Vue Plugin: window.livewire is undefined. Make sure @livewireScripts is placed above this script include
> https://github.com/livewire/livewire/issues/2339

如果您希望 JavaScript Assets 由您的 Web 伺服器提供，而不是通過 Laravel 提供服務，請使用 `livewire:publish` 命令： 
這個問題可以透過將 JavaScript Assets 由你的 Web 伺服器提供，而不是透過 Laravel 來提供，你只需要使用 `livewire:publish` 來將 Assets 產生於 `public/verdon` 之下即可。
```sh
php artisan livewire:publish --assets
```

- [Publishing Frontend Assets](https://laravel-livewire.com/docs/2.x/installation)

不過到這邊為止，也僅能解決 Livewire 在執行搜尋、排序的情況下，不去影響 Vue 元件的運行，但分頁 Pagination 的部分依舊會導致 Vue 元件無法正常運作，在 Livewire VueJS Support Plugin 的 Issues 當中也有人提到這點，關於 Livewire 在分頁 Pagination 之後 VueJS 無法載入或執行的問題，但這項問題目前仍然沒有解決。

> https://github.com/livewire/vue/issues/26

有人提到 Livewire 與 VueJS 之間不是一個適合的搭配，如果強制在 Livewire 當中使用 Vue 元件，這有違背 Livewire 的運作模式，在這情況之下，Vue 元件的執行或 DOM Tree 方面仍然存在許多問題，對此 Livewire 本身也有推薦指定的頁面互動框架，那便是 [AlpineJS](https://laravel-livewire.com/docs/2.x/alpine-js)。

# 個人觀感
Livewire 本身模糊化了前端與後端之間的界線，會需要解決這項問題，很大一個成分是如果有前端工程師與後端工程師的情況下，雙方如何共同合作，生產出一個具有交互式的單頁應用程式，最好的情況下是前端會需要學習 AlpineJS 如何使用，這情況下會是最佳解，否則後端工程師可能會需要屈就協助撰寫，但這就會導致前後端工作分配不平均的問題，如果今天後端是選擇使用 Laravel 的話，而前端是個菜菜的 Vue 前端工程師，那專案的進展可能會很辛苦，要嘛後端扛起 Livewire + Alpine，後端兼職前端，只是這樣前端工程師就真的不曉得要拿來幹嘛了，要麻前端努力一點，去學習一下 AlpineJS 吧。
