---
title: 【PHP 設計模式】資料對應 Data Mapper
slug: data-mapper
description: 資料對應，這是一種常用於處理物件導向與資料庫資料的模式，與 `Repository` 不同，`Data Mapper` 主要處理的事單個物件本身，而
  `Repository` 處理的是物件的集合。這次實作舉個例子，你在買大頭菜之前，需要有一個草圖去評估你要前往哪些島上買大頭菜，決定好之後再開始行動。
summary: "以動物森友會大頭菜為例，學習資料對應器設計模式。在物件和資料庫之間建立映射關係，將資料庫和物件模型完全分離，使兩者之間的變化相互獨立。"

date: '2020-09-25T00:00:00+08:00'
lastmod: '2020-09-25T00:00:00+08:00'
categories:
- 技術文件
- PHP 設計模式
tags:
- 設計模式
- 結構型
- 資料對應
- PHP
- 物件導向
- 軟體架構
- 程式設計
keywords:
- 設計模式
- 結構型
- 資料對應
- PHP
- 設計模式
- 資料對應
---

{{< lead >}}
資料對應，這是一種常用於處理物件導向與資料庫資料的模式，與 `Repository` 不同，`Data Mapper` 主要處理的事單個物件本身，而 `Repository` 處理的是物件的集合。這次實作舉個例子，你在買大頭菜之前，需要有一個草圖去評估你要前往哪些島上買大頭菜，決定好之後再開始行動。
{{< /lead >}}

## 什麼是資料對應器模式

### 核心概念

{{< alert "info" >}}
**資料對應器模式核心概念**

資料對應器模式在物件和資料庫之間建立一個映射層，使物件模型與資料庫結構完全獨立。這個模式將資料存取的邏輯放在一個單獨的層中，讓物件不知道資料是在資料庫中的。
{{< /alert >}}

### 與 Repository 模式的差異

{{< alert "lightbulb" >}}
**Data Mapper vs Repository**

- **Data Mapper**: 主要處理單個物件本身，專注於物件與資料庫之間的映射
- **Repository**: 處理物件的集合，提供類似集合的介面來存取物件
- **使用時機**: 當需要將物件模型與資料庫結構完全分離時
{{< /alert >}}

## UML
{{< figure src="UML.png" alt="Data Mapper UML 類別圖" caption="Data Mapper 設計模式的 UML 類別關係圖" >}}

## 實作

### 建立實體類別（Entity）

{{< alert "circle-info" >}}
**實體類別設計**

首先我們要先把大頭菜給實作出來，這次因為大頭菜可以來自不同的島嶼，因此多了島嶼名稱，以及透過 `new self(...)` 的方式來回傳新的大頭菜物件。這個類別代表領域物件，它不知道自己如何被存儲或擷取。
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
    protected $island;

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
     * @param string $island
     * @param int    $price
     * @param int    $count
     */
    public function __construct(string $island, int $price, int $count)
    {
        $this->island = $island;
        $this->price = $price;
        $this->count = $count;
    }

    /**
     * @param array $island
     * 
     * @return Turnips
     */
    public static function fromIsland(array $island): Turnips
    {
        return new self(
            $island['island'],
            $island['price'],
            $island['count']
        );
    }
}
```

### ORM 概念說明

{{< alert "book-open" >}}
**物件關聯對應（ORM）**

`Turnips` 你可以理解為 ORM 物件，所以接下來要製作所謂的草稿(StorageAdapter)以及對應的中間層(TurnipsMapper)，把草稿寫好之後，丟進去中間層(TurnipsMapper)就可以對應到每個大頭菜物件。

**物件關聯對應說明**：是一種程式設計技術，用於實現物件導向程式語言裡不同類型系統的資料之間的轉換。

**資料來源**: [Wikipedia - 物件關聯對應](https://zh.wikipedia.org/wiki/对象关系映射)
{{< /alert >}}

### 建立資料對應器（Data Mapper）

> 【補充說明】
> 物件關聯對映（英語：Object Relational Mapping，簡稱ORM，或O/RM，或O/R mapping），是一種程式設計技術，用於實現物件導向程式語言裡不同類型系統的資料之間的轉換。從效果上說，它其實是建立了一個可在程式語言裡使用的「虛擬物件資料庫」。如今已有很多免費和付費的ORM產品，而有些程式設計師更傾向於建立自己的ORM工具。
> 資料來源：[維基百科](https://zh.wikipedia.org/wiki/对象关系映射)

#### TurnipsMapper.php
```php
/**
 * Class TurnipsMapper.
 */
