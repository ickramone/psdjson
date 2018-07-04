// JSONを使用可能にするためライブラリを読み込む
#include "lib/json2.js"

$.appEncoding = "UTF-8";

app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.POINTS;
/*
■レイヤーを取得、座標を取得、配列に格納
・開いているドキュメントのレイヤーの個数を取得
・Forで順番に各レイヤーを取得
・レイヤーセットがあったら再帰的にレイヤーを取得
・取得したレイヤーの座標を取得
・座標を配列に入れる　Arr = [pos];
[Layer名：[x]:X\,[y]:y, Layer名：[x]:X\,[y]:y]

■配列の個数分テキストレイヤーを作成、
・配列個数分新規レイヤーを作成する for ( i = 0; i < pos.length; i++)
・レイヤーのタイプをテキストに変更
・テキストレイヤーに座標を代入
・ポジションを代入
・Y座標を作成個数ごとずらす　var posY = 0; Array(100, 30 * [i] + 30);
・スタイルを適用
*/

//メインスクリプトはここから
CreateTextLayers();

function CreateTextLayers() {
  var arr = []; //テキストレイヤーに渡す配列
  var findLayer = function(layers) {
    //レイヤー分だけループ
    for (var i = 0; i < layers.length; i++) {
      var item = layers[i]; //レイヤーを取得
      // var name = layers[i].name; //名前を取得
      var name = layers[i].name.replace(/\s/g, "");
      //$.writeln(name);
      var type = layers[i].kind; //レイヤータイプ
      var docw = activeDocument.width.value; //ドキュメントの横幅
      var posxy = layers[i].bounds; // 座標を取得
      var w = parseInt(posxy[2] - posxy[0]);
      var h = parseInt(posxy[3] - posxy[1]);
      var x = parseInt(posxy[0]); //x座標
      var x2 = parseInt(posxy[0] - (docw / 2)); //x座標　ドキュメントのセンターから
      var y = parseInt(posxy[1]);
      pos = x + " " + y + " W:" + w + " H:" + h;
      //レイヤーの種類がテキストレイヤーだった場合、
      if (type === LayerKind.TEXT) {
        var fntsize = parseInt(item.textItem.size) + "px "; //テキストサイズ
        var justifi = item.textItem.justification; //justification.CENTER RIGHT LEFT
        if (justifi === Justification.CENTER) {
          justifi = "center";
        } else if (justifi === Justification.LEFT) {
          justifi = "left";
        } else {
          justifi = "right";
        }
        //名前を追加
        arr.push(fntsize + " " + justifi + " " + pos);
      } else {
        arr.push(name + " " + pos);
        //alert(name + " " + pos);
      }
      //フォルダだったら中身の捜索(再帰呼び出し)
      if (item.typename == "LayerSet") {
        found_item = findLayer(item.layers);
        if (found_item) {
          //子レイヤーがあれば、結合
          arr = arr.concat(found_item);
        }
      }
    }
    //return arr;
  }

  var doc = app.activeDocument; //アクティブドキュメントを取得
  var layers = findLayer(doc.layers); //レイヤー名を取得
  var doclay = doc.artLayers; //レイヤー
  var posY = 0; //初期テキストレイヤーのYポジション
  // リターン（改行）コードを変数に指定
  // var CR = String.fromCharCode(13);
  //■配列の個数分テキストレイヤーを作成
  for (var i = 0; i < arr.length; i++) {
    var newLay = doclay.add(); // 新規レイヤー
    // テキストレーヤーに文字を入力する
    newLay.kind = LayerKind.TEXT; // レイヤー種別をテキストレイヤーに設定
    var result = arr[i].match(/\s[-\d]{1,4}/g);
    //$.writeln(result + " " + result[0] + " " + result[1]);
    newLay.textItem.position = Array(result[0], result[1]); // レイヤー位置を指定 マッチした配列から取得する
    newLay.textItem.size = 15; // フォントサイズ。
    var txt = arr[i].match(/[0-9]px/); //数字のあとにpxが続く文字にマッチ
    if (txt) {
      //色指定
      var txtClrGrn = new SolidColor;
      // textColor.rgb.red = 136;
      // textColor.rgb.green = 255;
      // textColor.rgb.blue = 120;
      txtClrGrn.rgb.hexValue = '88ff78'; // Hexで指定 薄緑
      newLay.textItem.color = txtClrGrn; // フォント色適用
    } else {
      var txtClrWh = new SolidColor;
      // textColor.rgb.red = 200;
      // textColor.rgb.green = 200;
      // textColor.rgb.blue = 200;
      txtClrWh.rgb.hexValue = 'FAFAFA'; // Hexで指定
      newLay.textItem.color = txtClrWh; // フォント色適用
    }



    /* 色指定
      var textColor = new SolidColor;
      // textColor.rgb.red = 200;
      // textColor.rgb.green = 200;
      // textColor.rgb.blue = 200;
      textColor.rgb.hexValue = 'FAFAFA'; // Hexで指定
      newLay.textItem.color = textColor; // フォント色
      */
    newLay.textItem.font = "mplus-2c-regular"; // フォント名(postScriptNam名)
    // newLay.name = writeText; //レイヤー名
    // テキストレイヤーに文字列を格納
    newLay.textItem.contents = arr[i];
    //レイヤースタイルを適用
    txtStyle();
    // layerObj[0].applyStyle("TerraPOStext");
    // alert("CreateTextLayers\n"+layers.join("\n"));//一覧を表示
  }

  var jsonText = JSON.stringify(arr, undefined , "\t");
  filename = File.saveDialog("保存ファイル名を入れて下さい");
  if (filename) {
    fileObj = new File(filename);
    flag = fileObj.open("w");
    if (flag == true) {
      // text = "こんな具合にファイルに書き出せます。";
      fileObj.write(jsonText);
      fileObj.close();
    } else {
      alert("ファイルが開けませんでした");
    }
  }
}





