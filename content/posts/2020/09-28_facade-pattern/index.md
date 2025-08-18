---
title: 【PHP 設計模式】外觀模式 Facade Pattern
slug: facade-pattern
description: 外觀模式，或者稱作門面模式，一種把複雜邏輯給包裝起來的一種模式，舉個例子來說，今天已經不單只是計算大頭菜了，而是你有個背包(Bag)要先放入鈴錢(Bells)，然後拿出鈴錢從曹賣(DaisyMae)手中購買大頭菜，並且把大頭菜賣給
  Nook 商店(Store)，牽涉到許多的細節，透過外觀模式來將複雜的操作集中成幾個簡單的動作。
summary: "以動物森友會大頭菜為例，學習外觀模式設計模式。為子系統中的一組介面提供一個一致的介面，隐藏子系統的複雜性，為客戶端提供簡化的使用介面。"

date: '2020-09-28T00:00:00+08:00'
lastmod: '2020-09-28T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 外觀模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 外觀模式
- PHP
- 設計模式
- 外觀模式
---

{{< lead >}}
外觀模式，或者稱作門面模式，一種把複雜邏輯給包裝起來的一種模式，舉個例子來說，今天已經不單只是計算大頭菜了，而是你有個背包(Bag)要先放入鈴錢(Bells)，然後拿出鈴錢從曹賣(DaisyMae)手中購買大頭菜，並且把大頭菜賣給 Nook 商店(Store)，牽涉到許多的細節，透過外觀模式來將複雜的操作集中成幾個簡單的動作。
{{< /lead >}}

## 什麼是外觀模式

### 核心概念

{{< alert "info" >}}
**外觀模式核心概念**

外觀模式為子系統中的一組介面提供一個一致的介面，外觀模式定義了一個高層次的介面，這個介面使得這一子系統更加容易使用。它隐藏了子系統的複雜性，為客戶端提供了一個簡化的使用介面。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 當你要為一個複雜子系統提供一個簡單的介面時
- 客戶端與抽象類別的實作類別之間存在著許多依賴性時
- 當你想在分層結構的子系統中定義子系統的入口時
- 希望降低子系統與客戶端之間的耦合度時
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Facade Pattern UML 類別圖" caption="Facade Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立基本實體類別

{{< alert "circle-info" >}}
**基本實體設計**

首先我們先慣例定義一下主角大頭菜(Turnips)，在這邊只需要給予價格、數量即可。這個類別是整個系統的核心實體，將被其他子系統使用。
{{< /alert >}}

#### Turnips.php

```php
/**
 * Class Turnips
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

### 設計複雜子系統組件

{{< alert "gear" >}}
**複雜子系統設計說明**

接下來我們要定義外觀模式中的複雜子系統組件，包括背包(Bag)、曹賣(DaisyMae)和商店(Store)。這些組件各自有複雜的邏輯，但通過外觀模式可以簡化客戶端的使用。
{{< /alert >}}

#### 背包系統設計

背包(Bag)需要可以放入鈴錢、大頭菜，並且可以取用，在取出的同時必須做到扣除背包裡鈴錢或大頭菜的數量。

#### BagInterface.php
```php
/**
 * Interface BagInterface.
 */
interface BagInterface
{
    /** 
     * @param int $bells
     */
    public function setBells(int $bells): int;

    /** 
     * @return int
     */
    public function getBells(int $bells): int;

    /** 
     * @param Turnips $turnips
     */
    public function setTurnips(Turnips $turnips): Turnips;

    /** 
     * @return Turnips
     */
    public function getTurnips(int $count): Turnips;
}
```

Bag.php
```php
/**
 * Class Bag.
 */
class Bag implements BagInterface
{
    /**
     * @var int
     */
    protected $bells = 0;

    /**
     * @var Turnips
     */
    protected $turnips;

    /** 
     * @param int $bells
     */
    public function setBells(int $bells): int
    {
        $this->bells += $bells;

        return $this->bells;
    }

    /** 
     * @return int
     */
    public function getBells(int $bells): int
    {
        if ($this->bells >= $bells) {
            $this->bells -= $bells;
            return $this->bells;
        }

        throw new \InvalidArgumentException('背包裡頭沒有那麼多的鈴錢。');
    }

    /** 
     * @param Turnips
     */
    public function setTurnips(Turnips $turnips): Turnips
    {
        $this->turnips = $turnips;

        return $this->turnips;
    }

    /** 
     * @return Turnips
     */
    public function getTurnips(int $count): Turnips
    {
        if ($this->turnips->getCount() >= $count) {
            $newCount = $this->turnips->getCount() - $count;
            $this->turnips->setCount($newCount);

            return new Turnips($this->turnips->getPrice(), $count);
        }

        throw new \InvalidArgumentException('背包裡頭沒有那麼多的大頭菜。');
    }
}
```

#### 曹賣系統設計

{{< alert "circle-info" >}}
**曹賣子系統功能**

曹賣(DaisyMae)的功能很簡單，就只需要購買大頭菜即可，當玩家購買大頭菜時，曹賣必須給玩家大頭菜。這是一個簡單但重要的子系統組件。
{{< /alert >}}

#### DaisyMaeInterface.php
```php
/**
 * Interface DaisyMaeInterface.
 */
