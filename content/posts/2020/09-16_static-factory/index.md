---
title: 【PHP 設計模式】靜態工廠 Static Factory
slug: static-factory
description: 靜態工廠，顧名思義就是希望這整個工廠都是屬於靜態屬性的，無論到哪裡都以靜態方法來使用這個工廠，就像是在星期日的早上時，會有個曹賣在你的島上走來走去，但無論曹賣走到哪裡，你都可以跟曹賣買大頭菜。
summary: "以動物森友會大頭菜為例，學習靜態工廠設計模式。透過靜態方法來建立物件，不需要實例化工廠就能直接使用，提供簡潔的 API 來建立不同類型的物件。"

date: '2020-09-16T00:00:00+08:00'
lastmod: '2020-09-16T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 建立型
- 靜態工廠
- PHP
- 物件導向
- 軟體架構
- 程式設計
---

{{< lead >}}
靜態工廠，顧名思義就是希望這整個工廠都是屬於靜態屬性的，無論到哪裡都以靜態方法來使用這個工廠，就像是在星期日的早上時，會有個曹賣在你的島上走來走去，但無論曹賣走到哪裡，你都可以跟曹賣買大頭菜。
{{< /lead >}}

## 什麼是靜態工廠

### 核心概念

{{< alert "info" >}}
**靜態工廠核心概念**

靜態工廠透過靜態方法來建立物件，不需要實例化工廠本身。它將建立物件的邏輯封裝在一個靜態方法中，提供簡潔的 API 來建立不同類型的物件。
{{< /alert >}}

### 優缺點

{{< alert "lightbulb" >}}
**靜態工廠的優缺點**

**優點:**
- 不需要實例化工廠，使用方便
- 可以隱藏物件建立的複雜性
- 可以提供有意義的方法名稱

**缺點:**
- 難以擴展，新增類型需要修改既有方法
- 可能會導致方法過於複雜
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Static Factory UML 類別圖" caption="Static Factory 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立大頭菜介面

{{< alert "circle-info" >}}
**實作步驟**

首先我們這次會有兩種大頭菜，一種是新鮮的大頭菜(Turnips)，另一種是壞掉的大頭菜(Spoiled Trunips)，但因為它們都是大頭菜，所以我們要先寫個大頭菜介面。
{{< /alert >}}

#### TurnipsContract.php
```php
/**
 * Interface TurnipsContract.
 */
interface TurnipsContract
{
    public function calculatePrice(): int;
}
```

### 實作大頭菜類別

然後我們要新增新鮮的大頭菜、壞掉的大頭菜，並且去實作大頭菜介面所定義的條件。

#### Turnips.php
```php
/**
 * Class Turnips.
 */
class Turnips implements TurnipsContract
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

#### SpoiledTurnips.php
```php
/**
 * Class SpoiledTurnips.
 */
class SpoiledTurnips implements TurnipsContract
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
     * SpoiledTurnips constructor.
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
        if (isset($this->count)) {
            return 0 * $this->count;
        } else {
            return 0;
        }
    }
}
```

### 建立靜態工廠

{{< alert "circle-info" >}}
**靜態工廠設計**

最後我們要建立大頭菜的靜態工廠，建立大頭菜的方法以靜態的方式宣告，並且根據參數來回傳不同的大頭菜。
{{< /alert >}}

#### TurnipsFactory.php
```php
/**
 * Class TurnipsFactory.
 */
final class TurnipsFactory
{
    /**
     * @param string $type
     * @param int    $price
     * @param int    $count
     *
     * @return TurnipsContract
     */
    public static function factory(string $type, int $price, int $count): TurnipsContract
    {
        if ($type === '大頭菜') {
            return new Turnips($price, $count);
        }

        if ($type === '壞掉的大頭菜') {
            return new SpoiledTurnips($price, $count);
        }

        throw new \InvalidArgumentException('找不到這種大頭菜分類。');
    }
}
```

## 測試

### 測試項目

再來為了驗證我們所寫的大頭菜靜態工廠是否正確，所以我們要來寫個測試，主要測試的項目如下：

{{< alert "check-circle" >}}
**測試清單**

1. 測試是否能夠正常建立大頭菜
2. 測試是否能夠正常建立壞掉的大頭菜
3. 測試是否能夠正常計算大頭菜的價格
4. 測試是否能夠正常計算壞掉的大頭菜的價格
5. 測試是否能夠收到未知的大頭菜
{{< /alert >}}

### 測試程式碼

#### StaticFactoryTest.php
```php
/**
 * Class StaticFactoryTest.
 */
class StaticFactoryTest extends TestCase
{
    /**
     * 測試是否能夠正常建立大頭菜。
     * 
     * @test
     */
    public function test_can_create_turnips()
    {
        $this->assertInstanceOf(Turnips::class, TurnipsFactory::factory('大頭菜', 100, 40));
    }

    /**
     * 測試是否能夠正常建立壞掉的大頭菜。
     * 
     * @test
     */
    public function test_can_create_spoiled_turnips()
    {
        $this->assertInstanceOf(SpoiledTurnips::class, TurnipsFactory::factory('壞掉的大頭菜', 100, 40));
    }

    /**
     * 測試是否能夠正常計算大頭菜的價格。
     * 
     * @test
     */
    public function test_can_calculate_price_for_turnips()
    {
        $turnips = TurnipsFactory::factory('大頭菜', 100, 40);

        $this->assertEquals(4000, $turnips->calculatePrice());
    }

    /**
     * 測試是否能夠正常計算壞掉的大頭菜的價格。
     * 
     * @test
     */
    public function test_can_calculate_price_for_spoiled_turnips()
    {
        $turnips = TurnipsFactory::factory('壞掉的大頭菜', 100, 40);

        $this->assertEquals(0, $turnips->calculatePrice());
    }

    /**
     * 測試是否能夠收到未知的大頭菜。
     * 
     * @expectedException \InvalidArgumentException
     */
    public function testException()
    {
        $this->expectException(\InvalidArgumentException::class);

        TurnipsFactory::factory('未知的大頭菜', 0, 0);
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
- [技術部落格文章 - 靜態工廠](https://blog.init.engineer/posts/StaticFactory)
- [靜態工廠 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Creational/StaticFactory)
- [靜態工廠 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Creational/StaticFactoryTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
