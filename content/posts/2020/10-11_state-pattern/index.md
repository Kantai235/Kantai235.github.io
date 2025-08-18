---
title: 【PHP 設計模式】狀態模式 State Pattern
slug: state-pattern
description: 狀態模式，讓物件的狀態改變時，一同改變物件的行為模式，就像是大頭菜(Turnips)這個物件，有沒有壞掉只是一個狀態(State)來辨別，但如果壞掉了，那麼會因為狀態改變的關係，而讓大頭菜計算鈴錢價格的方式也跟著改變。
summary: "以動物森友會大頭菜為例，學習狀態模式設計模式。允許一個物件在其內部狀態改變時改變其行為，這個物件看起來好像修改了它的類別。"

date: '2020-10-11T00:00:00+08:00'
lastmod: '2020-10-11T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 行為型
- 狀態模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 行為型
- 狀態模式
- PHP
- 設計模式
- 狀態模式
---

{{< lead >}}
狀態模式，讓物件的狀態改變時，一同改變物件的行為模式，就像是大頭菜(Turnips)這個物件，有沒有壞掉只是一個狀態(State)來辨別，但如果壞掉了，那麼會因為狀態改變的關係，而讓大頭菜計算鈴錢價格的方式也跟著改變。
{{< /lead >}}

## 什麼是狀態模式

### 核心概念

{{< alert "info" >}}
**狀態模式核心概念**

狀態模式允許一個物件在其內部狀態改變時改變其行為，這個物件看起來好像修改了它的類別。狀態模式主要解決的是當控制一個物件狀態轉換的條件表達式過於複雜時的情況。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 一個物件的行為取決於它的狀態，並且它必須在運行時根據狀態改變它的行為
- 一個操作中含有庞大的多分支條件語句，且這些分支取決於物件的狀態
- 為狀態轉換關係複雜的物件提供更清晰的結構
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="State Pattern UML 類別圖" caption="State Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 定義狀態介面（State Interface）

{{< alert "circle-info" >}}
**狀態介面設計**

因為要讓大頭菜(Turnips)掛載狀態物件，所以我們要先來定義狀態介面。這個介面定義了所有具體狀態類別必須實作的方法，包括進入下個狀態的方法和狀態識別方法。
{{< /alert >}}

#### State.php
```php
/**
 * Interface State.
 */
interface State
{
    /**
     * @param Turnips $turnips
     */
    public function proceedToNext(Turnips $turnips);

    /**
     * @return string
     */
    public function toString(): string;
}
```

### 實作具體狀態（Concrete States）

{{< alert "circle-info" >}}
**初始狀態實作**

首先是大頭菜剛建立出來的狀態，這是狀態機的初始狀態。大頭菜的下個狀態是壞掉的狀態，所以在 `proceedToNext` 方法中我們要將大頭菜設定為壞掉狀態。
{{< /alert >}}

#### StateCreated.php
```php
/**
 * Class StateCreated.
 */
class StateCreated implements State
{
    /**
     * @param Turnips $turnips
     */
    public function proceedToNext(Turnips $turnips)
    {
        $turnips->setState(new StateSpoiled());
    }

    /**
     * @return string
     */
    public function toString(): string
    {
        return 'created';
    }
}
```

{{< alert "exclamation-triangle" >}}
**終端狀態實作**

再來是壞掉的大頭菜狀態，這個階段已經是最終階段了，也就是狀態機的終端狀態。所以在 `proceedToNext` 的部分則是不實作任何事，因為沒有下一個狀態了。
{{< /alert >}}

#### StateSpoiled.php
```php
/**
 * Class StateSpoiled.
 */
class StateSpoiled implements State
{
    /**
     * @param Turnips $turnips
     */
    public function proceedToNext(Turnips $turnips)
    {
        // there is nothing more to do
    }

    /**
     * @return string
     */
    public function toString(): string
    {
        return 'spoiled';
    }
}
```

### 建立環境類別（Context Class）

{{< alert "exclamation-triangle" >}}
**環境類別設計重點**

最後我們要實作大頭菜(Turnips)，這是狀態模式中的環境類別。除了要儲存鈴錢價格(Price)、數量(Count)以外，還要儲存當前的狀態(State)，這個狀態會在一開始被建立時就擁有，並且會在執行 `proceedToNext` 時被變更，最後提供計算鈴錢總價格的 `calculatePrice` 方法，並且根據當前的狀態(State)來切換計算模式。
{{< /alert >}}

#### Turnips.php
```php
/**
 * Class Turnips.
 */
class Turnips
{
    /**
     * @var State
     */
    protected State $state;

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
     * @return Turnips
     */
    public static function create(int $price, int $count): Turnips
    {
        $turnips = new self($price, $count);
        $turnips->state = new StateCreated();

        return $turnips;
    }

    /**
     * @param State $state
     */
    public function setState(State $state)
    {
        $this->state = $state;
    }

    /**
     * @return void
     */
    public function proceedToNext()
    {
        $this->state->proceedToNext($this);
    }

    /**
     * @return string
     */
    public function toString()
    {
        return $this->state->toString();
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        switch ($this->toString()) {
            case 'created':
                return $this->price * $this->count;

            case 'spoiled':
                return 0;
        }
    }
}
```

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

最後我們要對狀態模式做測試，驗證狀態機的運作和狀態轉換：

1. **初始狀態測試**: 建立一個大頭菜物件，這時候是健康的大頭菜，應該要可以得知大頭菜現在的狀態是剛建立的 `created`

2. **狀態轉換測試**: 把大頭菜切換為下個狀態，也就是壞掉的大頭菜，這時候應該要獲得壞掉的狀態 `spoiled`

3. **行為變化測試**: 驗證在不同狀態下，同樣的操作會產生不同的結果（正常計算 vs 0 鈴錢）
{{< /alert >}}

### 測試程式碼

#### StatePatternTest.php
```php
/**
 * Class StatePatternTest.
 */
class StatePatternTest extends TestCase
{
    /**
     * @test
     */
    public function test_state_spoiled()
    {
        $turnips = Turnips::create(100, 40);

        $this->assertSame('created', $turnips->toString());
        $this->assertEquals(4000, $turnips->calculatePrice());

        $turnips->proceedToNext();

        $this->assertSame('spoiled', $turnips->toString());
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

Time: 00:00.100, Memory: 8.00 MB

OK (73 tests, 145 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 狀態模式](https://blog.init.engineer/posts/StatePattern)
- [狀態模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Behavioral/StatePattern)
- [狀態模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Behavioral/StatePatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
