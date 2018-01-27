function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Sheet to JSON', 'showJSON')
      .addItem('Sheet to HTML', 'showHTML')
      .addItem('Sheet to XML (beta)', 'showXML')
      .addItem('Sheet to CSV (beta)', 'showCSV')
      .addToUi();
}
function onInstall(e) {
  onOpen(e);
}

function showHTML() {
  var ui = HtmlService.createTemplateFromFile('HTML')
      .evaluate()
      .setTitle('Sheet to HTML');
  SpreadsheetApp.getUi().showSidebar(ui);
}

function showJSON() {
  var ui = HtmlService.createTemplateFromFile('JSON')
      .evaluate()
      .setTitle('Sheet to JSON');
  SpreadsheetApp.getUi().showSidebar(ui);
}

function showXML() {
  var ui = HtmlService.createTemplateFromFile('XML')
      .evaluate()
      .setTitle('Sheet to XML (beta)');
  SpreadsheetApp.getUi().showSidebar(ui);
}

function showCSV() {
  var ui = HtmlService.createTemplateFromFile('CSV')
      .evaluate()
      .setTitle('Sheet to CSV (beta)');
  SpreadsheetApp.getUi().showSidebar(ui);
}

function saveSettings (type, settings) {
  var documentProperties = PropertiesService.getDocumentProperties(),
      f_settings = {};

  f_settings[type+'_settings'] = JSON.stringify(settings);
  documentProperties.setProperties(f_settings);
  return true;
}

function loadSettings (type) {
  var props = PropertiesService.getDocumentProperties().getProperties();
  return props[type+'_settings'];
}

// Gets a list of all sheets in the spreadsheet in <option> tags
function getSheets () {
  var result = '<option value="" selected>Current Sheet</option>',
      sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0; i < sheets.length; i++) {
    result += '<option value=' + sheets[i].getSheetId() + '>' + sheets[i].getSheetName() + '</option>';
  }
  return result;
}

function getExport(type, input) {
  switch (type) {
    case 'csv':
      return _getCSV(input);
      break;
    case 'xml':
      return _getXML(input);
      break;
    case 'html':
      return _getHTML(input);
      break;
    case 'json':
      return _getJSON(input);
      break;
    default:
      throw 'Export type not known/defined';
  }
}

function _getCSV(input) {
  var data = [],
      heads = [],
      i = 0;

  // get data from each form
  input.forEach(function(elem, idx) {
    data.push(getData(elem));
  });
  // data in form of:
  //   [form #][col #][row|row_link][row #] = cell value

  var forms = [];

  // for each form f = [form #]
  for (var f = 0; f < data.length; f++) {
    var csv = '';

    /** For column titles **/

    // for each column c = [col #]
    for (var c = 0; c < data[f].length; c++) {
      var title = data[f][c]['title'];
      csv += '"'+title+'",';
    }
    // remove trailing comma
    csv = csv.substring(0, csv.length - 1);

    /** For data rows **/

    // for each row r = [row #]
    // All rows should be the same number of items
    for (var r = 0; r < data[f][0]['row'].length; r++) {
      csv += '\n'

      // for each column c = [col #]
      for (var c = 0; c < data[f].length; c++) {

        var row = data[f][c]['row'][r],
            row_link = '';

        if (data[f][c]['row_link']) {
          row_link = '' + data[f][c]['row_link'][r];
          csv += '"=HYPERLINK(\"\"' + row_link + '\"\", \"\"' + row + '\"\")",';
        }
        else {
          csv += '"' + row + '",';
        }
      }
      // remove trailing comma
      csv = csv.substring(0, csv.length - 1);
    }

    forms.push(csv);
  }
  return forms;
}

function _getXML(input) {
  var data = [],
      heads = [],
      i = 0;

  // get data from each form
  input.forEach(function(elem, idx) {
    data.push(getData(elem));
  });
  // data in form of:
  //   [form #][col #][row|row_link][row #] = cell value

  var forms = [];

  // for each form f = [form #]
  for (var f = 0; f < data.length; f++) {
    var xml = '<Sheet' + (f + 1) + '>';

    // for each row r = [row #]
    // All rows should be the same number of items
    for (var r = 0; r < data[f][0]['row'].length; r++) {
      xml += '<_' + (r + 1);

      // for each column c = [col #]
      for (var c = 0; c < data[f].length; c++) {

        var title = data[f][c]['title'].replace(/ /g, '_'),
            row = data[f][c]['row'][r],
            row_link = '';

        xml += ' ' + title + '="' + row + '"';

        if (data[f][c]['row_link']) {
          row_link = data[f][c]['row_link'][r];
          xml += ' ' + title + '_link="' + row + '"';
        }
      }

      xml += '/>';
    }

    xml += '</Sheet' + (f + 1) + '>';
    forms.push(xml);
  }
  return forms;
}

