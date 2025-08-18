---
title: 【PHP 設計模式】修飾模式 Decorator Pattern
slug: decorator-pattern
description: 修飾模式，或者稱裝飾者模式，為物件動態增加新的方法，就想像你最初的大頭菜沒有想過他會壞掉，某天突然覺得讓大頭菜壞掉好像很好玩，但你不能把整個大頭菜砍掉重練，所以你希望可以不改變既有的大頭菜，在大頭菜額外再套上新的功能，那就是壞掉。
summary: "以動物森友會大頭菜為例，學習裝飾者模式設計模式。動態地給物件添加一些額外的職責，就增加功能來說，裝飾者模式比繼承更為靈活，提供了繼承的替代方案。"

date: '2020-09-26T00:00:00+08:00'
lastmod: '2020-09-26T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 修飾模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 修飾模式
- PHP
- 設計模式
- 修飾模式
---

{{< lead >}}
修飾模式，或者稱裝飾者模式，為物件動態增加新的方法，就想像你最初的大頭菜沒有想過他會壞掉，某天突然覺得讓大頭菜壞掉好像很好玩，但你不能把整個大頭菜砍掉重練，所以你希望可以不改變既有的大頭菜，在大頭菜額外再套上新的功能，那就是壞掉。
{{< /lead >}}

## 什麼是裝飾者模式

### 核心概念

{{< alert "info" >}}
**裝飾者模式核心概念**

裝飾者模式動態地給一個物件添加一些額外的職責。就增加功能來說，裝飾者模式比生成子類別更為靈活。它允許向一個現有的物件添加新的功能，同時又不改變其結構。這種類型的設計模式屬於結構型模式，它是作為現有的類別的一個包裝。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 需要擴展一個類別的功能，或給一個類別添加附加職責
- 需要動態的給一個物件添加功能，這些功能可以再動態的撤銷
- 需要增加由一些基本功能的排列組合而產生的非常大量的功能
- 當不能採用生成子類別的方法進行擴充時
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Decorator Pattern UML 類別圖" caption="Decorator Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 定義組件介面（Component Interface）

{{< alert "circle-info" >}}
**實作步驟**

首先我們會需要定義出最初始大頭菜的介面，以及其最初的功能。這個介面定義了所有組件的基本操作，無論是具體組件還是裝飾者都需要實作這個介面。
{{< /alert >}}

#### TurnipsInterface.php

```php
/**
 * Interface TurnipsInterface.
 */
interface TurnipsInterface
{
    public function calculatePrice(): int;
}
```

### 建立具體組件（Concrete Component）

{{< alert "circle-info" >}}
**具體組件設計**

在裝飾者模式中，具體組件定義了一個物件，可以給這個物件添加一些職責。它實作了組件介面，提供了基本的功能實作。
{{< /alert >}}

#### TurnipsService.php
```php
/**
 * Class TurnipsService.
 */
class TurnipsService implements TurnipsInterface
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
     * TurnipsService constructor.
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
        return $this->price * $this->count;
    }
}
```

### 建立抽象裝飾者（Abstract Decorator）

{{< alert "exclamation-triangle" >}}
**裝飾者設計重點**

再來我們需要建立裝飾器(Decorator)，來修飾我們後來添加的壞掉功能，並且把最初始的大頭菜丟進去，讓大頭菜直接壞掉。抽象裝飾者類別維護一個指向組件物件的指針，並定義了一個與組件介面一致的介面。
{{< /alert >}}

#### TurnipsDecorator.php

```php
/**
 * Class TurnipsDecorator.
 */
abstract class TurnipsDecorator implements TurnipsInterface
{
    /**
     * @var TurnipsInterface
     */
    protected $turnips;

    /**
     * TurnipsDecorator constructor.
     * 
     * @param TurnipsInterface $turnips
     */
    public function __construct(TurnipsInterface $turnips)
    {
        $this->turnips = $turnips;
    }
}
```

### 建立具體裝飾者（Concrete Decorators）

{{< alert "circle-info" >}}
**具體裝飾者說明**

具體裝飾者類別負責給組件添加職責。它們繼承了抽象裝飾者類別，並修改其行為或添加新的功能。
{{< /alert >}}

#### Turnips.php
```php
/**
 * Class Turnips.
*/
class Turnips extends TurnipsDecorator
{
    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return $this->turnips->calculatePrice();
    }
}
```

#### Spoiled.php
```php
/**
 * Class Spoiled.
*/
class Spoiled extends TurnipsDecorator
{
    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return 0;
    }
}
```

## 測試

### 測試目標

完成了大頭菜裝飾器之後，我們接下來要驗證前面所寫的裝飾器是否能夠正常運行。

{{< alert "check-circle" >}}
**測試清單**

1. **具體組件測試**: 測試正常的大頭菜是否可以賣鈴錢

2. **裝飾者功能測試**: 測試壞掉的大頭菜是否沒辦法賣鈴錢，驗證裝飾者的動態行為改變
{{< /alert >}}

### 測試程式碼

#### DecoratorPatternTest.php
```php
/**
 * Class DecoratorPatternTest.
 */
class DecoratorPatternTest extends TestCase
{
    /**
     * 測試正常的大頭菜是否可以賣鈴錢。
     * 
     * @test
     */
    public function test_turnips()
    {
        $service = new TurnipsService(100, 40);
        $turnips = new Turnips($service);

        $this->assertEquals(4000, $turnips->calculatePrice());
    }

    /**
     * 測試壞掉的大頭菜是否沒辦法賣鈴錢。
     * 
     * @test
     */
    public function test_spoiled()
    {
        $service = new TurnipsService(100, 40);
        $turnips = new Spoiled($service);

        $this->assertEquals(0, $turnips->calculatePrice());
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

Time: 00:00.050, Memory: 6.00 MB

OK (41 tests, 88 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 修飾模式](https://blog.init.engineer/posts/DecoratorPattern)
- [修飾模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/DecoratorPattern)
- [修飾模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/DecoratorPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
