# jSimpleSpreadsheet
     
(en)
Simple, easy and uncomplicated. Your HTML tables are navigable and editable (like a spreadsheet).

(pt)
Simples, fácil e descomplicado. Suas tabelas HTML serão navegáveis e editáveis (como uma planilha).

## Simple usage:

```javascript
var your_table_selector = '.this-is-a-example';

var worksheet = new JSimpleSpreadsheet(your_table_selector);

```

```html
<table class="this-is-a-example">
     <tr><th> </th><th>  A   </th><th>  B  </th></tr>
     <tr><th>1</th><th>banana</th><th>apple</th></tr>
     <tr><th>2</th><th>orange</th><th>grape</th></tr>         
</table>
```
It's this!

## Full usage examples:

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

// Setting value to A1
worksheet.getCell('A1').setValue('This is A1');

// Setting value to C3 and B4
worksheet.getCell(['C3','B4']).setValue('Both C3 and B4 setValue');

// Getting value from A1
var A1 = worksheet.getCell('A1').getValue();

// Return only first element value (sorry!)
var only_first = worksheet.getCell(['A1','C3']).getValue();      

// Disabling C1 and A2
worksheet.getCell(['C1','A2']).setEnabled(false);

// Checking C1 if enabled
var enabled = worksheet.getCell('C1').isEnabled();

// Undo
worksheet.getCell('B5').setValue('Undo test');
worksheet.undo();

```

```html
<table border="1" class=".this-is-a-example">                    
  <tbody>
      <tr>
          <th>&nbsp;</th><th>A</th><th>B</th><th>C</th>
      </tr>
      <tr>                                                         
          <th>1</th><td></td><td></td><td></td>                        
      </tr>                                            
      <tr>                                                         
          <th>2</th><td></td><td></td><td data-disabled>disabled in HTML code</td>                        
      </tr>                                            
      <tr>                                                         
          <th>3</th><td></td><td>This is B3</td><td></td>                         
      </tr>                                            
      <tr>                                                         
          <th>4</th><td></td><td></td><td></td>                     
      </tr>                                            
      <tr>                                                         
          <th>5</th><td></td><td></td><td></td>                       
      </tr>                                        
      <tr>
          <th>6</th><td></td><td></td><td data-name="total">The input will be named 'total'</td>                      
      </tr>  
  </tbody>
</table> 
```


 
## Releases:
* v3.0.1
      - Fix cell.isEnabled;
      - Fix cell.isSelected
* v3.0
      - Removed jQueryUI dependencies;
      - Removed jQuery syntax support;      
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
