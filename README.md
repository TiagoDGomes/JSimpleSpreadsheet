# jSimpleSpreadsheet

Simple, easy and uncomplicated. Your HTML tables are navigable and editable.

## Simple usage:
```
 $(your_table_selector).jSimpleSpreadsheet();
```
## Advanced usage:
```
 $(your_table_selector).jSimpleSpreadsheet({					
		onFocus: function(colName, rowIndex, valueRaw){},
		onBlur: function(colName, rowIndex, valueRaw){return true;}
 });
``` 
