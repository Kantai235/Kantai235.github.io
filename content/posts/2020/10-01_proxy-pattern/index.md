---
title: 【PHP 設計模式】代理模式 Proxy Pattern
slug: proxy-pattern
description: 代理模式，它可以作為需要被保護的物件的介面，若以檔案權限來比喻的話，就是對主要物件套上一層代理，你可以在代理上實作控制權限，像是其代理僅有讀取、執行的權限，並沒有刪除、修改的權限，並防止直接接觸實際物件，換作大頭菜來講的話，大頭菜的本質就是大頭菜，大頭菜就頂多提供數量堆積的功能，鈴錢的計算要在代理介面上實作。
summary: "以動物森友會大頭菜為例，學習代理模式設計模式。為其他物件提供一種代理以控制對這個物件的訪問，實現存取控制、懶加載、緩存等功能。"

date: '2020-10-01T00:00:00+08:00'
lastmod: '2020-10-01T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 代理模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 代理模式
- PHP
- 設計模式
- 代理模式
---

{{< lead >}}
代理模式，它可以作為需要被保護的物件的介面，若以檔案權限來比喻的話，就是對主要物件套上一層代理，你可以在代理上實作控制權限，像是其代理僅有讀取、執行的權限，並沒有刪除、修改的權限，並防止直接接觸實際物件，換作大頭菜來講的話，大頭菜的本質就是大頭菜，大頭菜就頂多提供數量堆積的功能，鈴錢的計算要在代理介面上實作。
{{< /lead >}}

## 什麼是代理模式

### 核心概念

{{< alert "info" >}}
**代理模式核心概念**

代理模式為其他物件提供一種代理以控制對這個物件的訪問。代理物件在客戶端和目標物件之間起中介作用，可以在不修改原有物件的情況下提供额外的功能，如存取控制、懶加載、緩存等。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- **远程代理**: 為位於不同地址空間的物件提供本地代表
- **虛擬代理**: 根據需要來創建開銷很大的物件
- **保護代理**: 控制對原始物件的訪問權限
- **緩存代理**: 為開銷很大的運算結果提供緩存空間
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Proxy Pattern UML 類別圖" caption="Proxy Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 定義主題介面（Subject Interface）

{{< alert "circle-info" >}}
**主題介面設計**

首先我們要先來實作大頭菜介面，這個介面定義了實際主題和代理物件共同的介面，確保它們可以相互替換使用。在我們的例子中，介面僅提供大頭菜總數計算的功能。
{{< /alert >}}

#### TurnipsInterface.php
```php
/**
 * Interface TurnipsInterface.
 */
interface TurnipsInterface
{
    /**
     * @param int $count
     */
    public function setCount(int $count);

    /**
     * @return int
     */
    public function getCount(): int;
}
```

### 建立實際主題（Real Subject）

{{< alert "circle-info" >}}
**實際主題設計**

實際主題類別定義了代理所代表的真實物件。在我們的例子中，這是最純粹的大頭菜物件，只提供基本的數量管理功能。
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
    protected int $count = 0;

    /**
     * @param int $count
     */
    public function setCount(int $count)
    {
        $this->count = $count;
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

### 建立代理類別（Proxy）

{{< alert "exclamation-triangle" >}}
**代理類別設計重點**

最後我們要製作大頭菜的代理，大頭菜代理繼承了大頭菜，並且再額外提供了鈴錢價格計算的功能。代理類別包含一個指向實際主題的引用，可以在訪問實際主題前後進行額外處理。
{{< /alert >}}

#### TurnipsProxy.php
```php
/**
 * Class TurnipsProxy.
 */
class TurnipsProxy extends Turnips implements TurnipsInterface
{
    /**
     * @var int
     */
    protected int $price = 0;

    /**
     * @var int
     */
    protected ?int $total = null;

    /**
     * TurnipsProxy constructor.
     * 
     * @param int $price
     * @param int $count
     */
    public function __construct(int $price, int $count)
    {
        $this->setPrice($price);
        $this->setCount($count);
    }

    /**
     * @param int $price
     */
    public function setPrice(int $price)
    {
        $this->price = $price;
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
    public function calculateTotal(): int
    {
        if ($this->total === null)
        {
            $this->total = $this->getPrice() * $this->getCount();
        }

        return $this->total;
    }
}
```

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

最後我們要來測試代理大頭菜的功能，驗證代理模式的核心功能：

1. **代理功能測試**: 透過代理來計算鈴錢總價，確保代理可以正常作為實際物件的替身

2. **緩存機制測試**: 鈴錢總價只會計算一次，並不會因為後續更改而變更，驗證代理的緩存功能
{{< /alert >}}

### 測試程式碼

#### ProxyPatternTest.php
```php
/**
 * Class ProxyPatternTest.
 */
class ProxyPatternTest extends TestCase
{
    /**
     * 透過代理來計算鈴錢總價。
     * 
     * @test
     */
    public function test_proxy_calculate_price()
    {
        $turnips = new TurnipsProxy(100, 40);
        $this->assertEquals(4000, $turnips->calculateTotal());
    }

    /**
     * 透過代理來計算鈴錢總價，並且鈴錢總價只會計算一次，並不會因為後續更改而變更。
     * 
     * @test
     */
    public function test_proxy_will_only_execute_calculate_price_once()
    {
        $turnips = new TurnipsProxy(100, 40);
        $this->assertEquals(4000, $turnips->calculateTotal());

        $turnips->setPrice(200);
        $turnips->setCount(30);
        $this->assertEquals(4000, $turnips->calculateTotal());
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
 ==> ProxyPatternTest           ✔  ✔  

Time: 00:00.029, Memory: 6.00 MB

OK (46 tests, 110 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 代理模式](https://blog.init.engineer/posts/ProxyPattern)
- [代理模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/ProxyPattern)
- [代理模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/ProxyPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
