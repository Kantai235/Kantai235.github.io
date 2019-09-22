---
layout       : post
image        : 
title        : 擁有自動學習的 Python 機器人 - ChatterBot
description  : 「聊天機器人」一直是許多企業、學界在專研的東西，它可以用於許多用途上，例如淘寶會有機器人客服人員，會透過機器人來幫助你解決問題，又或者是很多聊天室都會有聊天機器人這種東西 ...
date         : 2017-03-16 12:00:00
author       : 乾太 kantai
mintags      :
- Python
- ChatterBot
tags         : 擁有自動學習的 Python 機器人 - ChatterBot, Python, ChatterBot, 機器人, 使用, 教學
comments     : true
signature    : true
category     : tutorial
twitter_text : 擁有自動學習的 Python 機器人 - ChatterBot
introduction : 「聊天機器人」一直是許多企業、學界在專研的東西，它可以用於許多用途上，例如淘寶會有機器人客服人員，會透過機器人來幫助你解決問題，又或者是很多聊天室都會有聊天機器人這種東西 ...
---

「聊天機器人」一直是許多企業、學界在專研的東西，它可以用於許多用途上，例如淘寶會有機器人客服人員，會透過機器人來幫助你解決問題，又或者是很多聊天室都會有聊天機器人這種東西，例如 Line 當中有人製作出了「卡米狗」，透過與使用者聊天當中學習語具，並在對應的場合當中回應相對應的回答。

