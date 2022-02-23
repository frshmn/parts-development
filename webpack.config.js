// mini-css-extract-pluginの読み込み
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 定数MODEに'production'か'development'どちらかを代入します
// 'production'モードではファイルは圧縮して最適化され、'development'の場合は圧縮されず、デバッグに便利なソースマップが出力されます
const MODE = "production";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

module.exports = {
  // modeの値は上記の定数で管理
  mode: MODE,

  // 処理の起点となるエントリポイントの指定
  entry: "./src/index.js",

  // 出力先(アウトプット)の指定
  output: {
    // ディレクトリの指定をします。dist内に出力します
    // __dirname変数は、このファイルが格納されているディレクトリのパスを取得できます
    path: `${__dirname}/dist`,
    // 出力するファイル名を指定します
    filename: 'global.js'
  },

  // ローダー機能。rules内に各ローダーの処理を明記して使用します。ローダーは下から上に処理が走ります。
  module: {
    rules: [
      {
        // 拡張子が.jsの場合
        test: /\.js$/,
        use: [
          {
            // BabelによるJsのトランスパイル機能を利用
            loader: "babel-loader",
            // オプションの設定
            options: {
              presets: [
                // プリセットを指定することで、ECMAScript5に変換
                "@babel/preset-env",
              ],
            },
          },
        ],
      },

      {
        // 拡張子がscssまたはcssの場合の処理
        test: /\.(scss|css)$/,
        use: [
          // Jsファイルに取り込まれたCSSをDOM要素へ注入するローダー
          "style-loader",

          // mini-css-extract-pluginプラグインを使用してCSSを別ファイルに書き出します。
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },

          {
            // Jsファイル内に書かれたCSSを取り込む機能
            loader: "css-loader",
            // オプションの指定
            options: {
              // CSSのurl()値のメディアを取り込むのを禁止
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2,
            },
          },

          {
            // SassをCSSへトランスパイルする機能
            loader: "sass-loader",
            // オプションの指定
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
    ],
  },

  // プラグイン
  plugins: [
    // CSSファイルを外出しにするプラグイン
    new MiniCssExtractPlugin({
      // 出力するファイル名の指定
      filename: "global.css",
    }),
  ],

  // どの環境に最適化するかを指定。webはブラウザ環境、es5はECMAScript5です。指定した環境に合わせたトランスパイルを行います。
  target: ["web", "es6"],

};
