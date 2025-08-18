---
title: 【PHP 設計模式】組合模式 Composite Pattern
slug: composite-pattern
description: 組合模式，一種將物件一個一個處理，並且最後組合起來的模式，可以想像剛買到大頭菜時的夢想，經過每次漲跌所帶來的希望與絕望，究竟是充滿絕望的遞減型呢？還是致富關鍵的三期型呢？每次的價格異動，都代表著價格物件，最終賣出的鈴錢價格，是經過許多鈴錢價格物件所算出來的。
summary: "以動物森友會大頭菜為例，學習組合模式設計模式。將物件組合成樹狀結構，使客戶端可以一致地處理單個物件和物件的組合，實現部分-整體階層結構。"

date: '2020-09-24T00:00:00+08:00'
lastmod: '2020-09-24T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 組合模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 組合模式
- PHP
- 設計模式
- 組合模式
---

{{< lead >}}
組合模式，一種將物件一個一個處理，並且最後組合起來的模式，可以想像剛買到大頭菜時的夢想，經過每次漲跌所帶來的希望與絕望，究竟是充滿絕望的遞減型呢？還是致富關鍵的三期型呢？每次的價格異動，都代表著價格物件，最終賣出的鈴錢價格，是經過許多鈴錢價格物件所算出來的。
{{< /lead >}}

## 什麼是組合模式

### 核心概念

{{< alert "info" >}}
**組合模式核心概念**

組合模式將物件組合成樹狀結構以表示「部分-整體」的階層結構。組合模式使用者對單個物件和組合物件的使用具有一致性。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 想表示物件的部分-整體階層結構
- 希望用戶忽略組合物件與單個物件的不同，統一地使用組合結構中的所有物件
- 需要處理樹狀結構的數據
- 想要建立具有層次性的結構
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Composite Pattern UML 類別圖" caption="Composite Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 定義組合介面

{{< alert "circle-info" >}}
**實作步驟**

首先我們要先定義組合介面，用來套用在每個功能物件上。這個介面將確保所有組合元素都有相同的操作方法。
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

### 建立葉子節點（Leaf）

{{< alert "circle-info" >}}
**葉子節點設計**

再來建立大頭菜上漲(Price up)以及下跌(Price down)的物件，並且套用介面 Interface，其功能是把漲跌幅丟進去，用來紀錄當次的漲跌幅。這些類別表示組合模式中的葉子節點，在組合中表示原始物件。
{{< /alert >}}

#### PriceUp.php

```php
/**
 * Class PriceUp.
 */
class PriceUp implements TurnipsInterface
{
    /**
     * @var int
     */
    protected $price;

    /**
     * PriceDown constructor.
     *
     * @param int $price
     */
    public function __construct(int $price)
    {
        $this->price = $price;
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return $this->price;
    }
}
```

#### PriceDown.php
```php
/**
 * Class PriceDown.
 */
class PriceDown implements TurnipsInterface
{
    /**
     * @var int
     */
    protected $price;

    /**
     * PriceDown constructor.
     *
     * @param int $price
     */
    public function __construct(int $price)
    {
        $this->price = $price;
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return - $this->price;
    }
}
```

### 建立組合節點（Composite）

{{< alert "exclamation-triangle" >}}
**組合節點設計**

最後建立大頭菜，賦予起始價格以及數量，然後可以賦予每次價格漲跌幅的物件，然後根據每個漲跌幅物件，來計算最終的鈴錢價格。這個類別表示組合模式中的組合節點，它存儲子組件，在 Component 介面中實作與子組件有關的操作。
{{< /alert >}}

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
     * @var TurnipsInterface[]
     */
    protected $elements = [];

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
        $_price = $this->price;
        foreach ($this->elements as $element) {
            $_price += $element->calculatePrice();
        }

        return $_price * $this->count;
    }

    /**
     * @param TurnipsInterface $element
     */
    public function addElement(TurnipsInterface $element)
    {
        array_push($this->elements, $element);
    }
}
```

## 測試

### 測試目標

最後我們需要將大頭菜組合模式來寫些測試驗證一下，主要是測試鈴錢價格上漲物件、鈴錢價格下跌物件是否能夠正常運作，再來實際組裝起來再各別計算一次。

{{< alert "check-circle" >}}
**測試清單**

1. **葉子節點上漲測試**: 測試鈴錢價格上漲物件是否能夠正常運作

2. **葉子節點下跌測試**: 測試鈴錢價格下跌物件是否能夠正常運作

3. **組合節點功能測試**: 測試鈴錢價格上漲物件、鈴錢價格下跌物件實際組裝起來再各別計算一次
{{< /alert >}}

### 測試程式碼

#### CompositePatternTest.php
```php
/**
 * Class CompositePatternTest.
 */
class CompositePatternTest extends TestCase
{
    /**
     * 測試鈴錢價格上漲物件是否能夠正常運作。
     * 
     * @test
     */
    public function test_price_up()
    {
        $price = new PriceUp(20);
        $this->assertEquals(20, $price->calculatePrice());
    }

    /**
     * 測試鈴錢價格下跌物件是否能夠正常運作。
     * 
     * @test
     */
    public function test_price_down()
    {
        $price = new PriceDown(20);
        $this->assertEquals(-20, $price->calculatePrice());
    }

    /**
     * 測試鈴錢價格上漲物件、鈴錢價格下跌物件實際組裝起來再各別計算一次。
     * 
     * @test
     */
    public function test_price_up_and_down()
    {
        $turnips = new Turnips(100, 40);
        $this->assertEquals(4000, $turnips->calculatePrice());

        $turnips->addElement(new PriceUp(20));
        $this->assertEquals(4800, $turnips->calculatePrice());

        $turnips->addElement(new PriceDown(30));
        $this->assertEquals(3600, $turnips->calculatePrice());
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

Time: 00:00.050, Memory: 6.00 MB

OK (34 tests, 81 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 組合模式](https://blog.init.engineer/posts/CompositePattern)
- [組合模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/CompositePattern)
- [組合模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/CompositePatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