而 [ChatterBot](https://github.com/gunthercox/ChatterBot) 是一個基於機器學習的聊天機器人引擎，使用 Python 作為主要基底語言，可以基於已知會話的集合生成回應，另外 [ChatterBot](https://github.com/gunthercox/ChatterBot) 的語言獨立設計允許它被訓練以說任何語言。

在官方的 GitHub 當中有一段範例：

- user: Good morning! How are you doing?
- bot: I am doing very well, thank you for asking.
- user: You're welcome.
- bot: Do you like hats?



又或者說，曾經我有將 [ChatterBot](https://github.com/gunthercox/ChatterBot) 結合到 LineMessageAPI 的範例當中：

![範例](https://i.imgur.com/ZAllFkw.png)



如果對於 LineMessageAPI 有興趣的話，可以詳情： [Line Message API 初戰！](https://kantai235.github.io/2017/03/06/LineMessageAPI/)

接下來我們開始來講解該如何使用這套 [ChatterBot](https://github.com/gunthercox/ChatterBot) 吧！首先我們必須要擁有 Python，這邊可能需要小小的注意一下說：

Python 3.x -> 可以支援中文。
Python 2.x -> 可能沒辦法支援中文，會有編碼上的問題。

再來你需要 [PyPi](https://pypi.python.org/pypi/ChatterBot) 這套東西，然後透過它來下載：

```sh
pip install chatterbot
```



安裝完成之後，我們就可以開始透過 Python 來使用 [ChatterBot](https://github.com/gunthercox/ChatterBot) 了！

讓我們來看看簡單的使用範例吧：

```python
# 引入 ChatBot
from chatterbot import ChatBot

# 建立一個 ChatBot 物件
chatbot = ChatBot(
    'Ron Obvious',
    trainer = 'chatterbot.trainers.ChatterBotCorpusTrainer'
)

# 基於英文的自動學習套件
chatbot.train("chatterbot.corpus.english")

# 與 ChatBot 對話，並且取得回應
chatbot.get_response("Hello, how are you today?")
```



當然除了英文語言庫外，還擁有中文語言庫(簡體中文)。

```python
chatbot.train("chatterbot.corpus.chinese")
```



當然也不止這些，我們可以透過載入基本語言庫、問候語言庫、對話語言庫，來讓我們的機器人更加的智慧：

```python
# 載入(簡體)中文的基本語言庫
chatbot.train("chatterbot.corpus.chinese")

# 載入(簡體)中文的問候語言庫
chatbot.train("chatterbot.corpus.chinese.greetings")

# 載入(簡體)中文的對話語言庫
chatbot.train("chatterbot.corpus.chinese.conversations")
```



當然我們能夠載入一些庫，是不是代表說，在 [ChatterBot](https://github.com/gunthercox/ChatterBot) 當中，有某個地方存放著這些庫呢？我們打開 ChatterBot 專案底下的 Corpus -> data 資料夾，我們會發現有幾些檔案夾很熟悉呢！其中有一個檔案夾叫做 chinese，我們打開他後會發現：

- 基本對話的庫
- conversations.corpus.json

- 問候語句的庫
- greetings.corpus.json

- 詳細問題的庫
- trivia.corpus.json



這三個檔案表面上不曉得這是什麼意思，我們就來實際打開來看看吧！首先是 conversations.corpus.json：

```json
{
    "conversations": [
        [
            "早安～",
            "午安～",
            "晚安～",
            "我想睡覺了",
            "我想去吃飯",
            "你好嗎",
            "我想去洗澡",
            "我媽叫我去吃飯"
        ],
        [
            "你好",
            "尼好",
            "你好嗎",
            "我還不錯",
            "那很好",
            "是啊",
            "我能幫你甚麼忙嗎",
            "我有個問題",
            "甚麼問題啊",
            "我可以抱抱嗎",
            "來ㄛ來抱ㄛ！",
            "好啊！",
            "<3"
        ],
        [   "什麼是愛",
            "就是你對我的感覺ㄛ <3"
        ],
        [
            "你愛我嗎？",
            "我知道我的主人很愛我喔！"
        ]
    ]
}
```



看起來就像是普通的對話語句，不過設計經驗上，會建議如果要自己建立語言庫的話，conversations 的語句當中，最好是連續的對話。

接下來我們看看 greetings.corpus.json 檔案的內容吧：

```json
{
    "greetings": [
        [
            "安安",
            "尼好呀！"
        ],
        [
            "最近如何",
            "還好ㄅ"
        ],
        [
            "最近如何",
            "很棒"
        ],
        [
            "最近如何",
            "ＯＫㄅ"
        ],
        [
            "最近如何",
            "不好！"
        ],
        [
            "你還好嗎",
            "超級不好！"
        ],
        [
            "你還好嗎",
            "超級好！"
        ]
    ]
}
```



看起來就是簡單的一問一答，不過這種狀況只在聊天剛開始的時候才會發生，就是簡單的問候句。

最後我們看看 trivia.corpus.json 檔案的內容吧！

```json
{
    "trivia": [
        [
            "誰是作者？",
            "乾太大神！"
        ]
    ]
}
```



很典型的問答，所以如果你想設計的是一個客服機器人的話，那你 trivia 當中的內容就會比較多哦！

如果你已經設計好你的 Corpus(庫) 的話，我們就來實機測試看看吧！

```python
import sys
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

class KantaiBOT:
    # 建立一個 ChatBot
    chatbot = ChatBot(
        # 這個 ChatBot 的名字叫做 KantaiBOT
        "KantaiBOT",
        storage_adapter = "chatterbot.storage.JsonFileStorageAdapter",
        # 設定訓練的資料庫輸出於根目錄，並命名為 KantaiBOT_DB.json
        database = "./KantaiBOT_DB.json"    
    )

    def __init__(self):
        self.chatbot.set_trainer(ChatterBotCorpusTrainer)
        self.chatbot.train("chatterbot.corpus.chinese")

    def getResponse(self, message=""):
        return self.chatbot.get_response(message)

if __name__ == "__main__":
    bot = KantaiBOT()
    print(bot.getResponse(sys.argv[1]))
```



使用時只要在終端機中下指令：

```sh
python KantaiBOT '你想說的內容'
```

機器人就會立即回應你了，這方法是為了銜接之前的 LineBOT 來實作，你可以使用 PHP、JSP、ASP.NET 或 Node.js 都可以，去呼叫這支 Python 程式碼，去啟動這個機器人，並且獲取回應回傳到 Line Server 當中，就完成簡易又能自動學習對話的機器人了！