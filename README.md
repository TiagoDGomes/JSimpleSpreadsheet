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
		onFocus: function(colName, rowIndex, valueRaw){},
		onBlur: function(colName, rowIndex, valueRaw){return true;}
 });
``` 
