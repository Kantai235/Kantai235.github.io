---
title: 【PHP 設計模式】享元模式 Flyweight Pattern
slug: flyweight-pattern
description: 享元模式，在定義上來說是共享物件，將相似的物件集中整理，減少記憶體上的使用，舉例來說每座島的大頭菜鈴錢價格都不同，有些朋友會送你大頭菜，但因為朋友太多了，所以需要有個地方集中放這些大頭菜，並且記錄起來，每個朋友都送你一組大頭彩，但你不能重複紀錄，不然你只收到一組大頭菜，帳上卻紀錄兩組，這樣就不好了。
summary: "以動物森友會大頭菜為例，學習享元模式設計模式。通過共享細粒度物件來有效地支援大量物件，減少記憶體使用量，提高系統性能和資源利用率。"

date: '2020-09-30T00:00:00+08:00'
lastmod: '2020-09-30T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 享元模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 享元模式
- PHP
- 設計模式
- 享元模式
---

{{< lead >}}
享元模式，在定義上來說是共享物件，將相似的物件集中整理，減少記憶體上的使用，舉例來說每座島的大頭菜鈴錢價格都不同，有些朋友會送你大頭菜，但因為朋友太多了，所以需要有個地方集中放這些大頭菜，並且記錄起來，每個朋友都送你一組大頭彩，但你不能重複紀錄，不然你只收到一組大頭菜，帳上卻紀錄兩組，這樣就不好了。
{{< /lead >}}

## 什麼是享元模式

### 核心概念

{{< alert "info" >}}
**享元模式核心概念**

享元模式通過共享細粒度物件來有效地支援大量物件。它將物件的狀態分為內在狀態（可以共享）和外在狀態（不可共享），通過享元工廠來管理和重用物件實例，從而減少記憶體使用量。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 應用程式需要產生大量的物件
- 物件的大部分狀態都可以變為外在狀態
- 如果刪除物件的外在狀態，那麼可以用相對較少的共享物件取代很多組物件
- 應用程式不依賴於物件識別
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Flyweight Pattern UML 類別圖" caption="Flyweight Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 定義享元介面（Flyweight Interface）

{{< alert "circle-info" >}}
**享元介面設計**

首先我們須要先定義享元介面，這個介面定義了所有享元物件必須實作的方法。在我們的大頭菜例子中，享元物件需要提供計算價格的功能。
{{< /alert >}}

#### FlyweightInterface.php
```php
/**
 * Interface FlyweightInterface.
 */
interface FlyweightInterface
{
    /**
     * @return int
     */
    public function calculatePrice(): int;
}
```

### 實作具體享元（Concrete Flyweight）

{{< alert "circle-info" >}}
**具體享元設計**

這是享元模式的核心類別，它實作了享元介面並儲存內在狀態。在我們的例子中，大頭菜享元紀錄了島嶼、鈴錢以及數量，並且提供了簡單的計算總價方法。
{{< /alert >}}

#### TurnipsFlyweight.php

```php
/**
 * Class TurnipsFlyweight.
 */
class TurnipsFlyweight implements FlyweightInterface
{
    /**
     * @var string
     */
    protected $island;

    /**
     * @var int
     */
    protected $price;

    /**
     * @var int
     */
    protected $count;

    /**
     * @param string $island
     * @param int $price
     * @param int $count
     */
    public function __construct(string $island, int $price, int $count)
    {
        $this->island = $island;
        $this->price = $price;
        $this->count = $count;
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return $this->price * $this->count;
    }
}
```

### 建立享元工廠（Flyweight Factory）

{{< alert "exclamation-triangle" >}}
**享元工廠設計重點**

享元工廠是享元模式的核心組件，主要負責建立、管理大頭菜共享物件，以及提供基本功能。它確保相同的島嶼只會建立一次物件，從而達到共享和節省記憶體的目的。
{{< /alert >}}

