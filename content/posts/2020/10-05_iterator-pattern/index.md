---
title: 【PHP 設計模式】疊代器模式 Iterator Pattern
slug: iterator-pattern
description: 疊代器模式，提供一種方法來簡單控制一個集合物件，這段過程並不會暴露該物件的來源或修改它，就有點像是你的背包(Bag)一樣，疊代器(Iterator)可以簡單控制你背包中的大頭菜(Turnips)以及鈴錢(Bells)。
summary: "以動物森友會背包管理為例，學習疊代器模式設計模式。提供一個一致的介面來存取物件集合的元素，而不需要暴露其內部的結構。"

date: '2020-10-05T00:00:00+08:00'
lastmod: '2020-10-05T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 行為型
- 疊代器模式
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 行為型
- 疊代器模式
- PHP
- 設計模式
- 疊代器模式
---

{{< lead >}}
疊代器模式，提供一種方法來簡單控制一個集合物件，這段過程並不會暴露該物件的來源或修改它，就有點像是你的背包(Bag)一樣，疊代器(Iterator)可以簡單控制你背包中的大頭菜(Turnips)以及鈴錢(Bells)。
{{< /lead >}}

## 什麼是疊代器模式

### 核心概念

{{< alert "info" >}}
**疊代器模式核心概念**

疊代器模式提供一個一致的介面來存取物件集合的元素，而不需要暴露其內部的結構。它將遍歷的機制封裝在一個特別的物件中，称為疊代器。
{{< /alert >}}

### 使用時機

{{< alert "lightbulb" >}}
**適用情境**

- 需要存取一個聚合物件的內容而不需暴露其內部表示
- 需要支援對聚合物件的多種遍歷
- 為不同的聚合結構提供一個統一的介面
- 需要將集合物件的內部結構和遍歷的機制分離
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Iterator Pattern UML 類別圖" caption="Iterator Pattern 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立基本實體類別（Entity Class）

{{< alert "circle-info" >}}
**大頭菜實體設計**

首先我們一樣要先建立大頭菜物件(Turnips)，並且賦予一些簡單方法，像是島嶼(Island)、鈴錢價格(Price)及數量(Count)，並且提供簡單的取得(get)及賦予(set)方法。
{{< /alert >}}

#### Turnips.php
```php
/**
 * Class Turnips.
 */
class Turnips
{
    /**
     * @var string
     */
    protected string $island;

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
     * @param string $island
     * @param int $price
     * @param int $count
     */
    public function __construct(string $island, int $price, int $count)
    {
        $this->setIsland($island);
        $this->setPrice($price);
        $this->setCount($count);
    }

    /**
     * @param string $island
     */
    public function setIsland(string $island)
    {
        $this->island = $island;
    }

    /**
     * @param int $price
     */
    public function setPrice(int $price)
    {
        $this->price = $price;
    }

    /**
     * @param int $count
     */
    public function setCount(int $count)
    {
        $this->count = $count;
    }

    /**
     * @return string
     */
    public function getIsland(): string
    {
        return $this->island;
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

    /**
     * @return int
     */
    public function calculatePrice(): int
    {
        return $this->getPrice() * $this->getCount();
    }
}
```

### 建立疊代器集合類別（Iterator Collection）

{{< alert "exclamation-triangle" >}}
**背包集合設計重點**

再來我們要建立背包(Bag)來負責管理大頭菜這個集合，這裡比較特別的是我們要實作 `Countable` 以及 `Iterator` 這兩個介面，讓背包可以直接提供 Count 方法、陣列 Array 相關方法。這樣的設計讓背包成為一個可疊代的集合。
{{< /alert >}}

#### Bag.php
```php
use Countable;
use Iterator;

/**
 * Class Bag.
 */
class Bag implements Countable, Iterator
{
    /**
     * @var Turnips[]
     */
    protected array $turnips = [];

    /**
     * @var int
     */
    protected int $currentIndex = 0;

    /**
     * @param Turnips
     */
    public function addTurnips(Turnips $turnips)
    {
        $this->turnips[] = $turnips;
    }

    /**
     * @param Turnips
     */
    public function removeTurnips(Turnips $turnipsToRemove)
    {
        foreach ($this->turnips as $key => $turnip) {
            if ($turnip->getIsland() === $turnipsToRemove->getIsland()) {
                unset($this->turnips[$key]);
            }
        }

        $this->turnips = array_values($this->turnips);
    }

    /**
     * @return int
     */
    public function count(): int
    {
        return count($this->turnips);
    }

    /**
     * @return Turnips
     */
    public function current(): Turnips
    {
        return $this->turnips[$this->currentIndex];
    }

    /**
     * @return int
     */
    public function key(): int
    {
        return $this->currentIndex;
    }

    /**
     * @return void
     */
    public function next()
    {
        $this->currentIndex++;
    }

    /**
     * @return void
     */
    public function rewind()
    {
        $this->currentIndex = 0;
    }

    /**
     * @return bool
     */
    public function valid(): bool
    {
        return isset($this->turnips[$this->currentIndex]);
    }
}
```

