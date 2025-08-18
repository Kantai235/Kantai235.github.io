---
title: 【PHP 設計模式】轉接器模式 Adapter Pattern
slug: adapter-pattern
description: 轉接器模式，顧名思義會在兩個同功能但不同的規格的東西中，當作中間溝通的橋樑，就有點像是健康的大頭菜因為放超過一個禮拜，直接變成壞掉的大頭菜，兩個東西都是大頭菜，但規格上可能不太一樣，這時候我們就需要一個大頭菜轉接器，直接把健康的大頭菜給轉到壞掉。
summary: "以動物森友會大頭菜為例，學習轉接器模式設計模式。允許原本因介面不相容而無法協同工作的類別能夠一起工作，透過轉接器類別包裝現有類別，提供客戶期望的介面。"

date: '2020-09-22T00:00:00+08:00'
lastmod: '2020-09-22T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 轉接器模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 轉接器模式
- PHP
- 設計模式
- 轉接器模式
---

{{< lead >}}
轉接器模式，顧名思義會在兩個同功能但不同的規格的東西中，當作中間溝通的橋樑，就有點像是健康的大頭菜因為放超過一個禮拜，直接變成壞掉的大頭菜，兩個東西都是大頭菜，但規格上可能不太一樣，這時候我們就需要一個大頭菜轉接器，直接把健康的大頭菜給轉到壞掉。
{{< /lead >}}

## 什麼是轉接器模式

### 核心概念

{{< alert "info" >}}
**轉接器模式核心概念**

轉接器模式允許原本因介面不相容而無法協同工作的類別能夠一起工作。透過建立一個轉接器類別來包裝現有的類別，並提供客戶期望的介面。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 當你想使用某個現有的類別，但其介面與你的程式碼不相容時
- 當你想建立一個可重複使用的類別，該類別可與不相關或不可預見的類別協作
- 需要在現有系統中整合第三方函式庫時
- 想要統一不同資料來源的介面時
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Adapter Pattern UML 類別圖" caption="Adapter Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立大頭菜介面

{{< alert "circle-info" >}}
**實作步驟**

首先我們需要先建立健康的大頭菜、以及壞掉的大頭菜，別忘記要建立介面(Interface)來定義大頭菜的規格。
{{< /alert >}}

#### TurnipsInterface.php

```php
/**
 * Interface TurnipsInterface.
 */
interface TurnipsInterface
{
    public function risePrice(int $price): int;

    public function fallPrice(int $price): int;

    public function getPrice(): int;

    public function setPrice(int $price): int;

    public function addCount(int $count): int;

    public function subCount(int $count): int;

    public function getCount(): int;

    public function setCount(int $count): int;

    public function calculatePrice(): int;
}
```

#### Turnips.php
```php
/**
 * Class Turnips.
 */
class Turnips implements TurnipsInterface
{
    /**
     * @var int
     */
    protected $price;

    /**
     * @var int
     */
    protected $count;

    /**
     * Turnips constructor.
     *
     * @param int $price
     * @param int $count
     */
    public function __construct(int $price, int $count)
    {
        $this->price = $price;
        $this->count = $count;
    }

    /**
     * @param int $pirce
     * 
     * @return int
     */
    public function risePrice(int $price): int
    {
        $this->price += $price;

        return $this->price;
    }

    /**
     * @param int $price
     * 
     * @return int
     */
    public function fallPrice(int $price): int
    {
        $this->price -= $price;

        return $this->price;
    }

    /**
     * @return int
     */
    public function getPrice(): int
    {
        return $this->price;
    }

    /**
     * @param int $price
     * 
     * @return int
     */
    public function setPrice(int $price): int
    {
        $this->price = $price;

        return $this->price;
    }

    /**
     * @param int $count
     * 
     * @return int
     */
    public function addCount(int $count): int
    {
        $this->count += $count;

        return $this->count;
    }

    /**
     * @param int $count
     * 
     * @return int
     */
    public function subCount(int $count): int
    {
        $this->count -= $count;

        return $this->count;
    }

    /**
     * @return int
     */
    public function getCount(): int
    {
        return $this->count;
    }

    /**
     * @param int $count
     * 
     * @return int
     */
    public function setCount(int $count): int
    {
        $this->count = $count;

        return $this->count;
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        if (isset($this->price) && isset($this->count)) {
            return $this->price * $this->count;
        } else {
            return 0;
        }
    }
}
```

### 建立壞掉的大頭菜介面

#### SpoiledInterface.php
```php
/**
 * Interface SpoiledInterface.
 */
interface SpoiledInterface
{
    public function risePrice(int $price): int;

    public function fallPrice(int $price): int;

    public function addCount(int $count): int;

    public function subCount(int $count): int;
    
    public function calculatePrice(): int;
}
```

