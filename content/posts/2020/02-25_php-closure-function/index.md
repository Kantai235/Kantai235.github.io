---
title: 淺入淺出 PHP 閉包 Closure
slug: php-closure-function
description: 匿名函數(在 PHP 5.3 中被引入)會產生這個類型的對象。在過去，這個類別被認為是一個實現細節，但現在可以依賴它做一些事情。自 PHP
  5.4 起，這個類別帶有一些方法，允許在匿名函數建立後對其進行更多的控制 ...
summary: "深入了解 PHP 閉包 (Closure) 的核心概念、使用方式與實務應用。從基本語法到進階技巧，全面掌握 PHP 匿名函數的強大功能。"

date: '2020-02-25T00:00:00+08:00'
lastmod: '2020-02-25T00:00:00+08:00'
categories:
- 技術文件
- PHP 實務
tags:
- PHP
- 開發實務
- 程式設計
- 物件導向
- 閉包
- Closure
keywords:
- PHP
- 淺入淺出
- PHP
- 閉包
---

{{< lead >}}
PHP 閉包 (Closure) 是一個強大的特性，讓你能夠創建匿名函數並捕獲外部變數。本文將帶你了解 Closure 的核心概念和實務應用。
{{< /lead >}}

## 什麼是 PHP 閉包

### Closure 類別介紹

{{< alert "info" >}}
**PHP Closure 核心概念**

用於代表 `匿名函數` 的類別。
> 匿名函數(在 PHP 5.3 中被引入)會產生這個類型的對象。在過去，這個類別被認為是一個實現細節，但現在可以依賴它做一些事情。自 PHP 5.4 起，這個類別帶有一些方法，允許在匿名函數建立後對其進行更多的控制。
> 除了此處列出的方法外，還有一個 `__invoke` 方法。這是為了與其他實現了 `__invoke()` 魔術方法的對象保持一致性，但調用匿名函數的過程與它無關。
>
> - [PHP: Closure - Manual](https://www.php.net/manual/en/class.closure.php)
{{< /alert >}}

### 閉包基本概念

{{< alert "lightbulb" >}}
**理解閉包**

如果我們希望有個功能是輸出「Hello $變數」，那我們會很直覺的直接 `echo "Hello $變數"` 來解決，如果思考到重複使用的話，可能就會把這段獨立出來變成一個方法。
{{< /alert >}}

直接拿官方文件的範例來講的話，那就會像這樣：

```php
function createGreeter($who) {
    return function() use ($who) {
        echo "Hello $who";
    };
}

$greeter = createGreeter("World");
$greeter(); // Hello World
```

之後如果要重複使用的話，只要不斷 new 一個閉包，並且去執行閉包，那麼就可以做到重複使用同樣的功能。

```php
$小明 = createGreeter("小明");
$小明(); // Hello 小明

$小美 = createGreeter("小美");
$小美(); // Hello 小美

$虛空雷神獸EX = createGreeter("虛空雷神獸EX");
$虛空雷神獸EX(); // Hello 虛空雷神獸EX
```

### 閉包的優化使用

但這樣會變成要不斷建立閉包、執行閉包，所以如果要把這段程式碼精簡化的話，那麼直接在建立方法同時直接賦予到變數：

```php
$hello = function() use ($who) {
    return "Hello $who";
};

echo $hello("小明"); // Hello 小明
```

## 實務應用範例

### Laravel Eloquent Scope

{{< alert "circle-info" >}}
**實際應用場景**

接下來就來個簡單的小範例，我們在 `model` 當中寫個 `scope` 方法來提供模糊搜尋，把 `Builder` 丟進去處理模糊搜尋，最後再把 `Builder` 丟回來給我。
{{< /alert >}}

```php
/**
 * @param   \Illuminate\Database\Eloquent\Builder $query
 * @param   string  $column
 * @param   string  $value
 * @param   string  $side
 * @param   boolean $isNotLike
 * @param   boolean $isAnd
 * @return  \Illuminate\Database\Eloquent\Builder
 */
public function scopeLike(Builder $query, $column, $value, $side = 'both', $isNotLike = false, $isAnd = true)
{
    $operator = $isNotLike ? 'not like' : 'like';

    // 1. 使用閉包將字串中包含萬用字元的內容取代為常數字元。
    $escape_like_str = function ($str)
    {
        return str_replace(
            ['!', '%', '_'], 
            ['!!', '!%', '!_'],
            $str
        );
    };

    // 2. 根據模糊方式來彙整出相對應的搜尋內容
    switch ($side)
    {
        case 'none':
            $value = $escape_like_str($value);
            break;
        case 'before':
        case 'left':
            $value = "%{$escape_like_str($value)}";
            break;
        case 'after':
        case 'right':
            $value = "{$escape_like_str($value)}%";
            break;
        case 'both':
        case 'all':
        default:
            $value = "%{$escape_like_str($value)}%";
            break;
    }

    return $isAnd ? $query->where($column, $operator, $value) : $query->orWhere($column, $operator, $value);
}
```

### 使用場景總結

{{< alert "check-circle" >}}
**PHP 閉包適用場景**

- **回調函數**: 作為 `array_map`、`array_filter` 等函數的參數
- **事件監聽**: 在事件系統中定義處理邏輯
- **中間件設計**: Laravel 中間件的核心實作方式
- **資料庫查詢**: Eloquent 中的查詢條件建構
- **函數式程式設計**: 支援高階函數的程式設計模式
{{< /alert >}}
