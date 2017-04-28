# SheetsDB

A powerful Drive App to use a Google Spreadsheet as a low-effort database.

While this is technically a work in progress, there is nothing here that will write to your Spreadsheet. This tool only writes to its own memory and its sandboxed [document settings](https://developers.google.com/apps-script/reference/properties/properties-service#getDocumentProperties()). Any bugs should only affect the use of SheetsDB and nothing more. Nonetheless, use at your own risk.

[Install it now!](https://chrome.google.com/webstore/detail/sheet-to-data/mhmjmmomcaimcoefbhdggmijkjpblhgf).

## Features

- Spreadsheet to JSON object
  - Import directly into a database
  - Export & backup for safe keeping
- Very few required options
  - Just choose the columns to export & enjoy
  - Or, choose your own options and have more control
- Filter out unwanted results
  - Remove empty rows or any other text
- Export multiple sheets at once
- Save your settings for each spreadsheet


## Developing

I have been using this for my own work & projects, so some of the features are tailored to my needs (pairing links to link names, for example). However, I imagine this could be very useful to some people. If you have any feature requests or bug reports, feel free to make an issue. I welcome any pull requests or forks. 

### Planned Features

- Regular expression support for filtering out rows
- Automatically send files to any endpoint
- Ability to download files instead of copying them
- Customizability and extensibility
