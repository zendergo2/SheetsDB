function doGet() {
  return ContentService.createTextOutput('Hello, world!');
}

function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Sheet to HTML', 'showHtmlGen')
      .addItem('Sheet to JSON', 'showJsonGen')
      .addItem('Send Data to URL', 'sendData')
      .addToUi();
}
function onInstall(e) {
  onOpen(e);
}

function showHtmlGen() {
  var ui = HtmlService.createTemplateFromFile('HtmlGen')
      .evaluate()
      .setTitle('Sheet to HTML');
  SpreadsheetApp.getUi().showDialog(ui);
}

function showJsonGen() {
  var ui = HtmlService.createTemplateFromFile('JsonGen')
      .evaluate()
      .setTitle('Sheet to JSON')
      .setHeight(500);
  SpreadsheetApp.getUi().showDialog(ui);
}

function sendData() {
  var ui = HtmlService.createTemplateFromFile('SendData')
      .evaluate()
      .setTitle('Send Data to URL');
  SpreadsheetApp.getUi().showModalDialog(ui, 'SendData2');
}

function saveJSONSettings (input) {
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperties({
    'json_cols': input.cols,
    'json_heads': input.heads,
    'json_incl': input.incl,
    'json_not-incl': input['not-incl'],
    'json_items': input.items,
  });
  return true;
}

function saveHTMLSettings (input) {
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperties({
    'html_cols': input.cols,
    'html_heads': input.heads,
    'html_incl': input.incl,
    'html_not-incl': input['not-incl'],
    'html_items': input.items,
  });
  return true;
}


function loadSettings (callback) {
  return PropertiesService.getDocumentProperties().getProperties();
}


function getHtml(input) {
  var data = getData(input),
      result = '<table class="gdocs-table"><thead><tr>',
      i = 0;
  //build header
  while (data[i]) {
   result += '<th>'+data[i].head+'</th>';
    ++i;
  }
  result += '</tr></thead><tbody>';
  //build rows (for each of n rows, make i cols)
  for (var n = 0; n < input['items']; ++n) {
    i = 0;
    result += '<tr>';
    while (data[i]) {
      if (data[i].link && data[i].links[n] != undefined) {
        result += '<td><a href="' +data[i].links[n]+ '">' +data[i].texts[n]+ '</a></td>';
      }
      else if (data[i].text && data[i].texts[n] != undefined) {
        result += '<td>' +data[i].texts[n]+ '</td>';
      }
      ++i;
    }
    result += '</tr>';
  }
  result += '</tbody></table>';

  return result;
}

function getJson(input) {
  var data = getData(input),
      heads = [],
      i = 0;
  //build header
  while (data[i]) {
    heads.push(data[i].head);
    ++i;
  }

  var rows = [];
  //build rows (for each of n rows, make i cols)
  for (var n = 0; n < input['items']; ++n) {
    var cells = [];
    i = 0;
    while (data[i]) {
      if (data[i].link && data[i].links[n] != undefined) {
        cells.push('"' + heads[i] + '_link": "' + data[i].links[n] + '"');
      }
      if (data[i].text && data[i].texts[n] != undefined) {
        cells.push('"' + heads[i] + '": "' + data[i].texts[n] + '"');
      }
      ++i;
    }
    if (cells) {
      rows.push(cells.join(', '));
    }
  }
  return '[{' + rows.join('}, \n{') + '}]';
}

function getData(input) {
  input = (input || {'cols': '{A, B}, C', 'heads': 'One, Two', 'incl': 'A', 'not-incl': 'This, That', 'items': 100});
  //extract cols
  //  regex for matching and capturing this -> "{A, B}, C..." etc.
  var regex = /(?:(\w)|{(\w), *(\w)})/g,
      matches,
      result = {};
  for (var i = 0; (matches = regex.exec(input['cols'])) !== null; ++i) {
    if (matches.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // {A, B}
    if (matches[2] && matches[3])
      result[i] = {'link': matches[2].toLowerCase().charCodeAt(0) - 96,
                   'text': matches[3].toLowerCase().charCodeAt(0) - 96};
    // C
    if (matches[1])
      result[i] = {'text': matches[1].toLowerCase().charCodeAt(0) - 96};
  }

  //extract data and headers
  var sheet = SpreadsheetApp.getActiveSheet(),
      heads = input['heads'].split(/, */),
      incl = sheet.getRange(2, input['incl'].toLowerCase().charCodeAt(0) - 96, input['items']).getValues();
  i = 0;
  while (result[i]) {
    result[i].head = heads[i];
    if (result[i].link)
      result[i].links = scrubArr(sheet.getRange(2, result[i].link, input['items']).getValues(), incl, input['not-incl'].split(/, */));
    if (result[i].text)
      result[i].texts = scrubArr(sheet.getRange(2, result[i].text, input['items']).getValues(), incl, input['not-incl'].split(/, */));
    ++i;
  }
  return result;
}

function scrubArr(arr, col, vals) {
  vals.push("");
  var n = 0;
  for (var i = 0; i < col.length; ++i) {
    if (vals.indexOf(col[i][0]) != -1) {
      arr.splice(n, 1);
      --n;
    }
    ++n;
  }
  return arr;
}
