---
title: 【PHP 設計模式】依賴注入 Dependency Injection
slug: dependency-injection
description: 依賴注入模式，是控制反轉（Inversion of Control，縮寫為IoC）的一種實作方式，主要是將依賴物件丟給接收物件中，就像是你想要用大頭菜發財致富，但大頭菜有那麼多顆，你不可能每顆都記住鈴錢單價、數量，所以你寫了一張便條紙，紀錄著大頭菜的類別、鈴錢單價、數量，然後貼在大頭菜上。
summary: "以動物森友會大頭菜為例，學習依賴注入設計模式。是控制反轉（IoC）的一種實作方式，透過外部注入依賴物件，使類別不再需要自己建立依賴，提高程式的彈性和可測試性。"

date: '2020-09-27T00:00:00+08:00'
lastmod: '2020-09-27T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 依賴注入
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 依賴注入
- PHP
- 設計模式
- 依賴注入
---

{{< lead >}}
依賴注入模式，是控制反轉（Inversion of Control，縮寫為IoC）的一種實作方式，主要是將依賴物件丟給接收物件中，就像是你想要用大頭菜發財致富，但大頭菜有那麼多顆，你不可能每顆都記住鈴錢單價、數量，所以你寫了一張便條紙，紀錄著大頭菜的類別、鈴錢單價、數量，然後貼在大頭菜上。
{{< /lead >}}

## 什麼是依賴注入模式

### 核心概念

{{< alert "info" >}}
**依賴注入模式核心概念**

依賴注入是一種實現控制反轉的方式，它將類別所需的依賴物件從外部注入，而不是在類別內部建立。這樣做可以降低類別之間的耦合度，提高程式的彈性和可測試性。
{{< /alert >}}

### 控制反轉與優勢

{{< alert "lightbulb" >}}
**IoC 與依賴注入優勢**

- **降低耦合度**: 類別不再直接建立依賴物件
- **提高可測試性**: 可以輕易地注入模擬物件進行單元測試
- **增強彈性**: 可以在運行時更換不同的實作
- **支援配置化**: 可以透過配置檔或 DI 容器管理依賴
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Dependency Injection UML 類別圖" caption="Dependency Injection 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立配置類別（Configuration Class）

{{< alert "circle-info" >}}
**配置類別設計**

首先為了讓我們的大頭菜有個便條紙，所以我們要先建立大頭菜的組態文件 `TurnipsConfiguration` 並且將型別、鈴錢單價及數量帶入進去。為了防止外部物件直接碰到設定，所以需要獨立出 getter 方法。這個類別封裝了大頭菜的配置資訊，作為依賴物件被注入。
{{< /alert >}}

#### TurnipsConfiguration.php

```php
/**
 * Class TurnipsConfiguration.
 */
class TurnipsConfiguration
{
    /**
     * @var string
     */
    protected $type;

    /**
     * @var int
     */
    protected $price;

    /**
     * @var int
     */
    protected $count;

    /**
     * TurnipsConfiguration constructor.
     * 
     * @param string $type
     * @param int $price
     * @param int $count
     */
    public function __construct(string $type, int $price, int $count)
    {
        $this->type = $type;

        switch ($type) {
            case '健康的大頭菜':
                $this->price = $price;
                $this->count = $count;
                break;

            case '壞掉的大頭菜':
                $this->price = 0;
                $this->count = $count;
                break;
    
            default:
                throw new \InvalidArgumentException('找不到這種大頭菜分類。');
        }
    }

    /**
     * @return int
     */
    public function getType(): string
    {
        return $this->type;
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

### 建立接收依賴的類別（Dependent Class）

{{< alert "exclamation-triangle" >}}
**依賴注入設計重點**

再來將剛才建立的組態丟給大頭菜，並且透過 getter 方法來獲得組態設定，進而計算大頭菜的鈴錢總價。`Turnips` 類別不再需要自己建立配置物件，而是透過建構子接收外部注入的配置物件。
{{< /alert >}}

#### Turnips.php

```php
/**
 * Class Turnips.
 */
class Turnips
{
    /**
     * @var TurnipsConfiguration
     */
    protected $configuration;

    /**
     * Turnips constructor.
     * 
     * @param TurnipsConfiguration $config
     */
    public function __construct(TurnipsConfiguration $config)
    {
        $this->configuration = $config;
    }

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return $this->configuration->getPrice() * $this->configuration->getCount();
    }
}
```

## 測試

### 測試目標

最後我們要寫一下測試，主要測試把組態丟進大頭菜後，能不能正確的計算價格，以及如果組態有錯誤，是否能獲得預期的錯誤。

{{< alert "check-circle" >}}
**測試清單**

1. **正常依賴注入測試**: 測試正常的大頭菜配置是否可以賣鈴錢

2. **特殊狀態測試**: 測試壞掉的大頭菜配置鈴錢價格是否為 0

3. **異常處理測試**: 測試大頭菜組態檔如果給予不正確的類別，會獲得預期的錯誤
{{< /alert >}}

### 測試程式碼

#### DependencyInjectionTest.php
```php
/**
 * Class DependencyInjectionTest.
 */
class DependencyInjectionTest extends TestCase
{
    /**
     * 測試正常的大頭菜是否可以賣鈴錢。
     * 
     * @test
     */
    public function test_turnips_dependency_injection()
    {
        $config = new TurnipsConfiguration('健康的大頭菜', 100, 40);
        $turnips = new Turnips($config);

        $this->assertEquals(4000, $turnips->calculatePrice());
    }

    /**
     * 測試壞掉的大頭菜是否鈴錢價格為 0。
     * 
     * @test
     */
    public function test_spoiled_dependency_injection()
    {
        $config = new TurnipsConfiguration('壞掉的大頭菜', 100, 40);
        $turnips = new Turnips($config);

        $this->assertEquals(0, $turnips->calculatePrice());
    }

    /**
     * 測試大頭菜組態檔如果給予不正確的類別，會獲得預期的錯誤。
     * 
     * @test
     */
    public function test_undefined_dependency_injection()
    {
        $this->expectException(\InvalidArgumentException::class);

        $config = new TurnipsConfiguration('未知的大頭菜', 0, 0);
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

Time: 00:00.050, Memory: 6.00 MB

OK (41 tests, 88 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 依賴注入](https://blog.init.engineer/posts/DependencyInjection)
- [依賴注入 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/DependencyInjection)
- [依賴注入 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/DependencyInjectionTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
