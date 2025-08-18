---
title: 【PHP 設計模式】物件池模式 Pool Pattern
slug: pool-pattern
description: 物件池模式，每次的買賣都是致富的關鍵，致富不能只靠 40 顆大頭菜，靠的是放滿整座島的大頭菜，因此你需要有個島專門放大頭菜，放得滿滿的，到了關鍵時刻再把大頭菜拿出來賣。
summary: "以動物森友會大頭菜為例，學習物件池模式設計模式。透過重複使用現有物件來提升效能，減少頻繁建立和銷毀物件的成本，適用於產生成本高昂的物件。"

date: '2020-09-21T00:00:00+08:00'
lastmod: '2020-09-21T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 建立型
- 物件池模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
---

{{< lead >}}
物件池模式，每次的買賣都是致富的關鍵，致富不能只靠 40 顆大頭菜，靠的是放滿整座島的大頭菜，因此你需要有個島專門放大頭菜，放得滿滿的，到了關鍵時刻再把大頭菜拿出來賣。
{{< /lead >}}

## 什麼是物件池模式

### 核心概念

{{< alert "info" >}}
**物件池模式核心概念**

物件池模式透過重複使用現有物件來提升效能。當物件的建立成本高昂時，並且在特定時刻需要大量類似物件時，物件池可以提供显著的效能優勢。
{{< /alert >}}

### 適用情境

{{< alert "lightbulb" >}}
**使用時機**

- 物件的建立成本高昂（如資料庫連線）
- 需要大量類似的物件
- 系統效能受到物件建立和銷毀的影響
- 物件具有明確的生命週期
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Pool Pattern UML 類別圖" caption="Pool Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立物件類別

{{< alert "circle-info" >}}
**實作步驟**

首先我們會需要把大頭菜定義出來，並且賦予幾些簡單的功能。
{{< /alert >}}

#### Turnips.php
```php
/**
 * Class Turnips.
 */
class Turnips
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

### 建立物件池

{{< alert "circle-info" >}}
**物件池設計**

再來我們要做一個大頭菜池，而且要挖深，挖深呢，好處是有利於儲大頭菜，未來還可以養大頭菜，然後就可以把大頭菜通通丟進去。
{{< /alert >}}

#### TurnipsPool.php
```php
use Countable;

/**
 * Class TurnipsPool.
 */
class TurnipsPool implements Countable
{
    /**
     * @var Turnips[]
     */
    protected $pool = [];

    /**
     * @var int
     */
    protected $total = 0;

    /**
     * @return Turnips
     */
    public function get(string $key = null): Turnips
    {
        if (isset($key)) {
            $turnips = $this->pool[$key];
            unset($this->pool[$key]);
        } else {
            $turnips = array_pop($this->pool);
        }

        $this->total -= $turnips->calculatePrice();

        return $turnips;
    }

    /**
     * 把大頭菜塞到池子裡
     *
     * @param Turnips $turnips
     * 
     * @return string
     */
    public function set(Turnips $turnips): string
    {
        $key = spl_object_hash($turnips);
        $this->total += $turnips->calculatePrice();
        $this->pool[$key] = $turnips;

        return $key;
    }

    /**
     * @return int
     */
    public function total(): int
    {
        return $this->total;
    }

    /**
     * @return int
     */
    public function count(): int
    {
        return count($this->pool);
    }
}
```

## 額外補充

### Countable 介面

{{< alert "info" >}}
**PHP Countable 介面**

繼承 `Countable` 這個類別可以使用 `count()` 這個方法，因此需要實作它。

```php
class Countable {
    /* Methods */
    abstract public count ( void ) : int
}
```

**官方文件**: [PHP: Countable - Manual](https://www.php.net/manual/en/class.countable.php)
{{< /alert >}}

## 測試

### 測試目標

最後為了測試我們挖很深的大頭菜池是否能夠養大頭菜，所以我們有兩組測試要做：

{{< alert "check-circle" >}}
**測試清單**

1. **基本放取測試**: 測試是否能夠正常的新增 10 組大頭菜，並且把大頭菜拿出 2 組後，檢查池子裡面是否剩下 8 組大頭菜，然後比較一下拿出來的這 2 組是不是兩個不同的大頭菜，最後比較一下大頭菜池子裡的大頭菜價格是不是正確的

2. **重複使用測試**: 測試是否能夠正常的新增 10 組大頭菜，並且把大頭菜拿出 1 組後，馬上把大頭菜丟回去池子裡，再從池子裡拿出 1 組大頭菜，檢查池子裡面是否剩下 9 組大頭菜，然後比較一下最後拿出來的這組，是不是就是一開始拿出來的那組大頭菜
{{< /alert >}}

### 測試程式碼

#### PoolPatternTest.php
```php
/**
 * Class PoolPatternTest.
 */
class PoolPatternTest extends TestCase
{
    /**
     * 測試是否能夠正常的新增 10 組大頭菜，
     * 並且把大頭菜拿出 2 組後，檢查池子裡面是否剩下 8 組大頭菜，
     * 然後比較一下拿出來的這 2 組是不是兩個不同的大頭菜，
     * 最後比較一下大頭菜池子裡的大頭菜價格是不是正確的。
     * 
     * @test
     */
    public function test_can_set_new_turnips_and_get()
    {
        $pool = new TurnipsPool();
        for ($i = 0; $i < 10; $i++) {
            $turnips = new Turnips(100, 40);
            $pool->set($turnips);
        }

        $turnips1 = $pool->get();
        $turnips2 = $pool->get();

        $this->assertCount(8, $pool);
        $this->assertNotSame($turnips1, $turnips2);
        $this->assertEquals(32000, $pool->total());
    }

    /** 
     * 測試是否能夠正常的新增 10 組大頭菜，
     * 並且把大頭菜拿出 1 組後，馬上把大頭菜丟回去池子裡，
     * 再從池子裡拿出 1 組大頭菜，
     * 檢查池子裡面是否剩下 9 組大頭菜，
     * 然後比較一下最後拿出來的這組，是不是就是一開始拿出來的那組大頭菜，
     * 最後比較一下大頭菜池子裡的大頭菜價格是不是正確的。
     * 
     * @test
     */
    public function test_can_get_turnips_twice_when_set_it_first()
    {
        $pool = new TurnipsPool();
        for ($i = 0; $i < 10; $i++) {
            $turnips = new Turnips(100, 40);
            $pool->set($turnips);
        }

        $turnips1 = $pool->get();
        $pool->set($turnips1);

        $turnips2 = $pool->get();

        $this->assertCount(9, $pool);
        $this->assertSame($turnips1, $turnips2);
        $this->assertEquals(36000, $pool->total());
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

Time: 00:00.050, Memory: 6.00 MB

OK (24 tests, 68 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 物件池模式](https://blog.init.engineer/posts/PoolPattern)
- [物件池模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Creational/PoolPattern)
- [物件池模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Creational/PoolPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
