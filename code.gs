// ---------------------------------------------------------------------------------------------------
// Story ID: 3 - Can enter text into a UI control.
// Story ID: 5 - Can enter text into a UI control, and have it show up in the spreadsheet
// video tutorial: http://www.youtube.com/watch?v=5VmEPo6Rkq4
//
function display_text_control (e) {
  
  var test_app = UiApp.createApplication();  
  test_app.setTitle("Story ID: 3, Can enter text into a UI control");
  
  var vertical_panel = test_app.createVerticalPanel();
  var text_box = test_app.createTextBox();
  text_box.setName("myTextBox").setId('myTextBox');
  var button = test_app.createButton('Submit');
  vertical_panel.add(text_box);
  vertical_panel.add(button);
  
  // Add the handler
  var submit_click_server_handler = test_app.createServerHandler("respond_to_text_box_submit");
  button.addClickHandler(submit_click_server_handler);
  submit_click_server_handler.addCallbackElement(vertical_panel);  // useful for retrieving other widgets from inside the handler, like the text box
  
  test_app.add(vertical_panel);
  
  // USE if webapp --> return test_app;  // this DISPLAYs the app's top level container element
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.show(test_app);
  
}

function respond_to_text_box_submit(e) {
  
  var app = UiApp.getActiveApplication();
  var text_box_value = e.parameter.myTextBox;
  
  // Store the value into the spreadsheet, in the currently active sheet
  var sheet = SpreadsheetApp.getActiveSheet();  // get the currently active sheet in the spreadsheet (not the whole spreadsheet)
  var last_row = sheet.getLastRow()+1;
  var last_cell = sheet.getRange("A" + last_row);
  
  // Finally, we can set the value into the cell
  last_cell.setValue( text_box_value );
  
  app.close();
  
  return app;  // This makes the app goes away when the user clicks the submit button
}


// ---------------------------------------------------------------------------------------------------
// Story ID: 2, Can make interaction panel disappear
//
function make_panel_disappear (e) {

  var test_app = UiApp.createApplication();  
  var close_me_button = test_app.createButton('Close Me');
  var my_panel = test_app.createVerticalPanel();
  
  test_app.setTitle('UI Test App').setHeight(50).setWidth(100);
  
  
  // See: https://developers.google.com/apps-script/uiapp#DisplayingSpreadsheet # Using Client Handlers
  var close_me_client_handler =
    test_app.createClientHandler()
            .forEventSource()
            .setEnabled(false)
            .setVisible(true);
  
  var close_me_server_handler =
      test_app.createServerClickHandler('close_panel');
  
  // Add our new handler to be invoked when the button is clicked
  close_me_button.addClickHandler(close_me_server_handler);
  
  my_panel.add(close_me_button);
  test_app.add(my_panel);
  
  // USE if webapp --> return test_app;  // this DISPLAYs the app's top level container element
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.show(test_app);
  
}

// ---------------------------------------------------------------------------------------------------
function close_panel(e) {
  
  var this_app = UiApp.getActiveApplication();
  
  Logger.log("[close_panel] enter");
  
  this_app.close();
  
  // The following line is REQUIRED for the widget to actually close.
  return this_app;
}

// ---------------------------------------------------------------------------------------------------
// Story ID: 1, See a interactionpanel
// Story ID: 4, Can make a second control appear
// Can make UI panel disappear// USE if webapp --> function doGet (e) {
function S1_S4_display_hello_world_label (e) {
  var test_app       = UiApp.createApplication();  
  var pressMe_button = test_app.createButton('Press Me');
  var hello_label    = test_app.createLabel('Hello World!').setVisible(false);
  var my_panel       = test_app.createVerticalPanel();
  
  test_app.setTitle('UI Test App').setHeight(50).setWidth(100);
  
  my_panel.add(hello_label);
  my_panel.add(pressMe_button);
  
  // Create a new handler that does not require the server.
  // We give the handler two actions to perform on different targets.
  // The first action disables the widget that invokes the handler
  // and the second displays the label.
  // See: https://developers.google.com/apps-script/uiapp#DisplayingSpreadsheet # Using Client Handlers
  var handler =
    test_app.createClientHandler()
            .forEventSource()
            .setEnabled(false)
            .setVisible(true)
            .forTargets(hello_label).setVisible(true);  // This shows the hello world label

  // Add our new handler to be invoked when the button is clicked
  pressMe_button.addClickHandler(handler);
  
  
  test_app.add(my_panel);
  
  // USE if webapp --> return test_app;  // this DISPLAYs the app's top level container element
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.show(test_app);
  
}

// ---------------------------------------------------------------------------------------------------

/**
 * Retrieves all the rows in the active spreadsheet that contain data and logs the
 * values for each row.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function readRows() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();

  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    Logger.log(row);
  }
};

/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [//{ name : "Read Data", functionName : "readRows" },
                 { name : "1 - See Dialog Box, 4 - Display Second Control", functionName : "S1_S4_display_hello_world_label" },
                 { name : "2 - Make panel disappear",     functionName : "make_panel_disappear" },
                 { name : "3 - text control works, 5 - Text Control data shows in SS",     functionName : "display_text_control" }
                ];
  sheet.addMenu("Stories", entries);
};
