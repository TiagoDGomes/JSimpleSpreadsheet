/**
 * jSimpleSpreadsheet 3.0.1
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
var JSimpleSpreadsheet;
var JSimpleSpreadsheetCell;
var JSS_RUNTIME_SELECTOR = 'jSimpleSpreadsheet-runner';
var JSS_FOCUS_SELECTOR = 'focus';
var JSS_CELL_SELECTOR_PREFFIX = 'cell_';

(function($) {
    JSimpleSpreadsheet = function(selector, options) {
        this._undoList = [];
        this.selector = selector;
        var jssObject = this;
        var settings = $.extend({
            onFocus: function(colName, rowIndex, element) {
                // nothing
            },
            onBlur: function(colName, rowIndex, element) {
                // nothing
            },
            onChange: function(colName, rowIndex, valueRaw, oldValueRaw, element) {
                return true;
            },
            theme: null,
            trSelector: 'tr',
            tdSelector: 'td'

        }, options);

        var tableSelector = JSS_RUNTIME_SELECTOR + '-' + _jss_rnd();
        $(selector).addClass(tableSelector);
        $(selector).addClass(JSS_RUNTIME_SELECTOR);

        tableSelector = '.' + tableSelector;

        if (settings.theme !== null) {
            jss_includeCSS(settings.theme);
        }

        var colIndex = 1;
        var rowIndex = 0;

        $(tableSelector + ' ' + settings.trSelector).each(function() {
            $(this).children(settings.tdSelector).each(function() {
                $(this).addClass('cell');
                var valueRaw = $(this).text().trim();
                var colName = String.fromCharCode(colIndex + 64);

                var selectorCellName = JSS_CELL_SELECTOR_PREFFIX + colName + rowIndex;
                var selectorCellName_ = JSS_CELL_SELECTOR_PREFFIX + colName + "_" + rowIndex;
                var selectorCellIndex = JSS_CELL_SELECTOR_PREFFIX + colIndex + '_' + rowIndex;

                this.innerHTML = '';

                var inputText = document.createElement('input');
                var spanText = document.createElement('span');

                inputText.name = $(this).data('name') !== undefined ? $(this).data('name') : colName + rowIndex + '_' + colName + '_' + rowIndex;


                inputText.value = valueRaw;
                inputText.type = 'text';
                inputText.dataset.cellname = colName + rowIndex;
                inputText.dataset.colname = colName;
                inputText.dataset.col = colIndex;
                inputText.dataset.row = rowIndex;
                inputText.dataset.value = valueRaw;
                inputText.className = 'value cell ' +
                        colName + rowIndex + ' ' +
                        selectorCellIndex + ' ' +
                        selectorCellName + ' ' +
                        selectorCellName_;
                $(inputText).addClass(inputText.name.toLowerCase());


                spanText.dataset.cellname = inputText.dataset.cellname;
                spanText.className = inputText.className;


                this.appendChild(inputText);
                this.appendChild(spanText);

                if ($(this).data('disabled') === undefined) {
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

        $(tableSelector + ' input[type="text"]').focus(function() {
            var colName = $(this).data('colname');
            var rowIndex = $(this).data('row');
            $(this).addClass(JSS_FOCUS_SELECTOR);
            settings.onFocus(colName, rowIndex, this);
            settings._selected = this;
            this.select();
        });

        /**
         * event: change
         * 
         */

        $(tableSelector + ' input[type="text"]').change(function() {

            var colName = $(this).data('colname');
            var rowIndex = $(this).data('row');
            var oldValueRaw = $(this).data('value');
            var ret = settings.onChange(colName, rowIndex, this.value, oldValueRaw, this);
            var cell = jssObject.getCell(colName + rowIndex);
            if (ret === false) {
                cell.restoreDataValue(colName + rowIndex);
            } else {
                cell.setValue(this.value);
            }
        });

        /**
         * event: blur
         * 
         */

        $(tableSelector + " input").blur(function() {
            var colName = $(this).data('colname');
            var rowIndex = $(this).data('row');
            $(this).removeClass(JSS_FOCUS_SELECTOR);
            settings.onBlur(colName, rowIndex, this);

        });



        /**
         * event: keydown
         */

        $(tableSelector + ' input').keydown(function(event) {
            var colIndex = this.dataset.col;
            var rowIndex = this.dataset.row;

            var nextCol = colIndex;
            var nextRow = rowIndex;

            switch (event.which) {
                case KeyEvent.DOM_VK_RETURN:
                case KeyEvent.DOM_VK_DOWN:
                    event.preventDefault();
                    nextRow++;

                    break;
                case KeyEvent.DOM_VK_UP:
                    event.preventDefault();
                    nextRow--;

                    break;
                case KeyEvent.DOM_VK_RIGHT:
                    if (this.value.length === _jss_getPosition(this)) {
                        event.preventDefault();
                        nextCol++;
                    }
                    break;
                case KeyEvent.DOM_VK_LEFT:
                    if (_jss_getPosition(this) === 0) {
                        event.preventDefault();
                        nextCol--;
                    }
                    break;
            }
            if (nextCol !== colIndex || nextRow !== rowIndex) {
                var cellName = String.fromCharCode(nextCol * 1 + 64) + nextRow;
                var cell = jssObject.getCell(cellName);
                cell.setSelected(true);
            }
        });
        /**
         * 
         * @param {type} cellName
         * @returns {_L25.JSimpleSpreadsheetCell}
         */
        this.getCell = function(cellName) {
            var cell = new JSimpleSpreadsheetCell(jssObject, cellName);
            return cell;
        };
        /**
         * 
         * @returns {Number|_L25.JSimpleSpreadsheet._undoList.length}
         */
        this.undo = function() {
            if (jssObject._undoList.length > 0) {
                var cellItem = jssObject._undoList.pop();
                var tableSelector = cellItem[0];
                var cellName = cellItem[1];
                var cellValue = cellItem[2];
                var selectorTextInput = jss_getCellInputSelector(tableSelector, cellName);
                var selectorTextSpan = jss_getCellSpanSelector(tableSelector, cellName);
                if (cellValue !== undefined) {
                    $(selectorTextInput).val(cellValue);
                    $(selectorTextInput).data('value', cellValue);
                }
                $(selectorTextSpan).text($(selectorTextInput).val());
                return jssObject._undoList.length;
            } else {
                return 0;
            }
        };

    };

    JSimpleSpreadsheetCell = function(jssObject, cellName) {
        var thisCell = this;
        /**
         * 
         * @returns {inputText}
         */
        this.getInputTextJQ = function() {
            var selector = jss_getCellInputSelector(jssObject.selector, cellName);
            return $(selector);
        };
        this.getInputText = function() {            
            return thisCell.getInputTextJQ()[0];
        };
        this.getSpanText = function() {
            return $(jssObject.selector + ' span.' + cellName);
        };
        this.getColName = function() {
            return this.getInputText().dataset.colname;
        };
        this.getRowIndex = function() {
            return thisCell.getInputText().dataset.row;
        }
        this.getValue = function() {
            return thisCell.getInputText().value;
            //return jss_cellValue(jssObject, cellName);
        };
        this.setValue = function(cellValue) {
            return jss_cellValue(jssObject, cellName, cellValue);
        };
        this.isEnabled = function() {
            return jss_enableCell(jssObject.selector, cellName, value);
        };
        this.setEnabled = function(value, dontForce) {
            return jss_enableCell(jssObject.selector, cellName, value, dontForce);
        };
        this.isSelected = function() {
            return thisCell.getInputTextJQ().hasClass(JSS_FOCUS_SELECTOR);
        };
        this.setSelected = function(select) {
            if (select) {
                thisCell.getInputText().focus();
            } else {
                thisCell.getInputText().blur();
            }
        };
        this.restoreDataValue = function() {
            var dataValue = thisCell.getInputText().dataset.value;
            thisCell.getInputText().value = dataValue;
            thisCell.getSpanText().text(dataValue);
            return dataValue;
        }

    };

}(jQuery));

