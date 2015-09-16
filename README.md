# jSimpleSpreadsheet
     

Simple, easy and uncomplicated. Your HTML tables are navigable and editable (like a spreadsheet).

Simples, fácil e descomplicado. Suas tabelas HTML serão navegáveis e editáveis (como uma planilha).

## Simple usage:

```javascript
var your_table_selector = '.this-is-a-example';

$(your_table_selector).jSimpleSpreadsheet();

```

## Full usage examples:

```javascript
var your_table_selector = '.this-is-a-example';

$(your_table_selector).jSimpleSpreadsheet({					
        onFocus: function(colName, rowIndex, element){
            // Example - onFocus:
            alert('This is ' + colName + rowIndex + ' with focus!');
        },
        onBlur: function(colName, rowIndex, element){						
            // Example - onBlur:
            alert('Bye ' + colName + rowIndex);
        },
        onChange: function(colName, rowIndex, valueRaw, oldValueRaw, element){
            // Example - onChange:
            if (confirm('Accept ' + colName + rowIndex + ' with ' + valueRaw + '?')){
                return true;
            } else {
                return false;  // Undo changes
            }
            //
        },
        theme:      'jquery.jsimplespreadsheet.theme.css',      // CSS file       
        trSelector: 'tr',                                       // Row tag
        tdSelector: 'td',                                       // Cell tag
});

var contentA5 = $(your_table_selector).jSimpleSpreadsheet('cell','A5');      // get A5  

$(your_table_selector).jSimpleSpreadsheet('cell','B1', 'foo');               // writing 
$(your_table_selector).jSimpleSpreadsheet('cell','B6', 'writing in B6');     // writing   
$(your_table_selector).jSimpleSpreadsheet('cell','C3', '<b>I am stubborn... oops!</b>');     // writing   
$(your_table_selector).jSimpleSpreadsheet('cell','A2', null);                // set null
$(your_table_selector).jSimpleSpreadsheet('enableCell','B6', true);          // enabling B6 
$(your_table_selector).jSimpleSpreadsheet('enableCell','c6', false);         // disabling C6
$(your_table_selector).jSimpleSpreadsheet('enableCell','A4', false, false);  // force A4 disable

$(your_table_selector).jSimpleSpreadsheet('cell','B5', 'Undo test'); 
$(your_table_selector).jSimpleSpreadsheet('undo');  // Undo B5

var selected = $(your_table_selector).jSimpleSpreadsheet('selected');        // selected

alert(contentA5);
alert('Selected: ' + $(selected).data('cellname'));   

```

I like this: 

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
    theme: 'jquery.jsimplespreadsheet.theme.css' 
});

worksheet.getCell('A1').setValue('This is A1');
worksheet.getCell(['C3','B4']).setValue('Both C3 and B4 setValue');
console.log(worksheet.getCell('A1').getValue());
console.log(worksheet.getCell(['A1','C3']).getValue());      // Return only first element value
worksheet.getCell(['C1','A2']).setEnabled(false);

worksheet.getCell('B5').setValue('Undo test');
worksheet.undo();  // Undo B5

```

## Releases:

* v2.1.1
      - Add 'undo' in JSimpleSpreadsheet object
* v2.1
      - JSimpleSpreadsheet object
* v2.0.1
      - Minimal changes
* v2.0
      - Add full 'undo' support (<code>$(your_table_selector).jSimpleSpreadsheet('undo')</code> )
      - Clean code
      - Add event: onChange
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
      - Fix 'undo' in 'onBlur' return false 
* v1.0 
      - First release. 
