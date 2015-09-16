/**
 * jSimpleSpreadsheet 2.1.1
 * @author Tiago Donizetti Gomes (https://github.com/TiagoDGomes/jSimpleSpreadsheet)
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var JSS_CELL_SELECTOR_PREFFIX = 'cell_';   

if (typeof KeyEvent === "undefined") {
        var KeyEvent = {
            DOM_VK_CANCEL: 3,
            DOM_VK_BACK_SPACE: 8,
            DOM_VK_TAB: 9,
            DOM_VK_CLEAR: 12,
            DOM_VK_RETURN: 13,
            DOM_VK_ENTER: 14,
            DOM_VK_SHIFT: 16,
            DOM_VK_CONTROL: 17,
            DOM_VK_ALT: 18,
            DOM_VK_PAUSE: 19,
            DOM_VK_ESCAPE: 27,
            DOM_VK_SPACE: 32,
            DOM_VK_PAGE_UP: 33,
            DOM_VK_PAGE_DOWN: 34,
            DOM_VK_END: 35,
            DOM_VK_HOME: 36,
            DOM_VK_LEFT: 37,
            DOM_VK_UP: 38,
            DOM_VK_RIGHT: 39,
            DOM_VK_DOWN: 40,
            DOM_VK_INSERT: 45,
            DOM_VK_DELETE: 46
            
        };
    }

(function ( $ ) {      
    $.widget( "tdg.jSimpleSpreadsheet", {        
        options: {
            onFocus: function(colName, rowIndex, element){
                // nothing
            },
            onBlur: function(colName, rowIndex, element){
                // nothing
            },
            onChange: function(colName, rowIndex, valueRaw, oldValueRaw, element){
                return true;
            },
            theme: null,            
            trSelector: 'tr',
            tdSelector: 'td', 
            id: _jss_rnd(),
                        
            _jssTableSelector : null,
            _selected: null,
            _undoList: [],
            _widget: null
        },
        widget: function(){
            return this.options._widget;
        },
        selected: function(cellName){
            return this._selected;
        },
        enableCell: function(cellName, enable, dontForce){
            return jss_enableCell(this._jssTableSelector, cellName, enable, dontForce)
        },
        cell: function(cellName, value){
            return _jss_cellValue(this, cellName, value);
        },
        undo: function(){            
            if (this.options._undoList.length > 0){
                var cellItem = this.options._undoList.pop();
                var tableSelector = cellItem[0];
                var cellName = cellItem[1];
                var cellValue = cellItem[2];
                var selectorTextInput = jss_getCellInputSelector(tableSelector, cellName);
                var selectorTextSpan  = jss_getCellSpanSelector(tableSelector, cellName);
                if (cellValue !== undefined){
                    $(selectorTextInput).val(cellValue);
                    $(selectorTextInput).data('value', cellValue);
                }
                $(selectorTextSpan).text($(selectorTextInput).val()); 
                console.log(this.options._undoList);
                return this.options._undoList.length;                  
            } else {
                return 0;
            }
        },
        _create: function() {
            var widget = this;
            widget.options._widget = widget;
            widget._jssTableSelector = 'jSimpleSpreadsheet-runner-' + this.options.id;
            $(widget.element).addClass(widget._jssTableSelector);
            $(widget.element).addClass('jSimpleSpreadsheet-runner');
            widget._jssTableSelector = '.' + widget._jssTableSelector;
            
            if (widget.options.theme !== null){
                  link      = document.createElement( "link" );
                  link.href = widget.options.theme;
                  link.type = "text/css";
                  link.rel  = "stylesheet";
                  document.getElementsByTagName( "head" )[0].appendChild( link );           
            }            
            
            var colIndex = 1;
            var rowIndex = 0;
            
            $(widget._jssTableSelector + ' ' + widget.options.trSelector).each(function() {
                $(this).children(widget.options.tdSelector).each(function(){ 
                    $(this).addClass('cell');
                    var valueRaw =  $(this).text().trim();
                    var colName = String.fromCharCode(colIndex + 64);    
                    
                    var selectorCellName       = JSS_CELL_SELECTOR_PREFFIX + colName + rowIndex;
                    var selectorCellName_      = JSS_CELL_SELECTOR_PREFFIX + colName + "_" + rowIndex;
                    var selectorCellIndex      = JSS_CELL_SELECTOR_PREFFIX + colIndex + '_' + rowIndex;
                    
                    this.innerHTML             = ''; 
                    
                    var inputText              = document.createElement('input');
                    var spanText               = document.createElement('span');
                    
                    inputText.name             = $(this).data('name') !== undefined ? $(this).data('name') : colName + rowIndex + '_' + colName + '_' + rowIndex;
                    
                    
                    inputText.value            = valueRaw;   
                    inputText.type             = 'text';   
                    inputText.dataset.cellname = colName + rowIndex ;
                    inputText.dataset.colname  = colName;
                    inputText.dataset.col      = colIndex;
                    inputText.dataset.row      = rowIndex;
                    inputText.dataset.value    = valueRaw;
                    inputText.className        = 'value cell ' +
                                                 colName + rowIndex + ' ' + 
                                                 selectorCellIndex + ' ' + 
                                                 selectorCellName + ' ' + 
                                                 selectorCellName_ ;
                    
                    spanText.dataset.cellname  = inputText.dataset.cellname ;                     
                    spanText.className         = inputText.className;
                    
                    
                    this.appendChild(inputText);
                    this.appendChild(spanText);
                    
                    if ($(this).data('disabled')=== undefined){
                        $(inputText).show();
                        $(spanText).hide();
                    } else {
                        $(inputText).hide();
                        $(spanText).show();
                    }
                    $(spanText).text(valueRaw);
                    
                    colIndex++;
                });
                rowIndex++;
                colIndex = 1;
                
            });
            
            
            /**
             * event: focus
             * 
             */
            
            $(widget._jssTableSelector + ' input[type="text"]').focus(function() {
                var colName = $(this).data('colname');
                var rowIndex = $(this).data('row');
                $(this).addClass('focus');
                widget.options.onFocus(colName, rowIndex, this);
                widget._selected = this; 
                this.select();                            
            });
            
            /**
             * event: change
             * 
             */
            
            $(widget._jssTableSelector + ' input[type="text"]').change(function() {
                var colName = $(this).data('colname');
                var rowIndex = $(this).data('row');
                var oldValueRaw = $(this).data('value');
                var ret = widget.options.onBlur(colName, rowIndex, this.value, oldValueRaw, this);
                if (ret === false){
                    jss_restoreDataValue(widget._jssTableSelector, colName + rowIndex);
                } else { 
                    _jss_cellValue(widget, colName + rowIndex, this.value);
                }                          
            });
            
            /**
             * event: blur
             * 
             */
            
            $(widget._jssTableSelector + " input").blur(function() {
                var colName = $(this).data('colname');
                var rowIndex = $(this).data('row');
                $(this).removeClass('focus');
                widget.options.onBlur(colName, rowIndex, this);                     
                
            });    
            
           
            
            /**
             * event: keydown
             */
            
            $(widget._jssTableSelector + ' input').keydown(function(event) {
                var colIndex = $(this).data('col');
                var rowIndex = $(this).data('row');
                        
                switch (event.which) {
                    case KeyEvent.DOM_VK_RETURN:
                    case KeyEvent.DOM_VK_DOWN:
                        event.preventDefault();
                        jss_moveTo(widget._jssTableSelector, null, colIndex, rowIndex + 1);
                        
                        break;
                    case KeyEvent.DOM_VK_UP:
                        event.preventDefault();
                        jss_moveTo(widget._jssTableSelector, null, colIndex, rowIndex - 1);
                        
                        break;
                    case KeyEvent.DOM_VK_RIGHT:
                        if (this.value.length === _jss_getPosition(this)) {
                            event.preventDefault();
                            jss_moveTo(widget._jssTableSelector, null, colIndex + 1, rowIndex);                            
                        }
                        break;
                    case KeyEvent.DOM_VK_LEFT:
                        if (_jss_getPosition(this) === 0) {
                            event.preventDefault();
                            jss_moveTo(widget._jssTableSelector, null, colIndex - 1, rowIndex);                            
                        }
                        break;
                }
            });
            
        }
              
    } );
    
}( jQuery ));

