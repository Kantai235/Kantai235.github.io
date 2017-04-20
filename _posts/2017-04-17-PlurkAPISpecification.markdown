---
layout     : post
title      : "Plurk API 官方說明文件(不專業翻譯) - 目錄及規範"
subtitle   : "Plurk 資料被編譯成 JSON 格式，所使用的日期是 UTC，您也可以將 UTC 發佈到 Plurk 伺服器 ..."
date       : 2017-04-17 12:30:00
author     : "乾太 ₍₍ ◝(･◡･)◟ ⁾⁾"
tags       : Plurk API PlurkAPI OAuth 官方 說明 文件 官方說明文件 翻譯 註解
comments   : true
signature  : true
---

#### ***＊ 本文章為個人翻譯，故正式內容以 Plurk 官方為主 ＊***
#### ***＊ 原文請參照 https://www.plurk.com/API#toc ＊***

<br />

# 目錄

+ [Python 範例](https://kantai235.github.io/2017/04/17/PlurkAPISpecification/#python-範例)
+ [Plurk 資料規範](https://kantai235.github.io/2017/04/17/PlurkAPISpecification/#plurk-資料規範)
    + [拿一個噗文資料來當範例](https://kantai235.github.io/2017/04/17/PlurkAPISpecification/#拿一個噗文資料來當範例)
+ [使用者資料](https://kantai235.github.io/2017/04/17/PlurkAPISpecification/#使用者資料)
    + [拿一個使用者資料來當範例](https://kantai235.github.io/2017/04/17/PlurkAPISpecification/#拿一個使用者來當範例)
    + [關於出生及年齡的隱私](https://kantai235.github.io/2017/04/17/PlurkAPISpecification/#關於出生及年齡的隱私)
    + [如何顯示大頭貼](https://kantai235.github.io/2017/04/17/PlurkAPISpecification/#如何顯示大頭貼)
+ Users
    + /APP/Users/me
    + /APP/Users/update
    + /APP/Users/updatePicture
    + /APP/Users/getKarmaStats
+ Real time notifications
    + /APP/Realtime/getUserChannel
    + Comet channel specification
+ Polling
    + /APP/Polling/getPlurks
    + /APP/Polling/getUnreadCount
+ Timeline
    + /APP/Timeline/getPlurk
    + /APP/Timeline/getPlurks
    + /APP/Timeline/getUnreadPlurks
    + /APP/Timeline/getPublicPlurks
    + /APP/Timeline/plurkAdd
    + /APP/Timeline/plurkDelete
    + /APP/Timeline/plurkEdit
    + /APP/Timeline/toggleComments
    + /APP/Timeline/mutePlurks
    + /APP/Timeline/unmutePlurks
    + /APP/Timeline/favoritePlurks
    + /APP/Timeline/unfavoritePlurks
    + /APP/Timeline/replurk
    + /APP/Timeline/unreplurk
    + /APP/Timeline/markAsRead
    + /APP/Timeline/uploadPicture
    + /APP/Timeline/reportAbuse
+ Responses
    + /APP/Responses/get
    + /APP/Responses/responseAdd
    + /APP/Responses/responseDelete
+ Profile
    + /APP/Profile/getOwnProfile
    + /APP/Profile/getPublicProfile
+ Friends and fans
    + /APP/FriendsFans/getFriendsByOffset
    + /APP/FriendsFans/getFansByOffset
    + /APP/FriendsFans/getFollowingByOffset
    + /APP/FriendsFans/becomeFriend
    + /APP/FriendsFans/removeAsFriend
    + /APP/FriendsFans/becomeFan
    + /APP/FriendsFans/setFollowing
    + /APP/FriendsFans/getCompletion
+ Alerts
    + General data structures
    + /APP/Alerts/getActive
    + /APP/Alerts/getHistory
    + /APP/Alerts/addAsFan
    + /APP/Alerts/addAllAsFan
    + /APP/Alerts/addAllAsFriends
    + /APP/Alerts/addAsFriend
    + /APP/Alerts/denyFriendship
    + /APP/Alerts/removeNotification
+ Search
    + /APP/PlurkSearch/search
    + /APP/UserSearch/search
+ Emoticons
    + /APP/Emoticons/get
+ Blocks
    + /APP/Blocks/get
    + /APP/Blocks/block
    + /APP/Blocks/unblock
+ Cliques
    + /APP/Cliques/getCliques
    + /APP/Cliques/getClique
    + /APP/Cliques/createClique
    + /APP/Cliques/renameClique
    + /APP/Cliques/add
    + /APP/Cliques/remove
+ PlurkTop
    + /APP/PlurkTop/getCollections
    + /APP/PlurkTop/getTopics
    + /APP/PlurkTop/getPlurks
+ OAuth Utilities
    + /APP/checkToken
    + /APP/expireToken
    + /APP/checkTime
    + /APP/echo

# Python 範例

使用 Python 程式語言來撰寫 Plurk API 2.0 應用程式的範例程式碼：

```python
import oauth2 as oauth
import urlparse

OAUTH_REQUEST_TOKEN = 'https://www.plurk.com/OAuth/request_token'
OAUTH_ACCESS_TOKEN = 'https://www.plurk.com/OAuth/access_token'

def get_request_token(app_key, app_secret):
	consumer = oauth.Consumer(app_key, app_secret)
	client = oauth.Client(consumer)
	response = client.request(OAUTH_REQUEST_TOKEN, method='GET')
	return urlparse.parse_qs(response)

def get_access_token(app_key, app_secret, oauth_token, oauth_token_secret, oauth_verifier):
	consumer = oauth.Consumer(app_key, app_secret)
	token = oauth.Token(oauth_token, oauth_token_secret)
	token.set_verifier(oauth_verifier)
	client = oauth.Client(consumer, token)
	response = client.request(OAUTH_ACCESS_TOKEN, method='GET')
	return urlparse.parse_qs(response)

def getOwnProfile(app_key, app_secret, oauth_token, oauth_token_secret):
	apiUrl = 'https://www.plurk.com/APP/Profile/getOwnProfile'
	consumer = oauth.Consumer(app_key, app_secret)
	token = oauth.Token(oauth_token, oauth_token_secret)
	client = oauth.Client(consumer, token)
	response = client.request(apiUrl, method='GET')
	return response
```

# Plurk 資料規範

# 拿一個噗文資料來當範例

Plurk 資料被編譯成 JSON 格式，所使用的日期是遵循 UTC 標準，您也可以將 UTC 發佈到 Plurk 伺服器，然而您應該利用使用者的本地時間來顯示時間，通常的返回資料如下面的範例：

***＊附註說明：[世界協調時間，又稱世界標準時間或協調世界時，簡稱UTC（英文「Coordinated Universal Time」／法文「Temps Universel Coordonné」）](https://zh.wikipedia.org/wiki/协调世界时)＊***

```json
{"responses_seen": 0, "qualifier": "thinks", "plurk_id": 90812, "response_count": 0, "limited_to": null, "no_comments": 0, "is_unread": 1, "lang": "en", "content_raw": "test me out", "user_id": 1, "plurk_type": 0, "content": "test me out", "qualifier_translated": "thinks", "posted": "Fri, 05 Jun 2009 23:07:13 GMT", "owner_id": 1, "favorite": false, "favorite_count": 1, "favorers": [3196376], "replurkable": true, "replurked": true, "replurker_id": null, "replurkers": [1], "replurkers_count": 1}
```

JSON 格式縮排後：

```json
{
  "responses_seen": 0,
  "qualifier": "thinks",
  "plurk_id": 90812,
  "response_count": 0,
  "limited_to": null,
  "no_comments": 0,
  "is_unread": 1,
  "lang": "en",
  "content_raw": "test me out",
  "user_id": 1,
  "plurk_type": 0,
  "content": "test me out",
  "qualifier_translated": "thinks",
  "posted": "Fri, 05 Jun 2009 23:07:13 GMT",
  "owner_id": 1,
  "favorite": false,
  "favorite_count": 1,
  "favorers": [
    3196376
  ],
  "replurkable": true,
  "replurked": true,
  "replurker_id": null,
  "replurkers": [
    1
  ],
  "replurkers_count": 1
}
```

如果希望節省些傳輸流量的話，那麼建議在 OAuth 的請求當中，加入「&minimal\_data = 1」作為參數發送請求，伺服器回傳的資料格式當中將會省略一些資料，如 content\_raw 和任何 null 屬性的資料將會被省略，以下為回傳的範例：

```json
{"lang": "en", "posted": "Fri, 05 Jun 2009 23:07:13 GMT", "qualifier": "thinks", "plurk_id": 90812, "owner_id": 1, "content": "test me out", "user_id": 1, "is_unread": 1, "no_comments": 0, "plurk_type": 0}
```

JSON 格式縮排後：

```json
{
  "lang": "en",
  "posted": "Fri, 05 Jun 2009 23:07:13 GMT",
  "qualifier": "thinks",
  "plurk_id": 90812,
  "owner_id": 1,
  "content": "test me out",
  "user_id": 1,
  "is_unread": 1,
  "no_comments": 0,
  "plurk_type": 0
}
```

# 使用者資料

# 拿一個使用者資料來當範例

根據不同的請求，回傳的資料將會有所不同，以 responses 與 plurks 來說，回傳的資料量是最小的，範例如下：

```json
{"display_name": "amix3", "gender": 0, "nick_name": "amix", "has_profile_image": 1, "id": 1, "avatar": null}
```

JSON 格式縮排後：

```json
{
  "display_name": "amix3",
  "gender": 0,
  "nick_name": "amix",
  "has_profile_image": 1,
  "id": 1,
  "avatar": null
}
```

這還可以用來呈現少量的使用者資訊。

相較其他 API 的請求，例如查看朋友列表或個人資料，回傳的資料量將會更大量：

```json
{"display_name": "Alexey", "is_channel": 0, "nick_name": "Scoundrel", "has_profile_image": 1, "location": "Canada", "date_of_birth": "Sat, 19 Mar 1983 00:00:00 GMT", "relationship": "not_saying", "avatar": 3, "full_name": "Alexey Kovyrin", "gender": 1, "recruited": 6, "id": 5, "karma": 33.5}
```

JSON 格式縮排後：

```json
{
  "display_name": "Alexey",
  "is_channel": 0,
  "nick_name": "Scoundrel",
  "has_profile_image": 1,
  "location": "Canada",
  "date_of_birth": "Sat, 19 Mar 1983 00:00:00 GMT",
  "relationship": "not_saying",
  "avatar": 3,
  "full_name": "Alexey Kovyrin",
  "gender": 1,
  "recruited": 6,
  "id": 5,
  "karma": 33.5
}
```

資料格式說明：

+ id: 使用者的編號。
+ nick_name: 使用者唯一性的名稱，例如：amix。
+ display_name: 使用者非唯一性的名稱，例如：Amix S，並不為 null 時才會顯示。
+ premium: 以 Boolean 值顯示使用者目前是否有噗幣。
+ has_profile_image: 如果數值為 1，代表使用者有設置大頭貼，否則使用者尚未設置大頭貼，請使用預設大頭貼。
+ avatar: 使用者大頭貼的最新版本。
+ location: 使用者的居住地，例如：Aarhus Denmark.
+ default_lang: 使用者資料的語系。
+ date_of_birth: 使用者的出生年月日，請注意，出生年月日會以 UTC 時區來儲存，請不要轉換為當地時區，否則您可能會獲得錯誤的出生年月日。
+ bday_privacy: 使用者的出生年月日。
    + 0 => 隱藏生日日期及年齡。
    + 1 => 顯示生日日期，但不顯示出生年、年齡。
    + 2 => 顯示生日日期及年齡。
+ full_name: 使用者的全名，例如：Amir Salihefendic。
+ gender: 使用者的性別。 
    + 1 => 男生
    + 0 => 女生
    + 2 => 不顯示/其他
+ karma: 使用者 Karma 的數值。
+ recruited: 使用者成功募集的人數。
+ relationship: 使用者的感情/婚姻狀態。
    + not_saying => 不公開
    + single => 單身
    + married => 已婚
    + divorced => 再次恢復單身
    + engaged => 已訂婚
    + in_relationship => 有交往對象
    + complicated => 一言難盡
    + widowed => 喪偶
    + unstable_relationship => 不穩定交往中
    + open_relationship => 開放式關係

# 關於出生及年齡的隱私

+ 如果使用者將他的生日設定為隱藏(bday_privacy=0)，那麼 date_of_birth 的資料將會以 null 的方式回傳。
+ 如果使用者將他的年齡設定為隱藏(bday_privacy=1)，那麼 date_of_birth 的出生年將會更新為西元 1904 年的方式回傳。 

# 如何顯示大頭貼

如果您需要取得使用者大頭貼的 URL，那麼以 user_id 為使用者的 id，而 avatar 為大頭貼的版本。

如果 has_profile_image 的參數為 1，並且 avatar 的參數為 null，那麼大頭貼的 URL 為：

+ https://avatars.plurk.com/{user_id}-small.gif 
+ https://avatars.plurk.com/{user_id}-medium.gif 
+ https://avatars.plurk.com/{user_id}-big.jpg

如果 has_profile_image 的參數為 1，並且 avatar 的參數並不是 null，那麼大頭貼的 URL 為：

+ https://avatars.plurk.com/{user_id}-small{avatar}.gif 
+ https://avatars.plurk.com/{user_id}-medium{avatar}.gif 
+ https://avatars.plurk.com/{user_id}-big{avatar}.jpg

如果 has_profile_image 的參數為 0，那麼大頭貼的 URL 為：

+ https://www.plurk.com/static/default_small.gif 
+ https://www.plurk.com/static/default_medium.gif 
+ https://www.plurk.com/static/default_big.gif