// ============テキストレイヤーのスタイルを追加=============
function txtStyle() {
  var idsetd = charIDToTypeID("setd");
  var desc4 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref1 = new ActionReference();
  var idPrpr = charIDToTypeID("Prpr");
  var idLefx = charIDToTypeID("Lefx");
  ref1.putProperty(idPrpr, idLefx);
  var idLyr = charIDToTypeID("Lyr ");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref1.putEnumerated(idLyr, idOrdn, idTrgt);
  desc4.putReference(idnull, ref1);
  var idT = charIDToTypeID("T   ");
  var desc5 = new ActionDescriptor();
  var idScl = charIDToTypeID("Scl ");
  var idPrc = charIDToTypeID("#Prc");
  desc5.putUnitDouble(idScl, idPrc, 100.000000);
  var idDrSh = charIDToTypeID("DrSh");
  var desc6 = new ActionDescriptor();
  var idenab = charIDToTypeID("enab");
  desc6.putBoolean(idenab, true);
  var idpresent = stringIDToTypeID("present");
  desc6.putBoolean(idpresent, true);
  var idshowInDialog = stringIDToTypeID("showInDialog");
  desc6.putBoolean(idshowInDialog, true);
  var idMd = charIDToTypeID("Md  ");
  var idBlnM = charIDToTypeID("BlnM");
  var idMltp = charIDToTypeID("Mltp");
  desc6.putEnumerated(idMd, idBlnM, idMltp);
  var idClr = charIDToTypeID("Clr ");
  var desc7 = new ActionDescriptor();
  var idRd = charIDToTypeID("Rd  ");
  desc7.putDouble(idRd, 0.000000);
  var idGrn = charIDToTypeID("Grn ");
  desc7.putDouble(idGrn, 0.000000);
  var idBl = charIDToTypeID("Bl  ");
  desc7.putDouble(idBl, 0.000000);
  var idRGBC = charIDToTypeID("RGBC");
  desc6.putObject(idClr, idRGBC, desc7);
  var idOpct = charIDToTypeID("Opct");
  var idPrc = charIDToTypeID("#Prc");
  desc6.putUnitDouble(idOpct, idPrc, 75.000000);
  var iduglg = charIDToTypeID("uglg");
  desc6.putBoolean(iduglg, true);
  var idlagl = charIDToTypeID("lagl");
  var idAng = charIDToTypeID("#Ang");
  desc6.putUnitDouble(idlagl, idAng, 120.000000);
  var idDstn = charIDToTypeID("Dstn");
  var idPxl = charIDToTypeID("#Pxl");
  desc6.putUnitDouble(idDstn, idPxl, 2.000000);
  var idCkmt = charIDToTypeID("Ckmt");
  var idPxl = charIDToTypeID("#Pxl");
  desc6.putUnitDouble(idCkmt, idPxl, 0.000000);
  var idblur = charIDToTypeID("blur");
  var idPxl = charIDToTypeID("#Pxl");
  desc6.putUnitDouble(idblur, idPxl, 2.000000);
  var idNose = charIDToTypeID("Nose");
  var idPrc = charIDToTypeID("#Prc");
  desc6.putUnitDouble(idNose, idPrc, 0.000000);
  var idAntA = charIDToTypeID("AntA");
  desc6.putBoolean(idAntA, false);
  var idTrnS = charIDToTypeID("TrnS");
  var desc8 = new ActionDescriptor();
  var idNm = charIDToTypeID("Nm  ");
  desc8.putString(idNm, "Linear");
  var idCrv = charIDToTypeID("Crv ");
  var list1 = new ActionList();
  var desc9 = new ActionDescriptor();
  var idHrzn = charIDToTypeID("Hrzn");
  desc9.putDouble(idHrzn, 0.000000);
  var idVrtc = charIDToTypeID("Vrtc");
  desc9.putDouble(idVrtc, 0.000000);
  var idCrPt = charIDToTypeID("CrPt");
  list1.putObject(idCrPt, desc9);
  var desc10 = new ActionDescriptor();
  var idHrzn = charIDToTypeID("Hrzn");
  desc10.putDouble(idHrzn, 255.000000);
  var idVrtc = charIDToTypeID("Vrtc");
  desc10.putDouble(idVrtc, 255.000000);
  var idCrPt = charIDToTypeID("CrPt");
  list1.putObject(idCrPt, desc10);
  desc8.putList(idCrv, list1);
  var idShpC = charIDToTypeID("ShpC");
  desc6.putObject(idTrnS, idShpC, desc8);
  var idlayerConceals = stringIDToTypeID("layerConceals");
  desc6.putBoolean(idlayerConceals, true);
  var idDrSh = charIDToTypeID("DrSh");
  desc5.putObject(idDrSh, idDrSh, desc6);
  var idFrFX = charIDToTypeID("FrFX");
  var desc11 = new ActionDescriptor();
  var idenab = charIDToTypeID("enab");
  desc11.putBoolean(idenab, true);
  var idpresent = stringIDToTypeID("present");
  desc11.putBoolean(idpresent, true);
  var idshowInDialog = stringIDToTypeID("showInDialog");
  desc11.putBoolean(idshowInDialog, true);
  var idStyl = charIDToTypeID("Styl");
  var idFStl = charIDToTypeID("FStl");
  var idOutF = charIDToTypeID("OutF");
  desc11.putEnumerated(idStyl, idFStl, idOutF);
  var idPntT = charIDToTypeID("PntT");
  var idFrFl = charIDToTypeID("FrFl");
  var idSClr = charIDToTypeID("SClr");
  desc11.putEnumerated(idPntT, idFrFl, idSClr);
  var idMd = charIDToTypeID("Md  ");
  var idBlnM = charIDToTypeID("BlnM");
  var idNrml = charIDToTypeID("Nrml");
  desc11.putEnumerated(idMd, idBlnM, idNrml);
  var idOpct = charIDToTypeID("Opct");
  var idPrc = charIDToTypeID("#Prc");
  desc11.putUnitDouble(idOpct, idPrc, 100.000000);
  var idSz = charIDToTypeID("Sz  ");
  var idPxl = charIDToTypeID("#Pxl");
  desc11.putUnitDouble(idSz, idPxl, 2.000000);
  var idClr = charIDToTypeID("Clr ");
  var desc12 = new ActionDescriptor();
  var idRd = charIDToTypeID("Rd  ");
  desc12.putDouble(idRd, 0.000000);
  var idGrn = charIDToTypeID("Grn ");
  desc12.putDouble(idGrn, 0.000000);
  var idBl = charIDToTypeID("Bl  ");
  desc12.putDouble(idBl, 0.000000);
  var idRGBC = charIDToTypeID("RGBC");
  desc11.putObject(idClr, idRGBC, desc12);
  var idoverprint = stringIDToTypeID("overprint");
  desc11.putBoolean(idoverprint, false);
  var idFrFX = charIDToTypeID("FrFX");
  desc5.putObject(idFrFX, idFrFX, desc11);
  var idLefx = charIDToTypeID("Lefx");
  desc4.putObject(idT, idLefx, desc5);
  executeAction(idsetd, desc4, DialogModes.NO);
}
