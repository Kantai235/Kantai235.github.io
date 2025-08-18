---
title: 【PHP 設計模式】原型模式 Prototype Pattern
slug: prototype-pattern
description: 原型模式，你有些物件可能會需要建立很多一樣的物件，只是某些資料不太一樣而已，就有點像是每顆大頭菜都是一模一樣的物件，但可能因為來自不同的島，所以每顆大頭菜的差別只在於那起始購買的鈴錢不同。
summary: "以動物森友會大頭菜為例，學習原型模式設計模式。透過複製現有物件來建立新物件，避免重複的初始化過程，提供高效的物件建立方式。"

date: '2020-09-19T00:00:00+08:00'
lastmod: '2020-09-19T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 建立型
- 原型模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
---

{{< lead >}}
原型模式，你有些物件可能會需要建立很多一樣的物件，只是某些資料不太一樣而已，就有點像是每顆大頭菜都是一模一樣的物件，但可能因為來自不同的島，所以每顆大頭菜的差別只在於那起始購買的鈴錢不同。
{{< /lead >}}

## 什麼是原型模式

### 核心概念

{{< alert "info" >}}
**原型模式核心概念**

原型模式用原型實例指定建立物件的種類，並且透過複製這些原型來建立新的物件。它允許你在運行時動態地新增或移除產品。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 當一個系統應該獨立於它的產品建立、組成和表示時
- 當要實例化的類別是在運行時刻指定時
- 為了避免建立一個與產品類別層次平行的工廠類別層次時
- 當一個類別的實例只能有幾個不同狀態組合中的一種時
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Prototype Pattern UML 類別圖" caption="Prototype Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立原型抽象類別

{{< alert "circle-info" >}}
**實作步驟**

首先我們需要以抽象類別的方式，來製作大頭菜的原型，並且定義好大頭菜的基本功能。
{{< /alert >}}

#### TurnipsPrototype.php
```php
/**
 * Class TurnipsPrototype.
 */
abstract class TurnipsPrototype
{
    /**
     * @var string
     */
    protected $category;

    /**
     * @var int
     */
    protected $price;

    /**
     * @var int
     */
    protected $count;

    abstract public function __clone();

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

### 實作具體原型類別

{{< alert "exclamation-triangle" >}}
**重要提醒**

再來建立健康的大頭菜、壞掉的大頭菜，並且引用大頭菜原型，這裡需要注意我們須要去實作 `__clone` 方法，這樣子才能讓大頭菜複製、貼上。
{{< /alert >}}

#### Turnips.php
```php
/**
 * Class Turnips.
 */
class Turnips extends TurnipsPrototype
{
    /**
     * @var string
     */
    protected $category = '大頭菜';

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
     * ...
     */
    public function __clone()
    {
        // TODO: Implement __Clone() method.
    }
}
```

#### SpoiledTurnips.php
```php
/**
 * Class SpoiledTurnips.
 */
class SpoiledTurnips extends TurnipsPrototype
{
    /**
     * @var string
     */
    protected $category = '壞掉的大頭菜';

    /**
     * 壞掉的大頭菜是沒辦法賣鈴錢的狸！
     * 
     * @var int
     */
    const SPOILED_PRICE = 0;

    /**
     * SpoiledTurnips constructor.
     *
     * @param int $price
     * @param int $count
     */
    public function __construct(int $price, int $count)
    {
        $this->price = self::SPOILED_PRICE;
        $this->count = $count;
    }

    /**
     * ...
     */
    public function __clone()
    {
        // TODO: Implement __Clone() method.
    }
}
```

## 測試

### 測試目標

最後要來驗證一下我們所寫的原型是否是正確的，所以這次的測試也比較簡單，原型模式著重於大頭菜可以被複製，每個被複製出來的大頭菜只有局部的內容不一樣，以最節省資源的方式，來處理重複性質高的物件。

{{< alert "check-circle" >}}
**測試清單**

1. 建立大頭菜，並且複製 10 次，檢查每次大頭菜是否都是大頭菜，而且價格是正確的
2. 建立壞掉的大頭菜，並且複製 10 次，檢查每次大頭菜是否都是壞掉的大頭菜，而且都賣不了錢
{{< /alert >}}

### 測試程式碼

#### PrototypePatternTest.php

```php
/**
 * Class PrototypePatternTest.
 */
class PrototypePatternTest extends TestCase
{
    /**
     * 建立大頭菜，並且複製 10 次，
     * 檢查每次大頭菜是否都是大頭菜，而且價格是正確的。
     * 
     * @test
     */
    public function test_can_clone_turnips()
    {
        $turnips = new Turnips(100, 40);

        for ($i = 0; $i < 10; $i++) {
            $_turnips = clone $turnips;

            $this->assertInstanceOf(Turnips::class, $_turnips);
            $this->assertEquals(4000, $_turnips->calculatePrice());
        }
    }

    /**
     * 建立壞掉的大頭菜，並且複製 10 次，
     * 檢查每次大頭菜是否都是壞掉的大頭菜，而且都賣不了錢。
     * 
     * @test
     */
    public function test_can_clone_spoiled_turnips()
    {
        $turnips = new SpoiledTurnips(100, 40);

        for ($i = 0; $i < 10; $i++) {
            $_turnips = clone $turnips;
            $this->assertInstanceOf(SpoiledTurnips::class, $_turnips);
            $this->assertEquals(0, $_turnips->calculatePrice());
        }
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
- [技術部落格文章 - 原型模式](https://blog.init.engineer/posts/PrototypePattern)
- [原型模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Creational/PrototypePattern)
- [原型模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Creational/PrototypePatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
