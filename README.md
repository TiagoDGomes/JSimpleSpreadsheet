# JSimpleSpreadsheet
     
(en)
Simple, easy and uncomplicated. Your HTML tables are navigable and editable (like a spreadsheet). [View example](https://tiagodgomes.github.io/JSimpleSpreadsheet/example3.html).

(pt)
Simples, fácil e descomplicado. Suas tabelas HTML serão navegáveis e editáveis (como uma planilha). [Veja o exemplo](https://tiagodgomes.github.io/JSimpleSpreadsheet/example3.html).



## Simple example:

```html
<html>
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
  <link href="jsimplespreadsheet.css" rel="stylesheet" type="text/css">
  <script src="jsimplespreadsheet.js"></script>
  <script>
     var worksheet;
     $(document).ready(function(){
          var your_table_selector = '.this-is-a-example';
          worksheet = new JSimpleSpreadsheet(your_table_selector);
     });
  </script>
</head>
<body>
  <table class="this-is-a-example">
     <tr><th> </th><th>  A   </th><th>  B  </th></tr>
     <tr><th>1</th><th>banana</th><th>apple</th></tr>
     <tr><th>2</th><th>orange</th><th>grape</th></tr>         
  </table>
</body>
</html>
```

It's this! 

## Full usage examples:

### Javascript details:
```javascript

var your_table_selector = '.this-is-a-example';

var worksheet = new JSimpleSpreadsheet(your_table_selector, {

    onFocus: function(colName, rowIndex, valueRaw){
        // Example - onFocus:
        alert('This is ' + colName + rowIndex + ' with focus!');
    },
    
    onBlur: function(colName, rowIndex, valueRaw){						
        // Example - onFocus:
        alert('Bye ' + colName + rowIndex);
    },
    
    onChange: function(colName, rowIndex, valueRaw, oldValueRaw, element){					
        // Example - onBlur:
        if (confirm('Accept ' + colName + rowIndex + ' with ' + valueRaw + '?')){
            return true;
        } else {
            return false;  // Undo changes
        }
    },
    
    theme: 'jsimplespreadsheet.theme.css',
    
    trSelector: 'tr',
    
    tdSelector: 'td',
    
    cellClassSelectorPreffix: 'cell_',
    
    focusClassSelector: 'focus',
    
    defaultClass: 'jss_default_class'

});

// Setting value to A1
worksheet.getCell('A1').setValue('This is A1');

// Setting value to C3 and B4
worksheet.getCell(['C3','B4']).setValue('Both C3 and B4 setValue');

// Getting value from A1
var my_A1 = worksheet.getCell('A1').getValue();

// Getting value from 'total'
var my_total = worksheet.getCell('total').getValue();

// Getting a array of values
var my_array = worksheet.getCell(['A1','C3']).getValue();      

// Disabling C1 and A2
worksheet.getCell(['C1','A2']).setEnabled(false);

// Disabling A3 (forced)
worksheet.getCell('A3').setEnabled(false, false);

// Checking C1 if enabled
var my_check = worksheet.getCell('C1').isEnabled();

// Undo
worksheet.getCell('B5').setValue('Undo test');
worksheet.undo();

// ---------
//   TO-DO: 
// ---------

//// Set format
// worksheet.getCell('A4').setFormat(Number);   



```

### HTML details:

```html
<table border="1" class="this-is-a-example">                    
  <tbody>
      <tr>
          <th>&nbsp;</th><th>A</th><th>B</th>
      </tr>
      <tr>                                                         
          <th>1</th>
          <td>This is A1</td>
          <td>This is B1</td>                       
      </tr>                                            
      <tr>                                                         
          <th>2</th>
          <td data-disabled>disabled cell</td>
          <td></td>                
      </tr>                                            
      <tr>                                                         
          <th>3</th>
          <td data-disabled="force">disabled cell (input disabled)</td>
          <td></td>                
      </tr>                                            
      <tr>                                                         
          <th>4</th>
          <td data-ignore>
                <strong>The JSS will ignore this cell</strong>
          </td>
          <td></td>                 
      </tr>                                            
      <tr>                                                         
          <th>5</th>
          <td data-type="boolean" data-id="test_id" data-value="true">
                This is a label for boolean field
          </td>
          <td></td>                  
      </tr>                                            
      <tr>
          <th>6</th>
          <td data-name="total">The input will be named 'total'</td>
          <td></td>                     
      </tr>
      <!-- TO-DO (not implemented) -->
      <!-- <tr>
          <th>7</th>
          <td data-type="number">0</td>
          <td data-type="postal-code"></td>
          <td data-type="select" data-options="[{'a':'apple'},{'b':'banana'}]"></td>                      
      </tr>-->
      <!--         end TO-DO            -->
  </tbody>
</table> 
``` 
## Releases:

``` 
* v3.2.2
      - allowHideOnDisable changes
* v3.2.1
      - Bugfix: undo
* v3.2
      - Full support to data-type="boolean"
* v3.1.1
      - Basic support to data-type="boolean"
      - Span label -> Label
* v3.1
      - Added options to JSimpleSpreadsheet: <code>cellClassSelectorPreffix</code>, <code>focusClassSelector</code>, <code>defaultClass</code>;
      - Removed global variables: JSS_RUNTIME_SELECTOR, JSS_FOCUS_SELECTOR, JSS_CELL_SELECTOR_PREFFIX 
      - Changed: <code>'jss_*'</code> functions to object functions;
      - Changed: <code>String.prototype.trim</code> to <code>$.trim()</code>
      - Changed: themes ('jSimpleSpreadsheet-runner' to 'jss_default_class') 
      - Bugfix: colIndex and rowIndex < 0 ('move to cell' code)
      - Added: data-ignore
* v3.0.3
      - Changed <code>'dataset'</code> to <code>jQuery.data()</code> (IE Support)
* v3.0.2
      - KeyEvent (IE Support)
* v3.0.1
      - Bugfix: <code>cell.isEnabled</code>;
      - Bugfix: <code>cell.isSelected</code>
* v3.0
      - Removed jQueryUI dependencies;
      - Removed jQuery syntax support;      
* v2.1.1
      - Added 'undo' in JSimpleSpreadsheet object
* v2.1
      - JSimpleSpreadsheet object
* v2.0.1
      - Minimal changes
* v2.0
      - Added full 'undo' support (<code>$(your_table_selector).jSimpleSpreadsheet('undo')</code> )
      - Clean code
      - Added event: onChange
      - Modify <code>onBlur: function(colName, rowIndex, element){} </code>
      - Any tag support ('trSelector' and 'tdSelector' options)
* v1.1.3
      - Bugfix: 'undo' 'onBlur' saving data-value
      - Removed <code> console.log() </code>     
* v1.1.2
      - <code> $(this).html </code> -> <code> this.innerHTML </code>
      - Bugfix: 'disabled span' as text (not HTML)       
* v1.1.1
      - Bugfix: table selector
* v1.1 
      - Theme support;
      - Removed 'change' option;
      - Added 'selected' option;
      - Added wrapper functions 'jSimpleSpreadsheet_';
      - Bugfix: 'undo' in 'onBlur' return false 
* v1.0 
      - First release. 
``` 
