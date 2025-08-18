---
title: 【PHP 設計模式】靜態工廠 Abstract Factory
slug: abstract-factory
description: 抽象工廠，跟靜態工廠有點像，只是它沒那麼靜態，你需要先把工廠建立出來，才能開始生產大頭菜，就有點像是星期日的早上時，你打開 Switch
  需要先看西施惠晨報，這時候島上正在把曹賣叫過來，你聽完晨報時，曹賣也到島上了。
date: '2020-09-17T00:00:00+08:00'
lastmod: '2020-09-17T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 建立型
- 抽象工廠
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 建立型
- 抽象工廠
- PHP
- 設計模式
- 靜態工廠
summary: "以動物森友會大頭菜為例，學習抽象工廠設計模式。透過建立不同類型的工廠來產生相同介面但實作不同的物件，解決物件建立的複雜性和耦合性問題。"
---

{{< lead >}}
抽象工廠，跟靜態工廠有點像，只是它沒那麼靜態，你需要先把工廠建立出來，才能開始生產大頭菜，就有點像是星期日的早上時，你打開 Switch 需要先看西施惠晨報，這時候島上正在把曹賣叫過來，你聽完晨報時，曹賣也到島上了。
{{< /lead >}}

## 什麼是抽象工廠

### 核心概念

{{< alert "info" >}}
**工廠模式核心概念**

工廠主要在於說，如果你有一個物件需要建立，並且你會附帶很多功能時，為了避免耦合性過高，因而擁有的一系列模式。
{{< /alert >}}

你如果已經讀過前面幾些工廠的話，那你會發現工廠不外乎就是會有一個主要物件，以及負責建立物件的工廠，對於呼叫端來說，工廠怎麼製作這些物件的，這並不重要，因為呼叫端只需要給定參數，工廠的職責就是將物件生出來。

### 抽象工廠的特點

在抽象工廠當中，工廠與工廠之間可能有會重複的功能，但又有片面不重複的功能。

### 實際應用情境

{{< alert "lightbulb" >}}
**社群網站串接範例**

舉個例子來講，今天你在開發一個串接社群網站的應用程式，你有個功能是希望將文章一次發佈到多個社群網站，那麼當你在把文章發表到社群網站時，你可能會需要有個 Facebook 套件、Plurk 套件、Twitter 套件之類的，建立他們的方式可能不太一樣，有的吃 token，有的則是要 oauth 流程，但目標都是獲得特定社群的 client 物件。
{{< /alert >}}

而且他們都有相同的一個主要方法，那就是發表文章，只是實作的方式不同，有的只要帶入文章內容就可以了，有的需要將文章 hash 起來，或者有的要帶入文章分類，因此「發表文章」這個 function 就可以直接寫在抽象工廠(BaseFactory)當中，而實作的方式則是寫在繼承的工廠當中。

## UML
{{< figure src="UML.png" alt="Abstract Factory UML 類別圖" caption="Abstract Factory 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立大頭菜介面

{{< alert "circle-info" >}}
**實作步驟**

首先我們一樣要先建立大頭菜介面，並且定義大頭菜需要有哪些功能，再來建立健康的大頭菜、壞掉的大頭菜，先有大頭菜才有大頭菜工廠。
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

### 建立工廠系統

接下來我們要建立個別的大頭菜工廠，分別是健康的大頭菜工廠、壞掉的大頭菜工廠，但在此之前，我們要先定義什麼是工廠。

#### FactoryContract.php
```php
/**
 * Interface FactoryContract.
 */
interface FactoryContract
{
    public function createTurnips(int $price, int $count): TurnipsContract;
}
```

### 抽象工廠實作

並且實作出一個抽象的大頭菜工廠，這個抽象工廠會把具有重複性質的事情實作出來，這裡以分類新增大頭菜作為舉例。

#### BaseFactory.php
```php
/**
 * Class BaseFactory.
 */
abstract class BaseFactory implements FactoryContract
{
    /**
     * @param string $type
     * @param int    $price
     * @param int    $count
     * 
     * @return TurnipsContract
     */
    public function createTurnips(string $type, int $price, int $count): TurnipsContract
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

### 具體工廠實作

定義完工廠以後，我們最後要來建立健康的大頭菜工廠、壞掉的大頭菜工廠。

#### TurnipsFactory.php
```php
/**
 * Class TurnipsFactory.
 */
class TurnipsFactory implements FactoryContract
{
    // Code ...
}
```

#### SpoiledTurnipsFactory.php
```php
/**
 * Class SpoiledTurnipsFactory.
 */
class SpoiledTurnipsFactory implements FactoryContract
{
    // Code ...
}
```

## 測試

### 測試項目

寫完抽象大頭菜工廠了以後，我們接下來要寫些測試來驗證我們的抽象大頭菜工廠是否正確，因此有幾個測試項目要來驗證：
1. 測試是否能夠建立健康的大頭菜。
2. 測試是否能夠建立壞掉的大頭菜。
3. 測試健康的大頭菜是否能夠正常計算價格。
4. 測試壞掉的大頭菜是否能夠正常計算價格。

### 測試程式碼

#### AbstractFactoryTest.php
```php
/**
 * Class AbstractFactoryTest.
 */
class AbstractFactoryTest extends TestCase
{
    /**
     * 測試是否能夠建立大頭菜。
     * 
     * @test
     */
    public function test_can_create_turnips()
    {
        $factory = new TurnipsFactory();
        $turnips = $factory->createTurnips(100, 40);

        $this->assertInstanceOf(Turnips::class, $turnips);
    }

    /**
     * 測試是否能夠建立壞掉的大頭菜。
     * 
     * @test
     */
    public function test_can_create_spoiled_turnips()
    {
        $factory = new SpoiledTurnipsFactory();
        $turnips = $factory->createTurnips(100, 40);

        $this->assertInstanceOf(SpoiledTurnips::class, $turnips);
    }

    /**
     * 測試大頭菜是否能夠正常計算價格。
     * 
     * @test
     */
    public function test_can_calculate_price_for_turnips()
    {
        $factory = new TurnipsFactory();
        $turnips = $factory->createTurnips(100, 40);

        $this->assertEquals(4000, $turnips->calculatePrice());
    }

    /**
     * 測試壞掉的大頭菜是否能夠正常計算價格。
     * 
     * @test
     */
    public function test_can_calculate_price_for_spoiled_turnips()
    {
        $factory = new SpoiledTurnipsFactory();
        $turnips = $factory->createTurnips(100, 40);

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
- [技術部落格文章 - 抽象工廠](https://blog.init.engineer/posts/AbstractFactory)
- [抽象工廠 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Creational/AbstractFactory)
- [抽象工廠 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Creational/AbstractFactoryTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
