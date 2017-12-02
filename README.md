# SheetsDB

A Drive App to export a Google Spreadsheet into many different formats.

[Install it now!](https://chrome.google.com/webstore/detail/sheet-to-data/mhmjmmomcaimcoefbhdggmijkjpblhgf)

While this is technically a work in progress, there is nothing here that will write to your Spreadsheet. This tool only writes to its own memory and its sandboxed [document settings](https://developers.google.com/apps-script/reference/properties/properties-service#getDocumentProperties()). Any bugs should only affect the use of SheetsDB and nothing more. Nonetheless, use at your own risk.

## Features

- Spreadsheet to JSON, HTML, XML (beta), and CSV (beta)
  - Import directly into a database
  - Export & backup for safe keeping
- Very few required options
  - Just choose the sheets and columns to export & enjoy
  - Or, choose your own options and have more control
- Filter out unwanted results
  - Remove empty rows or any other text
- Export multiple sheets in the same spreadsheet at one time
- Save your settings for each spreadsheet
  - Settings are saved per export format on each document
  - Share your settings with all users of a spreadsheet
- Make any column into working hyperlinks

## Planned Features
- Regex support for filtering out rows
- Default configuration options so everything is optional
- Save multiple different settings
- Download exported files to computer instead of copying them
- Upload exported files
- Recurring exports


## Developing

I have been using this for my own work & projects, so some of the features are tailored to my needs (pairing links to link names, for example). However, I imagine this could be very useful to some people. My goal is to make this app useful to more than just me. If you have any feature requests or bug reports, feel free to make an issue. I welcome any pull requests or forks.