/**
 * _jss_rnd 
 * Returns a random number of 1 to 99999
 */
function _jss_rnd() {
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

function jss_getCellSelector(tableSelector, cellName, tag) {
    var cellsName = '';
    var comma = '';
    var cells;
    if (cellName.constructor !== Array) {
        cellName = cellName.split(',');
    }
    if (cellName.constructor === Array) {
        cells = cellName;
        for (c in cells) {
            cellsName += comma + tableSelector + ' ' + tag + '.' + cells[c].toUpperCase();
            comma = ',';
            cellsName += comma + tableSelector + ' ' + tag + '.' + cells[c].toLowerCase();
        }
    } else {
        cellsName = tableSelector + ' ' + tag + '.' + cellName;
    }

    return cellsName;
}

function jss_getCellInputSelector(tableSelector, cellName) {
    return jss_getCellSelector(tableSelector, cellName, 'input');
}

function jss_getCellSpanSelector(tableSelector, cellName) {
    return jss_getCellSelector(tableSelector, cellName, 'span');
}
function jss_cellValue(jssObject, cellName, cellValue){
    var selectorTextInput = jss_getCellInputSelector(jssObject.selector, cellName);
    var selectorTextSpan  = jss_getCellSpanSelector(jssObject.selector, cellName);
    var jqTextInput = $(selectorTextInput);
    if (cellValue !== undefined){
        jssObject._undoList.push([jssObject.selector, cellName, $(selectorTextInput).data('value')]);
        jqTextInput.val(cellValue);
        jqTextInput.data('value', cellValue);
    }
    $(selectorTextSpan).text(jqTextInput.val());    
    return jqTextInput.val(); 
}
function jss_enableCell(tableSelector, cellName, enable, dontForce) {
    var selectorTextInput = jss_getCellInputSelector(tableSelector, cellName);
    var selectorTextSpan = jss_getCellSpanSelector(tableSelector, cellName);
    var jqTextInput = $(selectorTextInput);
    var jqTextSpan = $(selectorTextSpan);
    if (enable !== undefined) {
        if (enable) {
            jqTextInput.show();
            jqTextInput.prop('disabled', '');
            jqTextInput.data('disabled', undefined);
            jqTextSpan.hide();
        } else {
            if (dontForce === undefined || dontForce === true) {
                jqTextInput.hide();
                jqTextSpan.show();
            } else {
                jqTextInput.prop('disabled', true);
                jqTextInput.show();
                jqTextSpan.hide();
            }
            jqTextInput.data('disabled', true);
        }
    } else {
        return (jqTextInput.data('disabled') === undefined);
    }
    return jqTextInput.val();

}
function jss_includeCSS(css, media){
    var link = document.createElement("link");
    link.href = css;
    link.type = "text/css";
    link.rel = "stylesheet";
    if (media !== undefined){
        link.media = media;
    }
    document.getElementsByTagName("head")[0].appendChild(link);
}