class TurnipsMapper
{
    /**
     * @var StorageAdapter
     */
    protected $adapter;

    /**
     * TurnipsMapper constructor.
     *
     * @param StorageAdapter $storage
     */
    public function __construct(StorageAdapter $storage)
    {
        $this->adapter = $storage;
    }

    /**
     * @param int $id
     *
     * @return Turnips
     */
    public function findById(int $id): Turnips
    {
        $result = $this->adapter->findById($id);

        if ($result === null) {
            throw new \InvalidArgumentException("找不到 ID 為「 $id 」的島嶼。");
        }

        return $this->mapRowToTurnips($result);
    }

    /**
     * @param int $id
     *
     * @return Turnips
     */
    public function findByIsland(string $island): Turnips
    {
        $result = $this->adapter->findByIsland($island);

        if ($result === null) {
            throw new \InvalidArgumentException("找不到名稱為「 $island 」的島嶼。");
        }

        return $this->mapRowToTurnips($result);
    }

    /**
     * @param array $row
     * 
     * @return Turnips
     */
    protected function mapRowToTurnips(array $row): Turnips
    {
        return Turnips::fromIsland($row);
    }
}
```

### 建立儲存適配器（Storage Adapter）

{{< alert "exclamation-triangle" >}}
**儲存適配器設計**

`StorageAdapter` 代表資料存取層，在真實專案中可能是資料庫、API 或檔案系統。這裡我們簡化為一個陣列儲存，但概念相同。
{{< /alert >}}

#### StorageAdapter.php
```php
/**
 * Class StorageAdapter.
 */
class StorageAdapter
{
    /**
     * @var array
     */
    protected $data = [];

    /**
     * StorageAdapter constructor.
     *
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @param int $id
     *
     * @return array|null
     */
    public function findById(int $id)
    {
        if (isset($this->data[$id])) {
            return $this->data[$id];
        }

        return null;
    }

    /**
     * @param string $island
     *
     * @return array|null
     */
    public function findByIsland(string $island)
    {
        $key = array_search($island, array_column($this->data, 'island'));
        if (false !== $key) {
            return $this->data[$key];
        }
        
        return null;
    }
}
```

## 測試

### 測試目標

撰寫完資料對應器之後，接下來要寫些測試來驗證資料對應器是否能夠正確的運作，預期是繪製好草圖，把草圖塞入對應器之後，獲得相對應的大頭菜物件。

{{< alert "check-circle" >}}
**測試清單**

1. **正常映射測試**: 測試塞入大頭菜列，並且取得 id 為 1 的大頭菜

2. **異常處理測試**: 測試塞入空的大頭菜列，並且成功獲得例外錯誤
{{< /alert >}}

### 測試程式碼

#### DataMapperTest.php
```php
/**
 * Class DataMapperTest.
 */
class DataMapperTest extends TestCase
{
    /**
     * 測試塞入大頭菜列，並且取得 id 為 1 的大頭菜。
     * 
     * @test
     */
    public function test_can_map_turnips_from_storage()
    {
        $storage = new StorageAdapter(
            array(
                1 => array(
                    'island' => 'kantai',
                    'price' => 100,
                    'count' => 40,
                ),
            ),
        );

        $mapper = new TurnipsMapper($storage);

        $turnips = $mapper->findById(1);

        $this->assertInstanceOf(Turnips::class, $turnips);
    }

    /**
     * 測試塞入空的大頭菜列，並且成功獲得例外錯誤。
     * 
     * @test
     */
    public function test_will_not_map_invalid_data()
    {
        $this->expectException(\InvalidArgumentException::class);

        $storage = new StorageAdapter([]);
        $mapper = new TurnipsMapper($storage);

        $mapper->findById(1);
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

Time: 00:00.050, Memory: 6.00 MB

OK (36 tests, 83 assertions)
```

## 完整程式碼
[設計模式不難，找回快樂而已，以大頭菜為例。](https://github.com/Kantai235/php-design-pattern)
- [技術部落格文章 - 資料對應](https://blog.init.engineer/posts/DataMapper)
- [資料對應 原始碼](https://github.com/Kantai235/php-design-pattern/tree/master/DesignPatterns/Structural/DataMapper)
- [資料對應 測試](https://github.com/Kantai235/php-design-pattern/tree/master/Tests/Structural/DataMapperTest.php)

## 參考文獻
- [DesignPatternsPHP](https://github.com/domnikl/DesignPatternsPHP)
- [PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
