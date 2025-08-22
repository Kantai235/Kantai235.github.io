---
showTableOfContents: true
---

# 🛠️ カンタ、バックエンドエンジニアです。

## 経歴

{{< lead >}}
シニアバックエンドエンジニアとして、PHP と Laravel を用いた堅牢なアプリケーション開発を専門としています。私の技術領域はバックエンドに留まらず、Python と Flask によるマイクロサービスの構築にも精通しており、Swift および Kotlin でのネイティブアプリ開発経験も有しています。フルスタックの視点を持つ開発者です。

新しい言語機能やデザインパターンの探求に情熱を注ぎ、多様な技術的視点が優れたアーキテクチャ設計の基盤であると確信しています。開発哲学として、コードの長期的な価値を重視しています。既存プロジェクトでは、まず既存のアーキテクチャを尊重し、開発リズムの安定性を確保します。一方、新規プロジェクトの立ち上げ時には、初期段階でのアーキテクチャ設計に注力し、技術的負債を効果的に管理しながら、システムの拡張性と保守性を追求します。

ワークフローにおいては、Scrum の手法を用いて進捗管理を行うことを得意としています。個人作業でもチームでの協業でも、計画的にプロジェクトを推進できます。明確な目標設定とアジャイルな反復・調整を組み合わせることが、プロジェクト成功のベストプラクティスであると信じています。
{{< /lead >}}

---

## スキル概要

| カテゴリ | 技術・コンセプト | 習熟度 |
|---|---|---|
| バックエンド | **言語**: PHP, Python <br />**フレームワーク**: Laravel, Flask, Django <br />**データベース**: MySQL, MariaDB, PostgreSQL <br />**キャッシュ**: Redis | 得意 |
| フロントエンド | Vue.js, JavaScript (ES6+), SCSS, Webpack | やや得意 |
| モバイル開発 | Kotlin, Android SDK, Swift | 普通 |
| スクリプト・自動化 | Python, Flask | 普通 |
| 運用・ツール | Git, GitHub, GitHub Actions, Docker, Jenkins | 普通 |
| クラウド | AWS, GCP | 普通 |

### コアスキル

私のコアスキルはバックエンドシステム開発であり、アーキテクチャの堅牢性、保守性、そして将来的な拡張性に重点を置いています。
- **システムアーキテクチャと設計**：ドメイン駆動設計（DDD）を主軸に、API の設計・開発を主導し、コード構造の明確化とビジネス要件への密着を保証します。
- **パフォーマンスと信頼性**：負荷分散（ロードバランシング）や高可用性（ハイアベイラビリティ）システムの構築経験があり、高トラフィックの課題に対応し、サービスの安定稼働を確保します。
- **データベースと最適化**：ゼロからのデータベース設計、パフォーマンスボトルネックの分析、そして詳細なチューニングまでの実践的な経験を有しています。

### フロントエンド・バックエンド連携

バックエンドとフロントエンドの連携方法のモダン化を主導・実践してきました。その変遷は以下の通りです。
- **従来型の API フェーズ**：RESTful API の設計原則に精通し、フロントエンド（Vue/React など）が利用するための独立した API 開発を担当。
- **Livewire の導入**：特定のシナリオでの開発プロセスを簡素化するため、Laravel Livewire を導入。バックエンドでフロントエンドのインタラクションを直接制御することで、小規模プロジェクトや内部管理画面における API 開発・保守コストを効果的に削減。
- **Inertia.js の採用**：究極の開発効率とユーザー体験を追求する中で、Inertia.js を全面的に採用。このアーキテクチャにより、Laravel のコントローラが直接データを渡して Vue/React コンポーネントをレンダリングすることが可能になり、 **「API レス」** な開発モデルを実現。バックエンドフレームワークの強力な機能と、SPA の全ての利点を完璧に融合させました。

---

## オープンソースプロジェクト

### 純靠北工程師

エンジニアコミュニティ向けに構築された匿名の交流プラットフォーム。全てのエンジニアが職場の実態や個人の思いを安全かつ自由に共有できる空間を提供することを目指しています。

#### 主な機能

- **新着投稿ウォール**:
    コミュニティによる審査を通過した全ての投稿がここに表示されます。内容はエンジニアの職場での喜怒哀楽、技術的な知見、プロジェクトの挑戦や珍しいエピソードなど多岐にわたり、エンジニアのリアルな世界を垣間見て共感を得ることができます。

- **ピアレビューエリア**:
    当プラットフォーム最大の特徴です。全ての新規投稿はまずこのエリアに送られ、多くのコミュニティメンバーによる審査と投票を経て、「新着投稿ウォール」に掲載されるかが決まります。この仕組みにより、コンテンツの質とコミュニティの自治が保証されます。

- **クロスプラットフォームでのコンテンツ配信**:
    審査を通過した記事は、システムによって自動的に主要なソーシャルプラットフォーム（Facebook, Discord, Telegram, Plurk など）に同期・投稿され、各記事のリーチと影響力を最大化します。

{{< github repo="init-engineer/init.engineer" showThumbnail=false >}}

### PHP デザインパターン

31 種類ものデザインパターンを収録した、実践的なオープンソースのコードサンプル集。古典的な GoF の 23 パターンを網羅するだけでなく、作者独自のデザインパターンに対する見解や、多くの実用的な現代的パターンも取り入れています。

最大の特徴は、各パターンに対して完全なテストケースが記述されている点です。これにより、学習者はパターンの構造を理解するだけでなく、テストの作成と実行を通じて境界条件を検証し、パターンの責務に対する理解を深めることができます。アーキテクチャ設計とテスト能力を同時に向上させることができる優れたリソースです。

