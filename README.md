# Family Albums - Timeless Memories, Elegantly Preserved

![Family Albums](https://img.shields.io/badge/Style-Old_Money_Luxury-B8975A?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Prototype-2C2416?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Yes-F5F1E8?style=for-the-badge)

**New Japan × Kinfolk** aesthetic meets **Old Money luxury** in this elegant family album website.

---

## 🎨 デザインコンセプト

このプロジェクトは、**New Japan**のマガジンスタイルカルーセルと**Kinfolk**のミニマリストエディトリアルデザインを融合させた、高級感溢れる家族アルバムサイトです。

### デザインの特徴

- 📖 **Magazine-style Carousel** - 雑誌が横に並ぶ3Dカバーフロー
- 📕 **Book Opening Animation** - クリック時の本が開くアニメーション
- 🖼️ **Kinfolk Editorial Layout** - 大きな写真と巨大なタイポグラフィ
- ✨ **Old Money Aesthetic** - ウォームベージュ × ゴールドアクセント
- 🎯 **Generous White Space** - 贅沢な余白使い

---

## 🎭 現在実装されている機能

### ✅ TOPページ
- [x] エレガントなヒーローセクション
  - "Family Albums" タイトル
  - "Timeless Memories, Elegantly Preserved" タグライン
- [x] 3Dカバーフローカルーセル（Swiper.js）
  - 横スワイプ対応
  - 自動再生
  - ホバーエフェクト（1.02x zoom）
- [x] 4つのサンプルアルバム
  - Yaeyama Islands（八重山諸島）
  - Alps Winter Retreat（アルプス）
  - Tuscan Harvest（トスカーナ）
  - Kyoto Spring（京都の桜）
- [x] "Create My Album" CTAボタン

### ✅ アルバム詳細ページ
- [x] 本が開くトランジションアニメーション
- [x] 大きなセリフフォント見出し（80-120px）
- [x] ロケーション・年・キャッチフレーズ表示
- [x] 縦スクロール写真ギャラリー
  - 各写真80%幅
  - 120pxの余白
  - フェードインアニメーション
  - パララックス効果
- [x] "Back to Gallery" ボタン

### ✅ アルバム作成ページ ✨NEW
- [x] クラシカルな入力フォーム（全て英語）
  - Album Title（アルバムタイトル）
  - Catchphrase（キャッチフレーズ）
  - Country（国名）
  - Year（年）
  - Season or Month（季節・月）
  - Date Range（日付範囲）
- [x] 写真アップロード機能
  - ドラッグ&ドロップ対応
  - Browse Files ボタン
  - 6-12枚の写真
  - 最大10MB/枚
  - リアルタイムプレビュー
  - 削除機能
  - 最初の写真が自動的にカバー画像に
- [x] LocalStorage保存機能
- [x] バリデーション機能

### ✅ インタラクション
- [x] スムーズなページ遷移
- [x] キーボードナビゲーション（ESC/矢印キー）
- [x] タッチジェスチャー対応
- [x] レスポンシブデザイン（デスクトップ/タブレット/モバイル）

---

## 🎨 カラーパレット（Old Money）

```css
Primary Background:   #F5F1E8  /* ウォームベージュ */
Secondary Background: #E8E3D6  /* ライトタン */
Text Primary:         #1A1511  /* ほぼ黒 */
Text Secondary:       #6B5D52  /* ミッドトーン */
Gold Accent:          #B8975A  /* 控えめなゴールド */
Dark Accent:          #2C2416  /* ダークブラウン */
```

---

## 📐 タイポグラフィ

### 使用フォント

- **見出し**: Playfair Display / EB Garamond（セリフ）
- **イタリック**: EB Garamond（キャッチフレーズ）
- **ボディ/UI**: Inter（サンセリフ）

### サイズ指定

```
Main Title (Top):      60-120px
Album Title (Detail):  60-120px  
Subtitle:              16-24px
Catchphrase:           20-32px
Body:                  14-16px
```

---

## 🗂️ ファイル構成

```
family-albums/
├── index.html              # メインHTMLファイル
├── create.html            # アルバム作成ページ ✨NEW
├── css/
│   ├── style.css          # スタイルシート（Old Money デザイン）
│   └── create.css         # 作成ページスタイル ✨NEW
├── js/
│   ├── main.js            # JavaScript（カルーセル、アニメーション）
│   └── create.js          # アップロードロジック ✨NEW
├── images/
│   ├── yaeyama-cover.jpg  # アルバムカバー画像
│   ├── alps-cover.jpg
│   ├── tuscany-cover.jpg
│   ├── kyoto-cover.jpg
│   ├── yaeyama-1.jpg      # ギャラリー画像
│   ├── yaeyama-2.jpg
│   └── ...                # 各アルバム6枚ずつ
└── README.md              # このファイル
```

---

## 🚀 使い方

### 1. ローカル環境で開く

```bash
# プロジェクトフォルダをダウンロード
cd family-albums

# Live Serverなどで開く（推奨）
# または直接 index.html をブラウザで開く
```

### 2. カルーセルの操作

- **マウス**: ドラッグして左右にスワイプ
- **キーボード**: ← → 矢印キー
- **タッチ**: スマホで左右スワイプ

### 3. アルバムを開く

- カバーをクリック → 本が開くアニメーション → 詳細ページ
- ESCキー または "Back to Gallery" でトップへ戻る

---

## 📱 レスポンシブ対応

### デスクトップ（1024px以上）
- カルーセル: 3枚同時表示（3D Coverflow）
- 写真: 80%幅
- タイトル: 120px

### タブレット（768-1024px）
- カルーセル: 2-3枚表示
- 写真: 85%幅
- タイトル: 80px

### モバイル（768px以下）
- カルーセル: 1枚ずつ表示
- 写真: 100%幅
- タイトル: 48px
- 余白は削らない（ラグジュアリー維持）

---

## 🎯 技術スタック

### フロントエンド
- HTML5
- CSS3（CSS Variables、Flexbox、Grid、Animations）
- Vanilla JavaScript（ES6+）

### ライブラリ
- [Swiper.js v11](https://swiperjs.com/) - カルーセル
- [Google Fonts](https://fonts.google.com/) - Playfair Display, EB Garamond, Inter
- [Unsplash](https://unsplash.com/) - 高品質画像

### アニメーション
- CSS Transitions（0.4-0.6s ease-out）
- CSS Keyframe Animations
- JavaScript Scroll Effects（パララックス）

---

## ⚠️ まだ実装されていない機能

### Phase 2: アルバム表示機能
- [ ] LocalStorageから作成したアルバムを読み込み
- [ ] カルーセルに動的に追加
- [ ] 作成したアルバムの詳細表示

### Phase 3: 顔ぼかし機能（裏で開発中）
- [ ] 自動顔検出（TensorFlow.js / Google Cloud Vision API）
- [ ] 手動ぼかし調整UI
- [ ] ぼかしプレビュー
- [ ] 精度向上（正面顔95%、横顔70-80%）

### Phase 4: シェア機能
- [ ] URL生成
- [ ] SNSシェアボタン（Twitter, Facebook, Line）
- [ ] QRコード生成
- [ ] パスワード保護

### Phase 5: その他
- [ ] アルバム編集機能
- [ ] アルバム削除
- [ ] 複数アルバム管理
- [ ] PDFエクスポート
- [ ] 印刷最適化

---

## 🎬 アニメーション詳細

### Book Opening Animation
```javascript
// 1.2秒のトランジション
0.0s → 透明度0、回転0度
0.6s → 透明度1、回転-15度（本が開き始める）
1.2s → 透明度0、回転-90度（完全に開く）
```

### Photo Gallery Fade-In
```javascript
// 0.1秒ずつ順番に表示
photo-1: delay 0.1s
photo-2: delay 0.2s
photo-3: delay 0.3s
...
```

### Parallax Scroll Effect
```javascript
// スクロールに応じて写真が少し動く
translateY = (scrollPercent - 0.5) × 30px
```

---

## 🎨 デザイン参考サイト

このプロジェクトは以下のサイトからインスピレーションを得ています：

1. **Kinfolk Magazine** (kinfolk.com)
   - ミニマリストエディトリアル
   - 大きな写真 + シンプルな文字
   - 余白の美学

2. **The New Japan Magazine**
   - 雑誌表紙のレイアウト
   - トップのビジュアル

3. **Awwwards受賞サイト**
   - Editorial New
   - CLAIRE
   - Kove®

---

## 🛠️ 推奨される次のステップ

### 優先度：高
1. **作成したアルバムの表示機能** ✨実装中
   - LocalStorageからアルバム読み込み
   - カルーセルに動的追加
   - 詳細ページ表示

2. **モバイル体験の最適化**
   - タッチジェスチャーの改善
   - スワイプナビゲーション

### 優先度：中
3. **顔ぼかし機能（自動 + 手動調整）**
   - TensorFlow.js + BlazeFace
   - 手動調整UI

4. **シェア機能**
   - URLベースの共有
   - SNSシェアボタン

### 優先度：低
5. **追加アルバムテンプレート**
   - 異なるレイアウトパターン
   - カスタマイズ可能なカラーテーマ

6. **パフォーマンス最適化**
   - 画像の遅延読み込み（実装済み）
   - WebP形式への対応
   - CDN活用

---

## 📊 現在のプロジェクト状態

### 完成度: 75%

| カテゴリ | 進捗 |
|---------|------|
| デザイン | ████████░░ 80% |
| フロントエンド | ████████░░ 80% |
| アニメーション | ████████░░ 80% |
| レスポンシブ | ████████░░ 80% |
| 入力機能 | ████████░░ 80% ✨ |
| 顔ぼかし | ░░░░░░░░░░ 0% |
| シェア機能 | ░░░░░░░░░░ 0% |

---

## 🎯 デモアルバム

現在、以下の4つのサンプルアルバムが用意されています：

### 1. Yaeyama Islands（八重山諸島）
- **期間**: Summer 2025
- **場所**: Okinawa, Japan
- **キャッチ**: "Where turquoise waters meet ancient traditions"
- **写真数**: 6枚

### 2. Alps Winter Retreat（アルプス）
- **期間**: December 2024
- **場所**: Switzerland
- **キャッチ**: "Serenity in the snow"
- **写真数**: 6枚

### 3. Tuscan Harvest（トスカーナ）
- **期間**: Autumn 2024
- **場所**: Italy
- **キャッチ**: "Golden hills and timeless beauty"
- **写真数**: 6枚

### 4. Kyoto Spring（京都の桜）
- **期間**: April 2024
- **場所**: Kyoto, Japan
- **キャッチ**: "When sakura petals dance in the wind"
- **写真数**: 6枚

---

## 🐛 既知の問題

現時点で特に問題はありませんが、以下は今後の改善点：

1. **画像読み込み速度**
   - Unsplashの画像は初回読み込みが遅い場合がある
   - → WebP形式への変換を推奨

2. **iOS Safari**
   - パララックス効果が一部制限される可能性
   - → フォールバック処理を追加予定

3. **IE11対応**
   - 現在は非対応（CSS Variables使用）
   - → 必要であればポリフィル追加

---

## 💡 カスタマイズ方法

### カラーパレットの変更

`css/style.css` の `:root` セクションを編集：

```css
:root {
    --color-bg-primary: #F5F1E8;     /* あなたの色 */
    --color-accent-gold: #B8975A;    /* アクセントカラー */
    /* ... */
}
```

### アルバムデータの追加

`js/main.js` の `albumsData` オブジェクトに追加：

```javascript
const albumsData = {
    // 新しいアルバム
    newalbum: {
        id: 'newalbum',
        title: 'YOUR ALBUM TITLE',
        subtitle: 'Location · Year',
        catchphrase: '"Your catchphrase here"',
        photos: [
            { url: 'images/your-1.jpg', caption: 'Date' },
            // ...
        ]
    }
};
```

---

## 📞 サポート・お問い合わせ

質問や提案がありましたら、以下までご連絡ください：

- **GitHub Issues**: [プロジェクトページ]
- **Email**: [your-email@example.com]

---

## 📜 ライセンス

このプロジェクトはプロトタイプです。商用利用する場合は、使用している画像のライセンスを確認してください。

- **コード**: MIT License
- **画像**: Unsplash License（商用利用可、クレジット不要）
- **フォント**: Google Fonts（SIL Open Font License）

---

## 🙏 クレジット

### デザインインスピレーション
- [Kinfolk Magazine](https://www.kinfolk.com/)
- [Awwwards](https://www.awwwards.com/)

### 技術
- [Swiper.js](https://swiperjs.com/)
- [Google Fonts](https://fonts.google.com/)
- [Unsplash](https://unsplash.com/)

---

## 🌟 最後に

このプロジェクトは、**New Japan**の雑誌スタイルと**Kinfolk**のミニマリストエディトリアルデザインを組み合わせ、**Old Money**の上品さを表現した家族アルバムサイトです。

**Timeless Memories, Elegantly Preserved** 🎭

---

Made with ❤️ for luxury and simplicity
