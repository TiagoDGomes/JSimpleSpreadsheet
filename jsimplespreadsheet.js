/**
 * JSimpleSpreadsheet 3.2.2
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

(function($) {
    JSimpleSpreadsheet = function(tableSelector, options) {
        this._undoList = [];
        this.colLength = 0;
        this.rowLength = 0;
        this.selector = tableSelector;
        var jssObject = this;
        this.settings = $.extend({
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
            tdSelector: 'td',
            cellClassSelectorPreffix: 'cell_',
            focusClassSelector: 'focus',
            defaultClass: 'jss_default_class'

        }, options);

        $(tableSelector).addClass(this.settings.defaultClass);


        if (jssObject.settings.theme !== null) {
            jss_includeCSS(jssObject.settings.theme);
        }

        var colIndex = 1;
        var rowIndex = 0;

        $(tableSelector + ' ' + jssObject.settings.trSelector).each(function() {
            $(this).children(jssObject.settings.tdSelector).each(function() {
                if ($(this).data('ignore') === undefined) {
                    var jqTRElement = $(this);
                    jqTRElement.addClass('cell');
                    var valueRaw = $.trim(jqTRElement.text());
                    var colName = String.fromCharCode(colIndex + 64);

                    var selectorCellName = jssObject.settings.cellClassSelectorPreffix + colName + rowIndex;
                    var selectorCellName_ = jssObject.settings.cellClassSelectorPreffix + colName + "_" + rowIndex;
                    var selectorCellIndex = jssObject.settings.cellClassSelectorPreffix + colIndex + '_' + rowIndex;

                    this.innerHTML = '';

                    var dataType = 'string'; // default
                    var inputItem;
                    var labelText = document.createElement('label');
                    var jqInputItem = $(inputItem);
                    var jqLabelText = $(labelText);
                    var allowHideOnDisable = false;
                    switch (jqTRElement.data('type')) {

                        case 'checkbox':
                        case 'boolean':
                            jqLabelText.text(valueRaw);
                            if (jqTRElement.data('value')==='true'||jqTRElement.data('value')===true){
                                valueRaw = true;
                            }else{
                                valueRaw = false;
                            }
                            inputItem = document.createElement('input');
                            inputItem.type = 'checkbox';
                            inputItem.checked = jqTRElement.data('value');
                            if (jqTRElement.data('id')) {
                                labelText.htmlFor = jqTRElement.data('id');
                            }
                            dataType = 'boolean';

                            break;
                        case 'string':
                        default:
                            inputItem = document.createElement('input');
                            inputItem.value = valueRaw;
                            inputItem.type = 'text';
                            allowHideOnDisable = true;
                            jqLabelText.text(valueRaw);

                    }
                    inputItem.name = jqTRElement.data('name') !== undefined ? jqTRElement.data('name') : colName + rowIndex + '_' + colName + '_' + rowIndex;
                    inputItem.className = 'value cell ' +
                            selectorCellIndex + ' ' +
                            selectorCellName + ' ' +
                            selectorCellName_;

                    labelText.className = inputItem.className;
                    
                    this.appendChild(inputItem);
                    this.appendChild(labelText);

                    jqLabelText = $(labelText);  // Refresh jQuery in input
                    jqInputItem = $(inputItem);  // Refresh jQuery in label
                    
                    jqInputItem.data('cellname', colName + rowIndex);
                    jqInputItem.data('colname', colName);
                    jqInputItem.data('col', colIndex);
                    jqInputItem.data('row', rowIndex);
                    jqInputItem.data('value', valueRaw);
                    jqInputItem.addClass(inputItem.name.toLowerCase());
                    jqInputItem.addClass(dataType);
                    jqInputItem.addClass('jss_input')
                    jqLabelText.addClass('jss_label')
                    jqLabelText.data('cellname', colName + rowIndex);
                    if (jqTRElement.data('id')) {
                        inputItem.id = jqTRElement.data('id');
                    }
                    if (allowHideOnDisable) {
                        jqInputItem.addClass('allow_hide_on_disable');                    
                        if (jqTRElement.data('disabled') === undefined) {
                            jqInputItem.show();
                            jqLabelText.hide();
                        } else {
                            jqInputItem.hide();
                            jqLabelText.show();
                        }
                    }

                    
                }
                colIndex++;
            });
            rowIndex++;
            if (colIndex > jssObject.colLength) {
                jssObject.colLength = colIndex;
            }
            colIndex = 1;

        });
        jssObject.rowLength = rowIndex;

        /**
         * event: focus
         * 
         */

        $(tableSelector + ' .jss_input').focus(function() {
            var jqInputItem = $(this);
            var colName = jqInputItem.data('colname');
            var rowIndex = jqInputItem.data('row');
            jqInputItem.addClass(jssObject.settings.focusClassSelector);
            jssObject.settings.onFocus(colName, rowIndex, this);
            jssObject.settings._selected = this;
            this.select();
        });

        /**
         * event: change
         * 
         */

        $(tableSelector + ' .jss_input').change(function() {
            var jqInputItem = $(this);
            var colName = jqInputItem.data('colname');
            var rowIndex = jqInputItem.data('row');
            var oldValueRaw = jqInputItem.data('value');
            var valueRaw;
            if (jqInputItem.hasClass('boolean')) {
                valueRaw = this.checked;
            } else {
                valueRaw = this.value;
            }
            var ret = jssObject.settings.onChange(colName, rowIndex, valueRaw, oldValueRaw, this);
            var cell = jssObject.getCell(colName + rowIndex);
            if (ret === false) {
                cell.restoreDataValue(colName + rowIndex);
            } else {
                cell.setValue(valueRaw);
            }
        });

        /**
         * event: blur
         * 
         */

        $(tableSelector + " .jss_input").blur(function() {
            var jqInputItem = $(this);
            var colName = jqInputItem.data('colname');
            var rowIndex = jqInputItem.data('row');
            jqInputItem.removeClass(jssObject.settings.focusClassSelector);
            jssObject.settings.onBlur(colName, rowIndex, this);

        });



        /**
         * event: keydown
         */

        $(tableSelector + ' .jss_input').keydown(function(event) {
            var jqInputItem = $(this);
            var colIndex = jqInputItem.data('col');
            var rowIndex = jqInputItem.data('row');
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
                if (nextCol > 0 && nextRow > 0 && nextCol <= jssObject.colLength && nextRow <= jssObject.rowLength) {
                    var cellName = String.fromCharCode(nextCol * 1 + 64) + nextRow;
                    var cell = jssObject.getCell(cellName);
                    cell.setSelected(true);
                }
            }

        });
        /**
         * 
         * @param {String} cellName
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
                var cellName = cellItem[1];
                var cellValue = cellItem[2];

                var jqInputItem = jssObject.getCell(cellName).getInputItem();
                var jqTextLabel = jssObject.getCell(cellName).getLabelText();
                switch(true){
                    case jqInputItem.hasClass('boolean'):
                        jqInputItem.prop('checked', cellValue);
                        break;
                    default:
                        jqInputItem.val(cellValue);
                        jqTextLabel.text(jqInputItem.val());
                }
                jqInputItem.data('value', cellValue);                
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
         * @returns {String}
         */
        this.getCellSelector = function(tag) {
            var cellSelector = '';
            var comma = '';
            var cells;
            if (!(cellName instanceof  Array)) {
                cellName = cellName.split(',');
            }
            cells = cellName;
            for (c in cells) {
                cellSelector = cellSelector.concat(comma, jssObject.selector, ' ', tag, '.', jssObject.settings.cellClassSelectorPreffix, cells[c].toUpperCase());
                comma = ',';
                cellSelector = cellSelector.concat(comma, jssObject.selector, ' ', tag, '.', jssObject.settings.cellClassSelectorPreffix, cells[c].toLowerCase());
                cellSelector = cellSelector.concat(comma, jssObject.selector, ' ', tag, '.', cells[c]);
            }
            return cellSelector;
        }
        /**
         * 
         * @returns {String}
         */
        this.getInputSelector = function() {
            return thisCell.getCellSelector('.jss_input');
        };

        /**
         * 
         * @returns {String}
         */
        this.getLabelSelector = function() {
            return thisCell.getCellSelector('.jss_label');
        };


        /**
         * 
         * @returns {jQuery}
         */
        this.getInputItem = function() {
            return $(thisCell.getInputSelector());
        };

        /**
         * 
         * @returns {jQuery}
         */
        this.getLabelText = function() {
            return  $(thisCell.getLabelSelector());
        };

        /**
         * 
         * @returns {String}
         */
        this.getColName = function() {
            return this.getInputItem().data('colname');
        };

        /**
         * 
         * @returns {Number}
         */
        this.getRowIndex = function() {
            return thisCell.getInputItem().data('row');
        };
        /**
         * 
         * @returns {String}
         */
        this.getValue = function() {
            var jqInputItem = thisCell.getInputItem();
            if (jqInputItem.length > 1) {
                var ret = [];
                jqInputItem.each(function() {
                    if ($(this).hasClass('boolean')) {
                        ret.push(this.checked);
                    } else {
                        ret.push(this.value);
                    }
                });
                return ret;
            } else if (jqInputItem.length === 1) {
                if (jqInputItem.hasClass('boolean')) {
                    return thisCell.getInputItem().prop('checked');
                } else {
                    return thisCell.getInputItem().val();
                }

            }
        };

        /**
         * 
         * 
         */
        this.setValue = function(cellValue) {
            var jqInputItem = thisCell.getInputItem();
            cellValue = typeof cellValue === 'undefined' ? '' : cellValue;
            
            if (jqInputItem.hasClass('boolean')) {
                jqInputItem.prop('checked',cellValue);
                
            } else {
                jqInputItem.val(cellValue);
                thisCell.getLabelText().text(jqInputItem.val());
            }
            jssObject._undoList.push([jssObject.selector, cellName, jqInputItem.data('value')]);
            jqInputItem.data('value', cellValue);
            return cellValue;
        };
        /**
         * 
         * @returns {String}
         */
        this.isEnabled = function() {
            return thisCell.getInputItem().prop('disabled') === undefined;
        };
        this.setEnabled = function(enable, dontForce) {
            var jqInputItem = thisCell.getInputItem();
            var jqTextLabel = thisCell.getLabelText();
            if (jqInputItem.hasClass('allow_hide_on_disabled')) {
                jqInputItem.show();
                jqTextLabel.show();
                if (enable) {
                    jqTextLabel.hide();
                } else {
                    if (dontForce === undefined || dontForce === true || jqInputItem.hasClass('string')) {
                        jqInputItem.hide();
                    } else {
                        jqTextLabel.hide();
                    }
                }
            }
            jqInputItem.prop('disabled', !enable);
            return enable;
        };
        /**
         * 
         * @returns {Boolean}
         */
        this.isSelected = function() {
            return thisCell.getInputItem().hasClass(jssObject.settings.focusClassSelector);
        };

        /**
         * 
         * @returns {String}
         */
        this.setSelected = function(select) {
            if (select) {
                thisCell.getInputItem().focus();
            } else {
                thisCell.getInputItem().blur();
            }
        };

        /**
         * 
         * @returns {String}
         */
        this.restoreDataValue = function() {
            var jqInputItem = thisCell.getInputItem();
            var dataValue = jqInputItem.data('value');
            if (jqInputItem.hasClass('boolean')){
                jqInputItem.prop('checked' , dataValue);                         
            } else {
                jqInputItem.val(dataValue);
                thisCell.getLabelText().text(dataValue);   
            }
            return dataValue;
        };
    };
}(jQuery));

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




function jss_includeCSS(css, media) {
    var link = document.createElement("link");
    link.href = css;
    link.type = "text/css";
    link.rel = "stylesheet";
    if (media !== undefined) {
        link.media = media;
    }
    document.getElementsByTagName("head")[0].appendChild(link);
}

// IE Support:
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