#### Spoiled.php
```php
/**
 * Class Spoiled.
 */
class Spoiled implements SpoiledInterface
{
    /**
     * @var int
     */
    protected $price;

    /**
     * @var int
     */
    protected $count;

    /**
     * Spoiled constructor.
     *
     * @param int $price
     * @param int $count
     */
    public function __construct(int $price, int $count)
    {
        $this->price = $price;
        $this->count = $count;
    }

    /**
     * @param int $pirce
     * 
     * @return int
     */
    public function risePrice(int $price): int
    {
        $this->price += $price;

        return $this->price;
    }

    /**
     * @param int $price
     * 
     * @return int
     */
    public function fallPrice(int $price): int
    {
        $this->price -= $price;

        return $this->price;
    }

    /**
     * @param int $count
     * 
     * @return int
     */
    public function addCount(int $count): int
    {
        $this->count += $count;

        return $this->count;
    }

    /**
     * @param int $count
     * 
     * @return int
     */
    public function subCount(int $count): int
    {
        $this->count -= $count;

        return $this->count;
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        if (isset($this->price) && isset($this->count)) {
            return 0 * $this->count;
        } else {
            return 0;
        }
    }
}
```

### 建立轉接器

{{< alert "exclamation-triangle" >}}
**轉接器設計重點**

再來我們需要為健康的大頭菜以及壞掉的大頭菜製作轉接器，概念上是引用壞掉的大頭菜介面，把健康的大頭菜丟進去，讓大頭菜以壞掉的方式來運作。
{{< /alert >}}

#### TurnipsAdapter.php
```php
/**
 * Class TurnipsAdapter.
 */
class TurnipsAdapter implements SpoiledInterface
{
    /**
     * @var TurnipsInterface
     */
    protected $turnips;

    /**
     * @param TurnipsInterface $turnips
     */
    public function __construct(TurnipsInterface $turnips)
    {
        $this->turnips = $turnips;
    }

    /**
     * @param int $pirce
     * 
     * @return int
     */
    public function risePrice(int $price): int
    {
        $this->turnips->setPrice(0);

        return $this->turnips->getPrice();
    }

    /**
     * @param int $price
     * 
     * @return int
     */
    public function fallPrice(int $price): int
    {
        $this->turnips->setPrice(0);

        return $this->turnips->getPrice();
    }

    /**
     * @param int $count
     * 
     * @return int
     */
    public function addCount(int $count): int
    {
        $this->turnips->addCount($count);

        return $this->count;
    }

    /**
     * @param int $count
     * 
     * @return int
     */
    public function subCount(int $count): int
    {
        $this->turnips->subCount($count);

        return $this->turnips->getCount();
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        if (isset($this->price) && isset($this->count)) {
            return 0 * $this->count;
        } else {
            return 0;
        }
    }
}
```

## 測試

### 測試目標

寫完大頭菜轉接器以後，我們要來測試轉接器是否能夠正常使用。

{{< alert "check-circle" >}}
**測試清單**

1. **正常大頭菜測試**: 測試大頭菜是否能夠正常賦予數量及價格，並且漲價 10 鈴錢、減少 20 組，最後算出價格是否符合

2. **轉接器功能測試**: 測試大頭菜是否能夠正常賦予數量及價格，並且透過大頭菜轉接器把它轉成壞掉的大頭菜，最後漲價 10 鈴錢、減少 20 組，最後算出價格是否根本沒辦法賣鈴錢
{{< /alert >}}

### 測試程式碼

#### AdapterPatternTest.php
```php
/**
 * Class AdapterPatternTest.
 */
class AdapterPatternTest extends TestCase
{
    /**
     * 測試大頭菜是否能夠正常賦予數量及價格，並且漲價 10 鈴錢、減少 20 組，最後算出價格是否符合。
     * 
     * @test
     */
    public function test_can_rise_price_and_sub_count_on_turnips()
    {
        $turnips = new Turnips(100, 40);
        $turnips->risePrice(10);
        $turnips->subCount(20);

        $this->assertEquals(2200, $turnips->calculatePrice());
    }

    /**
     * 測試大頭菜是否能夠正常賦予數量及價格，並且透過大頭菜轉接器把它轉成壞掉的大頭菜
     * 最後漲價 10 鈴錢、減少 20 組，最後算出價格是否根本沒辦法賣鈴錢。
     * 
     * @test
     */
    public function test_can_rise_price_and_sub_count_on_spoiled()
    {
        $turnips = new Turnips(100, 40);
        $turnipsAdapter = new TurnipsAdapter($turnips);
        $turnipsAdapter->risePrice(10);
        $turnipsAdapter->subCount(20);

        $this->assertEquals(0, $turnipsAdapter->calculatePrice());
    }
}
```

### 測試結果

最後測試的執行結果會獲得如下：

```
PHPUnit Pretty Result Printer 0.28.0 by Codedungeon and contributors.
==> Configuration: ~/php-design-pattern/vendor/codedungeon/phpunit-result-printer/src/phpunit-printer.yml

PHPUnit 9.2.6 by Sebastian Bergmann and contributors.

 ==> AbstractFactoryTest        ✔  ✔  ✔  ✔  
 ==> BuilderPatternTest         ✔  ✔  
 ==> FactoryMethodTest          ✔  ✔  ✔  ✔  
 ==> PoolPatternTest            ✔  ✔  
 ==> PrototypePatternTest       ✔  ✔  
 ==> SimpleFactoryTest          ✔  ✔  ✔  ✔  
 ==> SingletonPatternTest       ✔  
 ==> StaticFactoryTest          ✔  ✔  ✔  ✔  ✔  
 ==> AdapterPatternTest         ✔  ✔  

Time: 00:00.050, Memory: 6.00 MB

OK (28 tests, 72 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 轉接器模式](https://blog.init.engineer/posts/AdapterPattern)
- [轉接器模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/AdapterPattern)
- [轉接器模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/AdapterPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
