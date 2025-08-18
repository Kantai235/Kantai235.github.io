---
title: 【PHP 設計模式】策略模式 Strategy Pattern
slug: strategy-pattern
description: 策略模式，可以讓物件在運作時更改其行為或算法，你可以透過切換策略物件來改變計有的功能，你需要實作一個介面來代表這個策略物件，然後在主要類別當中去引入這個策略物件，在需要變更時來切換策略物件，來達成不同狀況下所需要的功能，就像是大頭菜的鈴錢有兩種模式，一種是原本的鈴錢，另一種則是過期後歸零，這個鈴錢運算的模式就可以抽離出來作為策略物件。
summary: "以動物森友會大頭菜為例，學習策略模式設計模式。定義一系列的算法，把它們一個個封裝起來，並且使它們可以相互替換，在運行時動態更改物件行為。"

date: '2020-10-12T00:00:00+08:00'
lastmod: '2020-10-12T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 行為型
- 策略模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 行為型
- 策略模式
- PHP
- 設計模式
- 策略模式
---

{{< lead >}}
策略模式，可以讓物件在運作時更改其行為或算法，你可以透過切換策略物件來改變計有的功能，你需要實作一個介面來代表這個策略物件，然後在主要類別當中去引入這個策略物件，在需要變更時來切換策略物件，來達成不同狀況下所需要的功能，就像是大頭菜的鈴錢有兩種模式，一種是原本的鈴錢，另一種則是過期後歸零，這個鈴錢運算的模式就可以抽離出來作為策略物件。
{{< /lead >}}

## 什麼是策略模式

### 核心概念

{{< alert "info" >}}
**策略模式核心概念**

策略模式定義了一系列的算法，把它們一個個封裝起來，並且使它們可以相互替換。本模式使得算法可独立於使用它的客戶端而變化。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 許多相關的類別僅仅是行為有異，策略模式提供了一種用多個行為中的一個行為來配置一個類別的方法
- 需要使用一個算法的不同變體：例如，你可能會定義一些反映不同的空間/時間權衡的算法
- 算法使用客戶端不應該知道的數據：使用策略模式可以避免暴露複雜的、與算法相關的數據結構
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Strategy Pattern UML 類別圖" caption="Strategy Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 定義策略介面（Strategy Interface）

{{< alert "circle-info" >}}
**策略介面設計**

首先我們要定義策略的介面，這個介面定義了所有具體策略類別必須實作的方法。在我們的例子中，策略物件必須要實作鈴錢運算(calculatePrice)的方法。
{{< /alert >}}

#### Strategy.php
```php
/**
 * Interface Strategy.
 */
interface Strategy
{
    /**
     * @return int
     */
    public function calculatePrice(int $price, int $count): int;
}
```

### 實作具體策略（Concrete Strategies）

{{< alert "circle-info" >}}
**正常大頭菜策略**

再來要實踐大頭菜的策略模式，首先是正常狀況下的大頭菜，會直接拿鈴錢價格、總數相成後即是鈴錢總價，並且將其回傳。這是標準的大頭菜價格計算策略。
{{< /alert >}}

#### TurnipsStrategy.php
```php
/**
 * Class TurnipsStrategy.
 */
class TurnipsStrategy implements Strategy
{
    /**
     * @return int
     */
    public function calculatePrice(int $price, int $count): int
    {
        return $price * $count;
    }
}
```

{{< alert "exclamation-triangle" >}}
**壞掉大頭菜策略**

至於壞掉的部分，只要大頭菜壞掉就是賣不出去，所以不用進行任何運算，直接回傳 0 鈴錢即可。這展現了策略模式的彈性，允許不同的策略有完全不同的實作。
{{< /alert >}}

#### SpoliedStrategy.php
```php
/**
 * Class SpoliedStrategy.
 */
class SpoliedStrategy implements Strategy
{
    /**
     * @return int
     */
    public function calculatePrice(int $price, int $count): int
    {
        return 0;
    }
}
```

### 建立環境類別（Context Class）

{{< alert "exclamation-triangle" >}}
**環境類別設計重點**

最後實作大頭菜物件，這是策略模式中的環境類別，它維護一個對策略物件的引用。我們需要順便把策略物件丟進去，如果在建立大頭菜物件時沒有指定策略物件，那麼預設就給予正常的策略物件，並且提供一個可以臨時切換策略物件的方法。
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
    protected int $price;

    /**
     * @var int
     */
    protected int $count;

    /**
     * @var Strategy
     */
    protected Strategy $strategy;

    /**
     * Turnips constructor.
     * 
     * @param int $price
     * @param int $count
     * @param Strategy $strategy
     */
    public function __construct(int $price, int $count, Strategy $strategy = null)
    {
        $this->price = $price;
        $this->count = $count;

        // 如果在建立大頭菜物件時沒有指定策略物件，那麼預設就給予正常的策略物件。
        $this->strategy = empty($strategy) ? new TurnipsStrategy() : $strategy;
    }

    /**
     * @param Strategy $strategy
     */
    public function setStrategy(Strategy $strategy)
    {
        $this->strategy = $strategy;
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return $this->strategy->calculatePrice($this->price, $this->count);
    }
}
```

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

最後我們要測試策略大頭菜是否如預期的可以運行，驗證策略模式的動態切換能力：

1. **初始策略測試**: 建立大頭菜物件，並且給予預設正常的策略物件，正常情況下可以計算出鈴錢

2. **策略切換測試**: 把策略物件替換為壞掉的模式，再重複呼叫方法時，則是獲得 0 鈴錢，驗證策略的動態切換
{{< /alert >}}

### 測試程式碼

#### StrategyPatternTest.php
```php
/**
 * Class StrategyPatternTest.
 */
class StrategyPatternTest extends TestCase
{
    /**
     * @test
     */
    public function test_strategy()
    {
        $turnips = new Turnips(100, 40, new TurnipsStrategy);
        $this->assertEquals(4000, $turnips->calculatePrice());

        $turnips->setStrategy(new SpoliedStrategy());
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

 ==> ...fResponsibilitiesTest   ✔  ✔  ✔  
 ==> CommandPatternTest         ✔  
 ==> IteratorPatternTest        ✔  ✔  ✔  ✔  
 ==> MediatorPatternTest        ✔  ✔  ✔  
 ==> MementoPatternTest         ✔  
 ==> NullObjectPatternTest      ✔  ✔  ✔  ✔  
 ==> ObserverPatternTest        ✔  
 ==> SpecificationPatternTest   ✔  ✔  ✔  ✔  
 ==> StatePatternTest           ✔  
 ==> StrategyPatternTest        ✔  
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

Time: 00:00.084, Memory: 8.00 MB

OK (74 tests, 147 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 策略模式](https://blog.init.engineer/posts/StrategyPattern)
- [策略模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Behavioral/StrategyPattern)
- [策略模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Behavioral/StrategyPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
