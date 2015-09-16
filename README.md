# jSimpleSpreadsheet

Simple, easy and uncomplicated. Your HTML tables are navigable and editable (like a spreadsheet).

Simples, fácil e descomplicado. Suas tabelas HTML serão navegáveis e editáveis (como uma planilha).

## Simple usage:

```
 $(your_table_selector).jSimpleSpreadsheet();
```

## Advanced usage:

```
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
```



## Releases:
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