/**
 * _jss_rnd 
 * Returns a random number of 1 to 99999
*/        
function _jss_rnd (){
    return Math.round(Math.random() * 100000);
}


/**
 * _jss_getPosition
 * Returns the caret (cursor) position of the specified text field.
 * Return value range is 0-oField.value.length.
 * Original method: doGetCaretPosition
 * https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
 * @param {obj} oField
*/
function _jss_getPosition(oField) {
       // Initialize
   var iCaretPos = 0;
   // IE Support
   if (document.selection) {
       // Set focus on the element
       oField.focus();
       // To get cursor position, get empty selection range
       var oSel = document.selection.createRange();
       // Move selection start to 0 position
       oSel.moveStart('character', -oField.value.length);
       // The caret position is selection length
       iCaretPos = oSel.text.length;
   }
   // Firefox support
   else if (oField.selectionStart || oField.selectionStart === '0') {
       iCaretPos = oField.selectionStart;
   }
   // Return results
       return (iCaretPos);
}    



function jss_getCellSelector(tableSelector, cellName, tag){
    var cellsName='';
    var comma = '';
    var cells;
    if (cellName.constructor !== Array){        
        cellName = cellName.split(',');         
    } 
    //console.log('jss_getCellSelector:: cellName after split = ' + cellName);
    if (cellName.constructor === Array){
        cells = cellName;
        //console.log('jss_getCellSelector:: starting loop -> cells = ' + cells);
        for (c in cells){
            //console.log('jss_getCellSelector:: inLoop -> c = ' + cells[c]);
            cellsName += comma + tableSelector + ' ' + tag + '.' + cells[c].toUpperCase();
            comma = ',';
        }
    } else {
        cellsName = tableSelector + ' ' + tag + '.' + cellName;
    }
    
    //console.log('jss_getCellSelector:: cellsName finish = ' + cellsName);
    return cellsName;
}

