---
title: 【PHP 設計模式】流暢介面 Fluent Interface
slug: fluent-interface
description: 流暢介面，常用於撰寫如同文章般容易閱讀的程式碼，如果以大頭菜來講，那麼在建立大頭菜的同時，希望可以順便賦予其鈴錢價格、數量，並且最終獲得的依舊是大頭菜物件。
summary: "以動物森友會大頭菜為例，學習流暢介面設計模式。提供鏈式調用的方式來撰寫可讀性更好的程式碼，讓方法調用如同自然語言般流暢。"

date: '2020-09-29T00:00:00+08:00'
lastmod: '2020-09-29T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 流暢介面
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 流暢介面
- PHP
- 設計模式
- 流暢介面
---

{{< lead >}}
流暢介面，常用於撰寫如同文章般容易閱讀的程式碼，如果以大頭菜來講，那麼在建立大頭菜的同時，希望可以順便賦予其鈴錢價格、數量，並且最終獲得的依舊是大頭菜物件。
{{< /lead >}}

## 什麼是流暢介面

### 核心概念

{{< alert "info" >}}
**流暢介面核心概念**

流暢介面（Fluent Interface）是一種設計模式，它提供鏈式調用的方式來撰寫可讀性更好的程式碼。每個方法都返回物件本身，從而允許多個方法調用連續在一起。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 需要提供直觀、易讀的 API
- 想要減少物件建構的複雜性
- 需要支援鏈式調用（Method Chaining）
- 適用於配置類別或建置器模式
- 想讓程式碼讀起來像自然語言
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Fluent Interface UML 類別圖" caption="Fluent Interface 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立流暢介面類別（Fluent Interface Class）

{{< alert "circle-info" >}}
**流暢介面設計重點**

這次只需要實作一個大頭菜物件，其精隨在於賦予鈴錢價格、數量時，最後會將整個物件再回傳出來，透過被呼叫的方法來回傳當前物件。這種設計讓方法能夠鏈式調用。
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
    protected $price = 0;

    /**
     * @var int
     */
    protected $count = 0;

    /**
     * @param int $price
     * 
     * @return Turnips
     */
    public function price(int $price): Turnips
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @param int $count
     * 
     * @return Turnips
     */
    public function count(int $count): Turnips
    {
        $this->count = $count;

        return $this;
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

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

我們要來實際測試大頭菜是否能夠以流暢介面的方式來建立物件，驗證流暢介面的鏈式調用機制：

1. **鏈式調用測試**: 測試是否能夠使用鏈式調用來設定屬性值
2. **物件返回測試**: 驗證每個方法都返回物件本身
3. **功能測試**: 測試最終的計算結果是否正確
4. **可讀性測試**: 驗證程式碼的可讀性和流暢性
{{< /alert >}}

### 測試程式碼

#### FluentInterfaceTest.php
```php
/**
 * Class FluentInterfaceTest.
 */
class FluentInterfaceTest extends TestCase
{
    /**
     * @test
     */
    public function test_build_turnips()
    {
        $turnips = (new Turnips())
            ->price(100)
            ->count(40);

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

Time: 00:00.079, Memory: 6.00 MB

OK (43 tests, 94 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 流暢介面](https://blog.init.engineer/posts/FluentInterface)
- [流暢介面 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/FluentInterface)
- [流暢介面 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/FluentInterfaceTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
