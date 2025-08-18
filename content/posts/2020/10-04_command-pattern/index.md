---
title: 【PHP 設計模式】命令模式 Command Pattern
slug: command-pattern
description: 命令模式，是一種將行為封裝起來裹上美好糖衣的一種模式，並將接收與執行分離出來，就有點像是把大頭菜買賣這件事，如果把買大頭菜、賣大頭菜這兩個動作封裝起來，變成一個命令，分開去執行。
summary: "以動物森友會大頭菜買賣為例，學習命令模式設計模式。將請求封裝成一個物件，使你可用不同的請求來參數化其他物件，並支援請求的佇列、記錄和復原操作。"

date: '2020-10-04T00:00:00+08:00'
lastmod: '2020-10-04T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 行為型
- 命令模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 行為型
- 命令模式
- PHP
- 設計模式
- 命令模式
---

{{< lead >}}
命令模式，是一種將行為封裝起來裹上美好糖衣的一種模式，並將接收與執行分離出來，就有點像是把大頭菜買賣這件事，如果把買大頭菜、賣大頭菜這兩個動作封裝起來，變成一個命令，分開去執行。
{{< /lead >}}

## 什麼是命令模式

### 核心概念

{{< alert "info" >}}
**命令模式核心概念**

命令模式將請求封裝成一個物件，使你可用不同的請求來參數化其他物件。這個模式主要將請求的發起者和接收者解耦，讓它們之間不需要直接互動。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 需要將操作參數化，可以將操作封裝成物件
- 需要在不同時間指定、排列和執行請求
- 需要支援復原(undo)操作
- 需要記錄操作日誌，以便系統重啟後恢復操作
- 需要將系統分解為高階操作構建在低階操作之上
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Command Pattern UML 類別圖" caption="Command Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 定義命令介面（Command Interface）

{{< alert "circle-info" >}}
**命令介面設計**

首先我們要先定義命令介面(Command)，這個介面需要實作執行(execute)這個方法。這個介面定義了所有具體命令類別必須實作的方法。
{{< /alert >}}

#### Command.php
```php
/**
 * Interface Command.
 */
interface Command
{
    /**
     * @return void
     */
    public function execute();
}
```

### 建立命令執行者（Invoker）

{{< alert "circle-info" >}}
**執行者設計重點**

再來我們需要建立命令的執行者(Invoker)，執行者會擁有執行命令(Command)的行為，它不需要知道命令的具體內容，只需要呼叫命令的 execute 方法。
{{< /alert >}}

#### Invoker.php
```php
/**
 * Class Invoker.
 */
class Invoker
{
    /**
     * @var Command
     */
    protected Command $command;

    /**
     * @param Command $command
     */
    public function setCommand(Command $command)
    {
        $this->command = $command;
    }

    /**
     * @return void
     */
    public function run()
    {
        $this->command->execute();
    }
}
```

### 建立命令接收者（Receiver）

{{< alert "exclamation-triangle" >}}
**接收者設計重點**

接收者則是會有特定的功能，像是買入大頭菜、販售大頭菜。接收者知道如何實施與執行一個請求相關的操作，任何類別都可能作為一個接收者。
{{< /alert >}}

#### Receiver.php
```php
/**
 * Class Receiver.
 */
class Receiver
{
    /**
     * @var int
     */
    protected int $turnips = 0;

    /**
     * @var int
     */
    protected int $bells = 0;

    /**
     * @param int $price
     * @param int $count
     */
    public function buy(int $price, int $count)
    {
        $total = $price * $count;
        if ($this->bells < $total) {
            throw new \InvalidArgumentException('您的鈴錢不足，無法購買大頭菜。');
        }

        $this->turnips += $count;
        $this->bells -= $total;
    }

    /**
     * @param int $price
     * @param int $count
     */
    public function sell(int $price, int $count)
    {
        if ($this->turnips < $count) {
            throw new \InvalidArgumentException('您的大頭菜不足，無法販賣大頭菜。');
        }

        $total = $price * $count;
        $this->turnips -= $count;
        $this->bells += $total;
    }

    /**
     * @param int $bells
     */
    public function setBells(int $bells)
    {
        $this->bells += $bells;
    }

    /**
     * @return int
     */
    public function getBells(): int
    {
        return $this->bells;
    }
}
```

### 實作具體命令（Concrete Commands）

{{< alert "circle-info" >}}
**購買命令實作**

最後要來建立購買(Buy)以及販賣(Sell)的命令(Command)，這邊會直接去執行命令所需要做的事情。購買命令會封裝購買大頭菜的操作。
{{< /alert >}}

#### BuyCommand.php
```php
/**
 * Class BuyCommand.
 */
class BuyCommand implements Command
{
    /**
     * @var Receiver
     */
    protected Receiver $console;

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
     * @param Receiver $console
     */
    public function __construct(Receiver $console, int $price, int $count)
    {
        $this->console = $console;
        $this->price = $price;
        $this->count = $count;
    }

    /**
     * @return void
     */
    public function execute()
    {
        $this->console->buy($this->price, $this->count);
    }
}
```

{{< alert "exclamation-triangle" >}}
**販賣命令實作**

販賣命令會封裝販賣大頭菜的操作，同樣實作命令介面的 execute 方法。
{{< /alert >}}

#### SellCommand.php
```php
/**
 * Class SellCommand.
 */
class SellCommand implements Command
{
    /**
     * @var Receiver
     */
    protected Receiver $console;

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
     * @param Receiver $console
     */
    public function __construct(Receiver $console, int $price, int $count)
    {
        $this->console = $console;
        $this->price = $price;
        $this->count = $count;
    }

    /**
     * @return void
     */
    public function execute()
    {
        $this->console->sell($this->price, $this->count);
    }
}
```

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

最後要對大頭菜命令模式測試一下，驗證命令模式的封裝和執行機制：

1. **購買命令測試**: 測試購買大頭菜的命令是否能正確執行，並正確扣除鈴錢
2. **販賣命令測試**: 測試販賣大頭菜的命令是否能正確執行，並正確增加鈴錢
3. **命令分離測試**: 驗證命令的發起者和接收者是否成功解耦
{{< /alert >}}

### 測試程式碼

#### CommandPatternTest.php
```php
/**
 * Class CommandPatternTest.
 */
class CommandPatternTest extends TestCase
{
    /**
     * @test
     */
    public function test_invocation()
    {
        $invoker = new Invoker();
        $receiver = new Receiver();
        $receiver->setBells(10000);

        $invoker->setCommand(new BuyCommand($receiver, 100, 40));
        $invoker->run();
        $this->assertSame(6000, $receiver->getBells());

        $invoker->setCommand(new SellCommand($receiver, 200, 40));
        $invoker->run();
        $this->assertSame(14000, $receiver->getBells());
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

Time: 00:00.062, Memory: 6.00 MB

OK (55 tests, 122 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 命令模式](https://blog.init.engineer/posts/CommandPattern)
- [命令模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Behavioral/CommandPattern)
- [命令模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Behavioral/CommandPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
