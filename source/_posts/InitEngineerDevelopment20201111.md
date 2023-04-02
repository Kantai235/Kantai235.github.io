---
cover: /img/posts/InitEngineerDevelopment20201111/banner.png
title: 《純靠北開發日誌》改善文章內容的彙整
tags:
  - 開發日誌
  - 純靠北工程師
category:
  - 開發日誌
  - 純靠北工程師
abbrlink: 4c1301f5
date: 2020-11-11 00:00:00
description:
---

今天正在開發 `v4.0` 發現舊版本一個很有趣的地方，版友們會到[純靠北工程師](https://kaobei.engineer)平台上發表文章，發表文章之後會透過審核系統審核，最後發表到各大社群平台當中，但每個社群平台所能容忍的文字數量各自不同，像是 Facebook 就沒甚麼文字限制，而 Twitter 就有英文 280 字或是中文 140 字的限制，而 Plurk 則是 360 字，這個在之前發表文章的方法中就有註記這個訊息。

```php
/**
 * 注意: Plurk 的內容如果超過中英文 360 字的話，多餘的內容將會被 Plurk 自動忽略。
 */

/**
 * 注意: Twitter 的內容如果超過英文 280 字或是中文 140 字的話，多餘的內容將會被 Twitter 自動忽略。
 */
```

所以為了讓文章發表到 Facebook 的時候，文章內容可以用比較可控的方式來彙整，我寫了一個 `buildContent` 的方法，只需要把版友的文章內容丟進去，然後一些需要設定的參數丟進去，這個方法就會回傳我所想要的內文給我。

```php
/**
 * @param string $content
 * @return string
 */
public function buildContent($content = '', array $options = [])
{
    return '#純靠北工程師' . base_convert($options['id'], 10, 36) . "\n\r----------\n\r" .
        $content . "\n\r----------\n\r" .
        '🗳️ [群眾審核] ' . route('frontend.social.cards.review') . "\n\r" .
        '👉 [GitHub Repo] https://github.com/init-engineer/init.engineer' . "\n\r" .
        '📢 [匿名發文] ' . route('frontend.social.cards.create') . "\n\r" .
        '🥙 [全平台留言] ' . route('frontend.social.cards.show', ['id' => $options['id']]);
}
```

但是如果文章要發表到 Plurk 或者 Twitter 的時候，因為他們各自有文字上的限制，所以 `buildContent` 這個方法需要複製貼上到相對應的 Service 當中，稍加改變一下運作內容，需要加上內文的限制，有多餘的就要刪掉以 `...` 來代替。

```php
/**
 * @param string $content
 * @return string
 */
public function buildContent($content = '', array $options = [])
{
    $_content = (mb_strlen($content, 'utf-8') > 100) ? mb_substr($content, 0, 100, 'utf-8') . ' ...' : $content;

    return $options['image_url'] . "\n\r" .
        '#純靠北工程師' . base_convert($options['id'], 10, 36) . "\n\r----------\n\r" .
        $_content . "\n\r----------\n\r" .
        '🗳️ [群眾審核] ' . route('frontend.social.cards.review') . '?' . Str::random(4) . "\n\r" .
        '👉 [GitHub Repo] https://github.com/init-engineer/init.engineer' . '?' . Str::random(4) . "\n\r" .
        '📢 [匿名發文] ' . route('frontend.social.cards.create') . '?' . Str::random(4) . "\n\r" .
        '🥙 [全平台留言] ' . route('frontend.social.cards.show', ['id' => $options['id']]);
}
```

之前的 `buildContent` 方法可以完成我所希望達到的效果，但是它會存在於每個平台 Service 當中，而每個 Service 的 `buildContent` 皆大同小異，只有字數的功能上不太一樣，如果未來我希望安插其他內容、移除多餘的內容，那我就必須在每個 Service 都修改，這段方法耦合性太高了，因此在 `v4.0` 決定將它抽離出來，並以流暢介面(Fluent Interface)的方式去實踐。

### 延伸閱讀
- [【PHP 設計模式】流暢介面 Fluent Interface](/FluentInterface)

```php
/**
 * Class ContentFluent.
 */
class ContentFluent
{
    // Code ...
}
```

再來開始思考，如果文章內容的結構會有頭(Header)、身(Body)、尾(Footer)，頭(Header)的部分不外乎就是要處理 `#純靠北工程師{id}` 這段內容，而身(Body)的部分單純只要顯示使用者所發表的內文，但必須另外提供內容最大上限(limit)的設定，最後尾(Footer)的部分則是需要設定各種超連結，因此根據這些特性下去設計了 `header`、`body`、`footer` 這三個方法，並且去設定相對應的參數，最後回傳整個類別。

```php
/**
 * Class ContentFluent.
 */
class ContentFluent
{
    /**
     * @var int
     */
    protected int $id = 0;

    /**
     * @var string
     */
    protected string $content = 'Undefined';

    /**
     * @var int
     */
    protected int $limit = 0;

    /**
     * @var array
     */
    protected array $footerOption = [];

    /**
     * @param int $id
     *
     * @return $this
     */
    public function header(int $id = 0)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @param string $content
     * @param int    $limit
     *
     * @return $this
     */
    public function body(string $content, int $limit = 0)
    {
        $this->content = $content;
        $this->limit = $limit;

        return $this;
    }

    /**
     * @param array $option = []
     *
     * @return $this
     */
    public function footer(array $option = [])
    {
        $this->footerOption = $option;

        return $this;
    }
}
```

當內文格式設定完畢後，需要提供一個結尾獲得結果的方法，因此把彙整的邏輯寫在 `get()` 當中，開始把先前所設定的資料一個接一個的組合起來。

```php
/**
 * @return string
 */
public function get(): string
{
    $response = "#" . app_name() . base_convert($this->id, 10, 36) . "\n\r----------\n\r";
    $content = ($this->limit != 0 && mb_strlen($this->content, 'utf-8') > $this->limit) ? mb_substr($this->content, 0, $this->limit, 'utf-8') . ' ...' : $this->content;
    $response = $response . $content;

    if (isset($this->footerOption['review']) && $this->footerOption['review']) $response = $response . "🗳️ [群眾審核] " . route('frontend.social.cards.review') . "\n\r";
    if (isset($this->footerOption['github']) && $this->footerOption['github']) $response = $response . "👉 [GitHub Repo] https://github.com/init-engineer/init.engineer" . "\n\r";
    if (isset($this->footerOption['publish']) && $this->footerOption['publish']) $response = $response . "📢 [匿名發文] " . route('frontend.social.cards.create') . "\n\r";
    if (isset($this->footerOption['show']) && $this->footerOption['show']) $response = $response . "🥙 [全平台留言] " . route('frontend.social.cards.show', ['id' => $this->id]) . "\n\r";

    return $response;
}
```

最後在發表文章到社群平台時，就只需要透過 `Container` 來獲得 `ContentFluent` 類別，並且直接 `header`、`body`、`footer` 逐一設定，並直接 `get` 出來，整個程式碼都變漂亮了，也解決了耦合性的問題。

```php
$contentFluent = Container::getInstance()->make(ContentFluent::class);
$message = $contentFluent
    ->header($cards->id)
    ->body($cards->content)
    ->footer(array(
        'review' => true,
        'github' => true,
        'publish' => true,
        'show' => true,
    ))
    ->get();
```
