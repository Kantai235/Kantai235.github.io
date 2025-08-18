---
title: 【PHP 設計模式】模板方法 Template Method
slug: template-method
description: 模板方法，是一種如果這包水泥我有、你也有，就連喬瑟夫都有，那我們就應該把這八百包水泥抽離出來的設計模式，是設計模式中很簡單的模式，在模板(Template)裡頭會定義需要實作的方法，並且由繼承物件去實作或複寫，這個設計模式適用於不同物件有多處相似功能的時候，可以減少物件的耦合性過高問題。
summary: "以動物森友會大頭菜為例，學習模板方法設計模式。在一個操作中定義一個算法的骨架，而將一些步驟延遲到子類別中，使子類別可以不改變一個算法的結構即可重定義該算法的某些特定步驟。"

date: '2020-10-13T00:00:00+08:00'
lastmod: '2020-10-13T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 行為型
- 模板方法
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 行為型
- 模板方法
- PHP
- 設計模式
- 模板方法
---

{{< lead >}}
模板方法，是一種如果這包水泥我有、你也有，就連喬瑟夫都有，那我們就應該把這八百包水泥抽離出來的設計模式，是設計模式中很簡單的模式，在模板(Template)裡頭會定義需要實作的方法，並且由繼承物件去實作或複寫，這個設計模式適用於不同物件有多處相似功能的時候，可以減少物件的耦合性過高問題。
{{< /lead >}}

## 什麼是模板方法模式

### 核心概念

{{< alert "info" >}}
**模板方法模式核心概念**

模板方法模式在一個操作中定義一個算法的骨架，而將一些步驟延遲到子類別中。它使子類別可以不改變一個算法的結構即可重定義該算法的某些特定步驟。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 一次性實現一個算法的不變的部分，並將可變的行為留給子類別來實現
- 各子類別中公共的行為應被提取出來並集中在一個公共父類別中以避免代碼重複
- 控制子類別擴展：模板方法只在特定點呼叫 hook 操作
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Template Method UML 類別圖" caption="Template Method 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立抽象模板類別（Abstract Template）

{{< alert "circle-info" >}}
**抽象模板設計**

首先我們會需要建立一個抽象的模板，並且提供大頭菜無論健康的、壞掉的都擁有的方法，像是獲得鈴錢價格(getPrice)、獲得數量(getCount)以及計算總計鈴錢價格(calculatePrice)。而有些方法需要繼承物件去實作的，例如設定鈴錢價格(setPrice)，我們就需要以抽象方法的方式去定義。
{{< /alert >}}

#### TurnipsTemplate.php
```php
/**
 * Abstract TurnipsTemplate.
 */
abstract class TurnipsTemplate
{
    /**
     * @var int
     */
    protected int $price = 0;

    /**
     * @var int
     */
    protected int $count = 0;

    /**
     * TurnipsTemplate constructor.
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
     * @return int
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @return int
     */
    public function getCount()
    {
        return $this->count;
    }

    /**
     * @param int $price
     */
    abstract public function setPrice(int $price);

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
    public function calculatePrice(): int
    {
        $price = $this->price;
        $count = $this->count;
        return $price * $count;
    }
}
```

### 實作具體子類別（Concrete Classes）

{{< alert "circle-info" >}}
**健康大頭菜實作**

再來我們開始建立物件去繼承模板，首先健康的大頭菜，在設定鈴錢價格時，就直接根據設定的鈴錢金額去如實設定。這個類別實作了抽象模板中的抽象方法。
{{< /alert >}}

#### Turnips.php
```php
/**
 * Class Turnips.
 */
class Turnips extends TurnipsTemplate
{
    /**
     * @param int $price
     */
    public function setPrice(int $price)
    {
        $this->price = $price;
    }
}
```

{{< alert "exclamation-triangle" >}}
**壞掉大頭菜特殊處理**

而壞掉的大頭菜部分，則是無論設定的鈴錢金額是多少，都要直接給予 0 鈴錢，因為壞掉的大頭菜不值任何鈴錢。這展現了模板方法模式的彈性，允許不同的子類別有不同的實作。
{{< /alert >}}

#### Spoiled.php
```php
/**
 * Class Spoiled.
 */
class Spoiled extends TurnipsTemplate
{
    /**
     * @param int $price
     */
    public function setPrice(int $price)
    {
        $this->price = 0;
    }
}
```

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

最終我們要測試大頭菜的模板所建構出來的大頭菜物件是否可以正常運作，驗證模板方法模式的效果：

1. **健康大頭菜測試**: 測試健康的大頭菜物件(Turnips)，確保價格可以正常設定和計算

2. **壞掉大頭菜測試**: 測試壞掉的大頭菜物件(Spoiled)，確保無論設定什麼價格都會變成 0
{{< /alert >}}

### 測試程式碼

#### TemplateMethodTest.php
```php
/**
 * Class TemplateMethodTest.
 */
class TemplateMethodTest extends TestCase
{
    /**
     * @test
     */
    public function test_turnips_template()
    {
        $turnips = new Turnips(100, 40);

        $this->assertEquals(100, $turnips->getPrice());
        $this->assertEquals(40, $turnips->getCount());
        $this->assertEquals(4000, $turnips->calculatePrice());
    }

    /**
     * @test
     */
    public function test_spoiled_template()
    {
        $turnips = new Spoiled(100, 40);

        $this->assertEquals(0, $turnips->getPrice());
        $this->assertEquals(40, $turnips->getCount());
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
 ==> TemplateMethodTest         ✔  ✔  
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

Time: 00:00.052, Memory: 8.00 MB

OK (76 tests, 153 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 模板方法](https://blog.init.engineer/posts/TemplateMethod)
- [模板方法 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Behavioral/TemplateMethod)
- [模板方法 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Behavioral/TemplateMethodTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