function _getHTML(input) {
  var data = [],
      heads = [],
      i = 0;

  // get data from each form
  input.forEach(function(elem, idx) {
    data.push(getData(elem));
  });
  // data in form of:
  //   [form #][col #][row|row_link][row #] = cell value

  var forms = [];

  // for each form f = [form #]
  for (var f = 0; f < data.length; f++) {
    var html_head = '<thead><tr>',
        html_body = '<tbody>';

    /** For column titles **/

    // for each column c = [col #]
    for (var c = 0; c < data[f].length; c++) {
      var title = data[f][c]['title'];
      html_head += '<th>'+title+'</th>';
    }

    /** For data rows **/

    // for each row r = [row #]
    for (var r = 0; r < data[f][0]['row'].length; r++) {
      html_body += '<tr>';

      // for each column c = [col #]
      for (var c = 0; c < data[f].length; c++) {

        var row = data[f][c]['row'][r],
            row_link = '';

        if (data[f][c]['row_link']) {
          row_link = '' + data[f][c]['row_link'][r];
          if (row_link.search('http') === -1) {
            row_link = 'http://' + row_link;
          }
          html_body += '<td><a href="' + row_link + '">' + row + '</a></td>';
        }
        else {
          html_body += '<td>' + row + '</td>';
        }
      }

      html_body += '</tr>';
    }


    html_head += '</tr></thead>';
    html_body += '</tbody>';

    forms.push('<table>' + html_head + html_body + '</table>');
  }
  return forms;
}

function _getJSON(input) {
  var data = [],
      heads = [],
      i = 0;

  // get data from each form
  input.forEach(function(elem, idx) {
    data.push(getData(elem));
  });
  // data in form of:
  //   [form #][col #][row|row_link][row #] = cell value

  var forms = [];

  // for each form f = [form #]
  for (var f = 0; f < data.length; f++) {
    var rows = [];

    // for each row r = [row #]
    // All rows should be the same number of items
    for (var r = 0; r < data[f][0]['row'].length; r++) {
      var cells = {};

      // for each column c = [col #]
      for (var c = 0; c < data[f].length; c++) {

        // Add cell to object (title of col -> value of each row)
        var title = data[f][c]['title'].toLowerCase(),
            row = data[f][c]['row'][r],
            row_link = '';

        cells[title] = row[0];

        if (data[f][c]['row_link']) {
          row_link = data[f][c]['row_link'][r];
          cells[title + '_link'] = row_link[0];
        }
      }

      if (cells) {
        rows.push(cells);
      }
    }

    if (rows) {
      forms.push(rows);
    }
  }
  return forms;
}

