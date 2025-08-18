---
title: 【PHP 設計模式】備忘錄模式 Memento Pattern
slug: memento-pattern
description: 備忘錄模式，在不破壞封裝物件的前提之下，提供物件一個「皇后殺手 第三爆彈：敗者成塵」的能力，物件在極度絕望的狀態下，把當前物件炸光光，並令時間往前倒退至上一個時空紀錄點的設計模式，跟吉良吉影的不同點在於命運會跟著被改變，被破壞的東西會恢復原狀。
summary: "以動物森友會大頭菜為例，學習備忘錄模式設計模式。在不破壞物件封裝性的前提下，捕獲物件的內部狀態，並在物件之外保存這個狀態。"

date: '2020-10-07T00:00:00+08:00'
lastmod: '2020-10-07T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 行為型
- 備忘錄模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 行為型
- 備忘錄模式
- PHP
- 設計模式
- 備忘錄模式
---

{{< lead >}}
備忘錄模式，在不破壞封裝物件的前提之下，提供物件一個「皇后殺手 第三爆彈：敗者成塵」的能力，物件在極度絕望的狀態下，把當前物件炸光光，並令時間往前倒退至上一個時空紀錄點的設計模式，跟吉良吉影的不同點在於命運會跟著被改變，被破壞的東西會恢復原狀。
{{< /lead >}}

## 什麼是備忘錄模式

### 核心概念

{{< alert "info" >}}
**備忘錄模式核心概念**

備忘錄模式在不破壞物件封裝性的前提下，捕獲物件的內部狀態，並在物件之外保存這個狀態。這樣以後就可以將物件狀態恢復到之前保存的狀態。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 需要保存物件在某個時間點的狀態，以便之後恢復到這個狀態
- 需要實作復原(undo)功能
- 物件的狀態需要儲存在物件之外，且不破壞封裝性
- 需要建立檢查點(checkpoint)系統
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Memento Pattern UML 類別圖" caption="Memento Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立備忘錄類別（Memento Class）

{{< alert "circle-info" >}}
**備忘錄設計重點**

為了讓大頭菜有爆掉並往前倒退至上一個時空紀錄點的功能，這次我們要先實作備忘錄模式，用來儲存大頭菜的時空狀態，好讓大頭菜可以回到過去。備忘錄物件儲存原發者物件的內部狀態。
{{< /alert >}}

大頭菜：「キラークイーン、バイツ・ザ・ダスト！」

#### Memento.php
```php
/**
 * Class Memento.
 */
class Memento
{
    /**
     * @var int
     */
    protected int $price;

    /**
     * @var int
     */
    protected int $count;

    /**
     * Memento constructor.
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
    public function getPrice(): int
    {
        return $this->price;
    }

    /**
     * @return int
     */
    public function getCount(): int
    {
        return $this->count;
    }
}
```

### 建立原發者類別（Originator Class）

{{< alert "exclamation-triangle" >}}
**原發者設計重點**

接下來要實作擁有第三爆彈的大頭菜，除了以往所擁有的資訊、方法以外，這次要提供儲存、載入的功能，讓大頭菜能在任意的時空點進行儲存，並且在自己被逼到極限時，按下第三爆彈穿越時空回到過去。原發者物件負責創建備忘錄和從備忘錄恢復狀態。
{{< /alert >}}

大頭菜：「到極限了，就是現在，按下去！」

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
    protected int $price;

    /**
     * @var int
     */
    protected int $count;

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
     * @return Memento
     */
    public function saveToMemento(): Memento
    {
        return new Memento($this->price, $this->count);
    }

    /**
     * @param Memento $memento
     */
    public function restoreFromMemento(Memento $memento)
    {
        $this->price = $memento->getPrice();
        $this->count = $memento->getCount();
    }

    /**
     * @return int
     */
    public function getPrice(): int
    {
        return $this->price;
    }

    /**
     * @return int
     */
    public function getCount(): int
    {
        return $this->count;
    }

    /**
     * @return int
     */
    public function setPrice(int $price)
    {
        $this->price = $price;
    }

    /**
     * @return int
     */
    public function setCount(int $count)
    {
        $this->count = $count;
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return $this->getPrice() * $this->getCount();
    }
}
```

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

接下來我們要替第三爆彈模式測試一下，驗證備忘錄模式的狀態保存和恢復機制：

1. **狀態保存測試**: 測試大頭菜是否能正確儲存當前狀態
2. **狀態恢復測試**: 測試從備忘錄恢復狀態是否正確
3. **時間旅行測試**: 測試物件狀態的時間倒回功能
4. **封裝性測試**: 驗證備忘錄不破壞物件的封裝性
{{< /alert >}}

### 測試程式碼

#### MementoPatternTest.php
```php
/**
 * Class MementoPatternTest.
 */
class MementoPatternTest extends TestCase
{
    /**
     * @test
     */
    public function test_bites_the_dust()
    {
        $turnips = new Turnips(100, 40);
        $this->assertEquals(4000, $turnips->calculatePrice());

        /**
         * 儲存當前時空
         */
        $memento = $turnips->saveToMemento();

        $newPrice = random_int(0, 600);
        $turnips->setPrice($newPrice);
        $this->assertEquals($newPrice * 40, $turnips->calculatePrice());

        /**
         * 到極限了，就是現在，按下去！
         */
        $turnips->restoreFromMemento($memento);
        $this->assertEquals(4000, $turnips->calculatePrice());
    }
}
```

### 測試結果

最後測試的執行結果會獲得如下：

```
PHPUnit Pretty Result Printer 0.28.0 by Codedungeon and contributors.
==> Configuration: ~/php-design-pattern/vendor/codedungeon/phpunit-result-printer/src/phpunit-printer.yml

PHPUnit 9.2.6 by Sebastian Bergmann and contributors.

 ==> ...fResponsibilitiesTest   ✔  ✔  ✔  
 ==> CommandPatternTest         ✔  
 ==> IteratorPatternTest        ✔  ✔  ✔  ✔  
 ==> MediatorPatternTest        ✔  ✔  ✔  
 ==> MementoPatternTest         ✔  
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
 ==> ProxyPatternTest           ✔  ✔  
 ==> RegistryPatternTest        ✔  ✔  ✔  ✔  ✔  

Time: 00:00.105, Memory: 6.00 MB

OK (63 tests, 132 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 備忘錄模式](https://blog.init.engineer/posts/MementoPattern)
- [備忘錄模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Behavioral/MementoPattern)
- [備忘錄模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Behavioral/MementoPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
