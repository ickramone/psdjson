# psdjson
### Adobe ExtendScript でJSONを扱う

Photoshopのスクリプトで座標などの情報をJSONへ書き出したい
通常Javascriptでは　JSON.stringify()　を使うと書き出せるみたいなんですが、
PhotoshopなどのAdobeExtendScriptではそのまま使えない
ので、
https://github.com/douglascrockford/JSON-js
などからJSON用のライブラリを落としてきて、
それを参照して使う
https://forums.adobe.com/thread/2414420
フォーラムを参照

外部JSXファイルのインクルード方法
`#include "file1.jsxinc;folder/file2.jsxinc"`
http://d.hatena.ne.jp/chalcedony_htn/20150220/1424439182

`JSON.stringify(value[, replacer[, space]])`

* value
JSON 文字列に変換する値。オブジェクトや配列

* replacer 任意
もし関数である場合、文字列化の間に出会った値とプロパティを変換します。
もし配列である場合は、配列で指定したkeyだけフィルターされます。

* space 任意
結果の文字列を整形して出力します。数字だとスペースの量、文字"\t"とかだとタブでインデントしてくれる

`　　　　var jsonText = JSON.stringify(arr, undefined , "\t");`  
`　　　　filename = File.saveDialog("保存ファイル名を入れて下さい");`  
`　　　　if (filename) {`  
`　　　　　　fileObj = new File(filename);`  
`　　　　　　flag = fileObj.open("w");`  
`　　　　　　　　if (flag == true) {`  
`　　　　　　　　// text = "こんな具合にファイルに書き出せます。";`  
`　　　　　　　　fileObj.write(jsonText);`  
`　　　　　　　　fileObj.close();`  
`　　　　　　　　} else {`  
`　　　　　　　　alert("ファイルが開けませんでした");`  
`　　　　　　}`  
`　　　　}`  