// Collects data from sheet given form data
// Outputs JSON in form of:
//   [col #]['row'|'row_link'][row #] = value
function getData(form) {
  if (!form) { return; }
  //extract form into structure data[field name] => field value
  var data = {};
  form.forEach(function(elem, idx) {
    switch (elem.type) {
      case 'text':
      case 'number':
        // Text inputs
        data[elem.name] = elem.value;
        break;
      case 'radio':
        // Radio buttons
        if (elem.checked === true) {
          data[elem.name] = elem.value;
        }
        break;
      case 'checkbox':
        // Checkboxes
        data[elem.name] = elem.checked;
        break;
      case 'select-one':
        // select tag
        data[elem.name] = elem.value;
      default:
        // unknown
        break;
    }
  });
  // data now contains all form data

  //  regex for matching and capturing "{A, B}, C..." etc.
  var regex = /(?:(\w+)|{(\w+)[, ]*(\w+)})/g,
      matches,
      columns = [];
  // (required) data['columns'] is the only field that needs to be filled out
  for (var i = 0; (matches = regex.exec(data['columns'])) !== null; i++) {
    if (matches.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // {A, B}
    if (matches[2] && matches[3])
      columns[i] = {'link_col': matches[2].toLowerCase().charCodeAt(0) - 96,
                   'text_col': matches[3].toLowerCase().charCodeAt(0) - 96};
    // C
    if (matches[1])
      columns[i] = {'text_col': matches[1].toLowerCase().charCodeAt(0) - 96};
  }
  // columns now contains json for columns to use

      // (optional) Sheet "sheet-name" or current sheet if no name given
  var sheet = (data['sheet-id'] ? getSheetById(data['sheet-id']) : SpreadsheetApp.getActiveSheet()),
      // (optional) column titles from form or sheet (or nothing if both don't exist);
      titles = (data['titles'] ? data['titles'].split(/, */) : getTitles(sheet, columns)),
      // (required) row number that data starts on
      dataRowStart = (data['row-1-data'] === 'data') ? 1 : 2,
      // (optional) number of rows in table or programmatically count them
      size = (data['size'] ? data['size'] : countCol(sheet, 'A', dataRowStart)),
      // (optional) column nunmber to filter with or false
      filterCol = (data['filter-column'] ? data['filter-column'].toLowerCase().charCodeAt(0) - 96 : false),
      // (optional) data from the column used to filter out rows or false
      filterColData = (filterCol ? sheet.getRange(dataRowStart, filterCol, size).getValues() : false),
      // (optional) strings for filtering or false
      filterCriteria = (filterCol && data['filter-criteria'] ? data['filter-criteria'].split(/, */): false);

  if (titles === false) {
    throw 'Required information not provided';
  }

  if (data['remove-empty'] === true) {
    if (filterCriteria === false) {
      filterCol = 1;
      filterColData = sheet.getRange(dataRowStart, filterCol, size).getValues();
      filterCriteria = [];
    }
    filterCriteria.push("");
  }

  i = 0;
  while (columns[i]) {
    columns[i].title = titles[i];
    if (columns[i].link_col) {
      var linkColData = sheet.getRange(dataRowStart, columns[i].link_col, size).getValues();
      columns[i].row_link = colFilter(linkColData, filterColData, filterCriteria);
    }
    if (columns[i].text_col) {
      var textColData = sheet.getRange(dataRowStart, columns[i].text_col, size).getValues();
      columns[i].row = colFilter(textColData, filterColData, filterCriteria);
    }
    i++;
  }
  return columns;
}

// Takes a column, filter column, filter to removes filtered rows from currCol
function colFilter(currCol, filterCol, filter) {
  if (filterCol === false || filter === false) {
    return currCol;
  }
  var n = 0,
      result = currCol;
  for (var i = 0; i < filterCol.length; i++) {
    if (filter.indexOf(filterCol[i][0]) != -1) {
      result.splice(n, 1);
      n--;
    }
    n++;
  }
  return result;
}

function getTitles (sheet, columns) {
  var allCols = sheet.getRange('A1:1'),
      result = [];

  for (var i = 0; i < columns.length; i++) {
    if (columns[i].text_col) {
      var val = allCols.getCell(1, columns[i].text_col).getValue();

      // If we need to look at cells for titles and at least one is blank, throw error
      if (val === "") {
        return false;
      }
      result.push(val);
    }
  }

  if (result.length === 0) {
    return false;
  }
  return result;
}

// Probably inferior implementation of the Google Sheets COUNT function
// Finds where the end of the row is
function countCol (sheet, col, rowStart) {
  if (typeof col !== 'string') {
    return -1;
  }
  // Finds approximately (+- 50) where the end of the row is
  var range = sheet.getRange(col + rowStart + ':' + col),
      off = 50,
      count = 0,
      numRows = range.getNumRows();
  while (count < numRows) {
    if (range.isBlank()) {
      break;
    }
    else {
      range = range.offset(off, 0, numRows - count);
      count += off;
    }
  }
  // Now that we've overshot by <= off, backtrack until we reach a value
  // we want range to now be the `off` values we skipped
  range = range.offset(-off, 0, off);
  count -= off;
  numRows = range.getNumRows();
  off = 1;
  var tempCount = 0;

  while (tempCount < numRows) {
    if (range.isBlank()) {
      break;
    }
    else {
      range = range.offset(off, 0, numRows - tempCount);
      tempCount += off;
    }
  }
  count += tempCount;
  return count;
}

function getSheetById(id) {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === parseInt(id)) {
      return sheets[i];
    }
  }
}