## PHP 內建疊代器介面

### Countable 介面

{{< alert "exclamation-triangle" >}}
**計數介面說明**
繼承 `Countable` 這個類別可以使用 `count()` 這個方法，因此需要實作它。
{{< /alert >}}
```php
class Countable {
    /* Methods */
    abstract public count ( void ) : int
}
```
- 官方文件：[PHP: Countable - Manual](https://www.php.net/manual/en/class.countable.php)

### Iterator 介面

{{< alert "exclamation-triangle" >}}
**疊代器介面說明**
繼承 `Iterator` 這個類別可以使用 `current()`、`key()`、`next()`、`rewind()`、`valid()` 這些方法，因此需要實作它們。
{{< /alert >}}
```php
class Iterator extends Traversable {
    /* Methods */
    abstract public current ( void ) : mixed
    abstract public key ( void ) : scalar
    abstract public next ( void ) : void
    abstract public rewind ( void ) : void
    abstract public valid ( void ) : bool
}
```
- 官方文件：[PHP: Iterator - Manual](https://www.php.net/manual/en/class.iterator.php)

## 測試

### 測試目標

{{< alert "check-circle" >}}
**測試清單**

最後我們要對疊代器模式做測試，驗證疊代器模式的集合遍歷機制：

1. **集合遍歷測試**: 測試背包是否可以正常遍歷其中的大頭菜
2. **動態管理測試**: 測試在移除元素後是否能正常遍歷
3. **集合操作測試**: 測試新增和移除元素的功能
4. **計數功能測試**: 測試 Countable 介面的 count 方法
{{< /alert >}}

### 測試程式碼

#### IteratorPatternTest.php
```php
/**
 * Class IteratorPatternTest.
 */
class IteratorPatternTest extends TestCase
{
    /**
     * @test
     */
    public function test_can_iterate_over_bag()
    {
        $bag = new Bag();
        $bag->addTurnips(new Turnips('Island_A', 100, 40));
        $bag->addTurnips(new Turnips('Island_B', 90, 40));
        $bag->addTurnips(new Turnips('Island_C', 80, 40));

        $islands = [];

        foreach ($bag as $turnips) {
            $islands[] = $turnips->getIsland();
        }

        $this->assertSame(
            array(
                'Island_A',
                'Island_B',
                'Island_C'
            ),
            $islands
        );
    }

    /**
     * @test
     */
    public function test_can_iterate_over_bag_after_removing_turnips()
    {
        $turnipsA = new Turnips('Island_A', 100, 40);
        $turnipsB = new Turnips('Island_B', 200, 10);

        $bag = new Bag();
        $bag->addTurnips($turnipsA);
        $bag->addTurnips($turnipsB);
        $bag->removeTurnips($turnipsA);

        $islands = [];
        foreach ($bag as $turnips) {
            $islands[] = $turnips->getIsland();
        }

        $this->assertSame(
            array('Island_B'),
            $islands
        );
    }

    /**
     * @test
     */
    public function test_can_add_turnips_to_bag()
    {
        $turnips = new Turnips('Island_A', 100, 40);

        $bag = new Bag();
        $bag->addTurnips($turnips);

        $this->assertCount(1, $bag);
    }

    /**
     * @test
     */
    public function test_can_remove_turnips_from_bag()
    {
        $turnips = new Turnips('Island_A', 100, 40);

        $bag = new Bag();
        $bag->addTurnips($turnips);
        $bag->removeTurnips($turnips);

        $this->assertCount(0, $bag);
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

Time: 00:00.117, Memory: 6.00 MB

OK (59 tests, 126 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 疊代器模式](https://blog.init.engineer/posts/IteratorPattern)
- [疊代器模式 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Behavioral/IteratorPattern)
- [疊代器模式 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Behavioral/IteratorPatternTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