function jss_getCellInputSelector(tableSelector, cellName){
    return jss_getCellSelector(tableSelector, cellName, 'input');
}

function jss_getCellSpanSelector(tableSelector, cellName){
    return jss_getCellSelector(tableSelector, cellName, 'span');
}

function _jss_cellValue(widget, cellName, cellValue){
    var selectorTextInput = jss_getCellInputSelector(widget._jssTableSelector, cellName);
    var selectorTextSpan  = jss_getCellSpanSelector(widget._jssTableSelector, cellName);
    if (cellValue !== undefined){
        widget.options._undoList.push([widget._jssTableSelector, cellName, $(selectorTextInput).data('value')]);
        $(selectorTextInput).val(cellValue);
        $(selectorTextInput).data('value', cellValue);
    }
    $(selectorTextSpan).text($(selectorTextInput).val());    
    return $(selectorTextInput).val(); 
}
function jss_restoreDataValue(tableSelector, cellName){
    var selectorTextInput = jss_getCellInputSelector(tableSelector, cellName);
    var selectorTextSpan  = jss_getCellSpanSelector(tableSelector, cellName);
    var dataValue = $(selectorTextInput).data('value');
    $(selectorTextInput).val(dataValue);
    $(selectorTextSpan).text(dataValue);
    return $(selectorTextInput).val(); 
}

function jss_enableCell(tableSelector, cellName, enable, dontForce){ 
    var selectorTextInput = jss_getCellInputSelector(tableSelector, cellName);
    var selectorTextSpan  = jss_getCellSpanSelector(tableSelector, cellName);
    if(enable !== undefined){
        if (enable){
            $(selectorTextInput).show();
            $(selectorTextInput).prop('disabled', '');
            $(selectorTextInput).data('disabled', undefined);
            $(selectorTextSpan).hide();                
        } else {
            if (dontForce === undefined || dontForce === true){
                $(selectorTextInput).hide();
                $(selectorTextSpan).show();
            } else{
                $(selectorTextInput).prop('disabled',true);
                $(selectorTextInput).show();
                $(selectorTextSpan).hide();
            }
            $(selectorTextInput).data('disabled', true);
        }
    } else {
        return ( $(selectorTextInput).data('disabled') === undefined );
    }
    return $(selectorTextInput).val();
    
}
function jss_moveTo(tableSelector, cellname, col, row){
    var next;
    if (cellname !== null){
        next = $(tableSelector + ' input.' + cellname);
    } else {
        next = $(tableSelector + ' input.' + JSS_CELL_SELECTOR_PREFFIX + col + '_' + row);
    }        
    next.focus();
} 

var JSimpleSpreadsheet = function(selector, options){
    var widget = $(selector).jSimpleSpreadsheet(options);
    this.widget = widget;
    this.getCell = function(cellName){
        return new JSimpleSpreadsheetCell(widget, cellName);              
    };
    this.undo = function(){
        return $(selector).jSimpleSpreadsheet('undo');
    }
};

var JSimpleSpreadsheetCell = function(selector, cellName){

    this.value;
     
    this._getInput = function(){
        return $(selector).find('.' + cellName)[0]
    };
    this.getValue = function(){
        return this._getInput().value;
    };
    this.setValue = function(value){
        //console.log('JSimpleSpreadsheetCell::setValue - cellName=' + cellName);
        return $(selector).jSimpleSpreadsheet('cell', cellName , value);
    };
    this.isEnabled = function(){
        return $(selector).jSimpleSpreadsheet('enableCell', cellName);
    };
    this.setEnabled = function(value){
        return $(selector).jSimpleSpreadsheet('enableCell', cellName , value);
    };
        
};