#### FlyweightFactory.php
```php
use Countable;

/**
 * Class FlyweightFactory.
 */
class FlyweightFactory implements Countable
{
    /**
     * @var TurnipsFlyweight[]
     */
    protected $turnips = [];

    /**
     * @param string $island
     * @param int $price
     * @param int $count
     */
    public function get(string $island, int $price = 0, int $count = 0): TurnipsFlyweight
    {
        if (!isset($this->turnips[$island])) {
            $this->turnips[$island] = new TurnipsFlyweight($island, $price, $count);
        }

        return $this->turnips[$island];
    }

    /**
     * @return int
     */
    public function calculateTotal(): int
    {
        $total = 0;
        foreach ($this->turnips as $turnip) {
            $total += $turnip->calculatePrice();
        }

        return $total;
    }

    /**
     * @return int
     */
    public function count(): int
    {
        return count($this->turnips);
    }
}
```

### 技術補充說明

{{< alert "book-open" >}}
**Countable 介面說明**

繼承 `Countable` 這個介面可以使用 PHP 的 `count()` 函數直接計算物件數量，因此需要實作 `count()` 方法。這提供了更直觀的 API 使用方式。

```php
interface Countable {
    abstract public count(): int
}
```

**相關資源**: [PHP: Countable - Manual](https://www.php.net/manual/en/class.countable.php)
{{< /alert >}}

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

最後我們要對享元物件、工廠進行簡單的測試，驗證享元模式的共享機制和性能優化：

1. **單個享元測試**: 依序塞入享元，並且計算該次塞入的大頭菜跟紀錄所算出來的鈴錢是否相符

2. **工廠管理測試**: 大頭菜全部塞入後，所存入的筆數是否跟實際上相符

3. **總計測試**: 最後計算所有大頭菜的總鈴錢是否是正確的
{{< /alert >}}

### 測試程式碼

#### FlyweightPatternTest.php
```php
/**
 * Class FlyweightPatternTest.
 */
class FlyweightPatternTest extends TestCase
{
    /**
     * @var array
     */
    protected $turnips = array(
        'Island_A' => array('price' => 90, 'count' => 40),
        'Island_B' => array('price' => 92, 'count' => 36),
        'Island_C' => array('price' => 94, 'count' => 32),
        'Island_D' => array('price' => 96, 'count' => 28),
        'Island_E' => array('price' => 98, 'count' => 24),
        'Island_F' => array('price' => 100, 'count' => 20),
        'Island_G' => array('price' => 102, 'count' => 16),
        'Island_H' => array('price' => 104, 'count' => 12),
        'Island_I' => array('price' => 106, 'count' => 8),
        'Island_J' => array('price' => 108, 'count' => 4),
        'Island_K' => array('price' => 110, 'count' => 40),
    );

    /**
     * @test
     */
    public function test_flyweight()
    {
        $factory = new FlyweightFactory();

        foreach ($this->turnips as $key => $value) {
            $flyweight = $factory->get($key, $value['price'], $value['count']);
            $total = $flyweight->calculatePrice();

            $this->assertEquals($value['price'] * $value['count'], $total);
        }

        $this->assertCount(count($this->turnips), $factory);
        $this->assertEquals(25520, $factory->calculateTotal());
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
 ==> BuilderPatternTest         ✔  ✔  ✔  ✔  
 ==> FactoryMethodTest          ✔  ✔  ✔  ✔  
 ==> PoolPatternTest            ✔  ✔  
 ==> PrototypePatternTest       ✔  ✔  
 ==> SimpleFactoryTest          ✔  ✔  ✔  ✔  
 ==> SingletonPatternTest       ✔  
 ==> StaticFactoryTest          ✔  ✔  ✔  ✔  ✔  
 ==> AdapterPatternTest         ✔  ✔  
 ==> BridgePatternTest          ✔  ✔  ✔  
 ==> CompositePatternTest       ✔  ✔  ✔  
 ==> DataMapperTest             ✔  ✔  
 ==> DecoratorPatternTest       ✔  ✔  
 ==> DependencyInjectionTest    ✔  ✔  ✔  
 ==> FacadePatternTest          ✔  
 ==> FluentInterfaceTest        ✔  
 ==> FlyweightPatternTest       ✔  

Time: 00:00.030, Memory: 6.00 MB

OK (44 tests, 107 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 享元模式](https://blog.init.engineer/posts/FlyweightPattern)
- [享元模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/FlyweightPattern)
- [享元模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/FlyweightPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