interface DaisyMaeInterface
{
    /** 
     * @param int $price
     * @param int $count
     * 
     * @return Turnips
     */
    public function buy(int $price, int $count): Turnips;
}
```

DaisyMae.php
```php
/**
 * Class DaisyMae.
 */
class DaisyMae implements DaisyMaeInterface
{
    /** 
     * @param int $price
     * @param int $count
     * 
     * @return Turnips
     */
    public function buy(int $price, int $count): Turnips
    {
        return new Turnips($price, $count);
    }
}
```

#### 商店系統設計

{{< alert "circle-info" >}}
**商店子系統功能**

我們需要建立 Nook 商店(Store)，商店的功能也很簡單，就是把大頭菜賣給商店就可以了。這個子系統負責大頭菜的收購邏輯。
{{< /alert >}}

#### StoreInterface.php
```php
/**
 * Interface StoreInterface.
 */
interface StoreInterface
{
    /**
     * @param Turnips $turnips
     * @param int          $price
     * 
     * @return int
     */
    public function sell(Turnips $turnips, int $price): int;
}
```

Store.php
```php
/**
 * Class Store.
 */
class Store implements StoreInterface
{
    /**
     * @param Turnips $turnips
     * @param int          $price
     * 
     * @return int
     */
    public function sell(Turnips $turnips, int $price): int
    {
        return $turnips->getCount() * $price;
    }
}
```

### 建立外觀類別（Facade）

{{< alert "exclamation-triangle" >}}
**外觀模式核心實作**

最後我們需要來建立外觀(Facade)，其功能是負責處理複雜邏輯，將其化為簡單的動作。外觀類別封裝了各個子系統的複雜交互，提供給客戶端簡潔的介面。

**主要操作**：
1. 在背包裡放入鈴錢
2. 向曹賣購買大頭菜
3. 向 Nook 商店販賣大頭菜
4. 從背包裡取出鈴錢
{{< /alert >}}

#### Facade.php
```php
/**
 * Class Facade.
 */
class Facade
{
    /**
     * @var BagInterface
     */
    protected $bag;

    /**
     * @var StoreInterface
     */
    protected $store;

    /**
     * @var DaisyMaeInterface
     */
    protected $daisyMae;

    /**
     * Facade constructor.
     * 
     * @param BagInterface $bag
     * @param StoreInterface $store
     * @param DaisyMaeInterface $daisyMae
     */
    public function __construct(BagInterface $bag, StoreInterface $store, DaisyMaeInterface $daisyMae)
    {
        $this->bag = $bag;
        $this->store = $store;
        $this->daisyMae = $daisyMae;
    }

    /**
     * @param int $bells
     */
    public function takeupBells(int $bells): int
    {
        return $this->bag->setBells($bells);
    }

    /**
     * @param int $bells
     * 
     * @return int
     */
    public function takeoutBells(int $bells): int
    {
        return $this->bag->getBells($bells);
    }

    /**
     * @param int $price
     * @param int $count
     * 
     * @return int
     */
    public function buyTurnips(int $price, int $count): int
    {
        $this->bag->getBells($price * $count);
        $turnips = $this->daisyMae->buy($price, $count);
        $this->bag->setTurnips($turnips);

        return $this->bag->setBells(0);
    }

    /**
     * @param int $price
     * 
     * @return int
     */
    public function sellTurnips(int $price, int $count): int
    {
        $turnips = $this->bag->getTurnips($count);
        $bells = $this->store->sell($turnips, $price);
        return $this->bag->setBells($bells);
    }
}
```

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

撰寫完外觀模式後，我們需要測試程式邏輯是否正確，驗證外觀模式是否成功簡化了複雜的子系統操作：

1. **初始資金設定**: 在背包裡塞入 10,000 鈴錢
2. **購買大頭菜**: 購買 40 顆單價 100 鈴錢的大頭菜
3. **第一次販售**: 以 400 鈴錢賣出 20 顆大頭菜
4. **取出資金**: 從背包拿出 10,000 鈴錢
5. **第二次販售**: 再以 600 鈴錢賣出 20 顆大頭菜
{{< /alert >}}

### 測試程式碼

#### FacadePatternTest.php
```php
/**
 * Class FacadePatternTest.
 */
class FacadePatternTest extends TestCase
{
    /**
     * @test
     */
    public function test_buy_and_sell_turnips()
    {
        $bag = new Bag();
        $store = new Store();
        $daisyMae = new DaisyMae();
        $facade = new Facade($bag, $store, $daisyMae);

        // 在背包裡塞入 10,000 鈴錢
        $this->assertEquals(10000, $facade->takeupBells(10000));

        // 購買 40 顆單價 100 鈴錢的大頭菜
        $this->assertEquals(6000 ,$facade->buyTurnips(100, 40));

        // 以 400 鈴錢賣出 20 顆大頭菜
        $this->assertEquals(14000 ,$facade->sellTurnips(400, 20));

        // 從背包拿出 10,000 鈴錢
        $this->assertEquals(4000 ,$facade->takeoutBells(10000));

        // 再以 600 鈴錢賣出 20 顆大頭菜
        $this->assertEquals(16000 ,$facade->sellTurnips(600, 20));
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

Time: 00:00.028, Memory: 6.00 MB

OK (42 tests, 93 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 外觀模式](https://blog.init.engineer/posts/FacadePattern)
- [外觀模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/FacadePattern)
- [外觀模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/FacadePatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