{{< github repo="Kantai235/php-design-pattern" showThumbnail=false >}}

### Laravel 高トラフィック・高同時接続研究

本プロジェクトは、従来型の MVC アーキテクチャが高同時接続下で直面するデータベースのボトルネックを対比させ、Redis キャッシュとメッセージキューを用いてリクエストを非同期化し、システムの疎結合化とトラフィックのピークシェービングを実現する方法を具体的に示しています。

最終的な目標は、瞬間的な高トラフィックにも余裕を持って対応できる堅牢なバックエンドアーキテクチャを構築し、同様のシナリオを扱う開発者に対して実行可能なアーキテクチャの青写真を提供することです。

{{< github repo="Kantai235/laravel-typical-high-load-example" showThumbnail=false >}}

---

## コミュニティボランティア

{{< timeline >}}
    {{< timelineItem header="マーケティングチームメンバー" badge="SITCON" subheader="2022 ~ 2024" >}}
        潜在的な協力パートナーの開拓を担当し、スポンサー、メディア、コミュニティパートナーとの関係を積極的に構築・維持しました。分野を超えた協力とプロモーションを通じて、SITCON カンファレンスのブランド露出と一般参加者の増加に成功しました。
    {{< /timelineItem >}}
    
    {{< timelineItem header="メディアパートナー" badge="SITCON" subheader="2022 ~ 2023" >}}
        「純靠北工程師」の代表として SITCON のメディアパートナーを務めました。自身のコミュニティプラットフォームの影響力を活用し、カンファレンスの議題に関する情報発信やインタラクションを行い、SITCON がより多様な層の潜在的参加者にリーチできるよう支援し、ブランドの認知度を拡大しました。
    {{< /timelineItem >}}

    {{< timelineItem header="登壇者" badge="SITCON Hour of Code" subheader="2020" >}}
        Hour of Code は、あらゆる年齢層を対象としたプログラミング体験イベントです。一般の人々にとって謎に包まれた「プログラミング」のベールを剥がし、1 時間で簡単なゲーム体験を通じてプログラミングの不思議な魔力を理解し、あらゆる年齢層の方々がイベントでプログラミングの楽しさを知ることを目的としています。
    {{< /timelineItem >}}

    {{< timelineItem header="パネルディスカッション登壇者" badge="MOPCON" subheader="2020" >}}
        「サイドプロジェクト」をテーマにしたパネルディスカッションに招待されました。問題を見つけたら解決策を探し始めるのは、多くのエンジニアにとって既に習慣となっています。日常生活、社会、あるいは友人とプレイするオンラインゲームであれ。問題解決スキルを持つエンジニアとして、どのように問題の核心を見抜き、自他を助けるプログラムを開発するのか？また、それらのプロジェクトをどのように維持していくのか？さらには収益を得ることも！サイドプロジェクトとは一体どういうものなのか、一緒に語り合いましょう！
    {{< /timelineItem >}}

    {{< timelineItem header="セッション登壇者" badge="MOPCON" subheader="2019" >}}
        「『純靠北工程師』の技術的進化の道」というテーマで講演しました。このプロジェクトが初期の単純なアーキテクチャから、高トラフィックと複雑な要求に対応するために、どのようなプロセスと成長を経て、技術選定やアーキテクチャの意思決定で反復を重ね、最終的に堅牢なコミュニティサービスシステムへと進化したかを共有しました。
    {{< /timelineItem >}}
{{< /timeline >}}

---

## お問い合わせ

私の技術経験にご興味がある方、または技術的な交流をご希望の方は、以下の方法でお気軽にご連絡ください：

Email: kantai.developer@gmail.com

<div class="social-buttons">
  <a href="mailto:kantai.developer@gmail.com" class="btn btn-email">
    {{< icon "email" >}} Email
  </a>
  
  <a href="https://www.facebook.com/kantai.zeng" target="_blank" class="btn btn-facebook">
    {{< icon "facebook" >}} Facebook
  </a>
  
  <a href="https://www.plurk.com/huevo235" target="_blank" class="btn btn-plurk">
    {{< icon "star" >}} Plurk
  </a>
  
  <a href="https://www.threads.com/@init.engineer" target="_blank" class="btn btn-threads">
    {{< icon "threads" >}} Threads
  </a>
  
  <a href="https://x.com/KantaiDeveloper" target="_blank" class="btn btn-x">
    {{< icon "x-twitter" >}} X / Twitter
  </a>
  
  <a href="https://github.com/Kantai235" target="_blank" class="btn btn-github">
    {{< icon "github" >}} GitHub
  </a>
  
  <a href="https://t.me/KantaiDeveloper" target="_blank" class="btn btn-telegram">
    {{< icon "telegram" >}} Telegram
  </a>
</div>

<style>
/* 社群按鈕樣式 */
.social-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.social-buttons .btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.5rem !important;
  text-decoration: none !important;
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
}

.social-buttons .btn svg {
  width: 1.25rem !important;
  height: 1.25rem !important;
  flex-shrink: 0 !important;
}

.social-buttons .btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

/* 各社群平台顏色 */
.btn-email {
  background-color: #EA4335 !important;
  color: white !important;
}

.btn-facebook {
  background-color: #1877F2 !important;
  color: white !important;
}

.btn-plurk {
  background-color: #FF7900 !important;
  color: white !important;
}

.btn-threads {
  background-color: #000000 !important;
  color: white !important;
}

.btn-x {
  background-color: #000000 !important;
  color: white !important;
}

.btn-github {
  background-color: #333333 !important;
  color: white !important;
}

.btn-telegram {
  background-color: #0088CC !important;
  color: white !important;
}
</style>