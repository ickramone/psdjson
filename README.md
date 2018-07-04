# psdjson
Adobe ExtendScript でJSONを扱う

Photoshopのスクリプトで座標などの情報をJSONへ書き出したい
通常Javascriptでは　JSON.stringify()　を使うと書き出せるみたいなんですが、
PhotoshopなどのAdobeExtendScriptではそのまま使えない
ので、
https://github.com/douglascrockford/JSON-js
などからJSON用のライブラリを落としてきて、
それを参照して使う
https://forums.adobe.com/thread/2414420
フォーラムを参照
