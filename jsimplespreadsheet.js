/**
 * JSimpleSpreadsheet 4.0.0
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

"use strict";


class JSimpleSpreadsheet {
    cells = {};
    _colLength = 0;
    _rowLength = 0;

    constructor(table, props) {
        this.table = (typeof (table) == 'string') ? document.querySelectorAll(table)[0] : table;
        this.props = { ...this.props, ...props };
        if (this.props.theme) {
            var link = document.createElement("link");
            link.href = this.props.theme;
            link.type = "text/css";
            link.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(link);
            this.table.classList.add(this.props.defaultClass);
        }
        this._fill(this.table, 0);
    }

    props = {
        onFocus: function (colName, rowIndex, element) {
            // nothing
        },
        onBlur: function (colName, rowIndex, element) {
            // nothing
        },
        onChange: function (colName, rowIndex, valueRaw, oldValueRaw, element) {
            return true;
        },
        tbodySelector: 'tbody',
        theme: null,
        trSelector: 'tr',
        tdSelector: 'td',
        thSelector: 'th',
        ignoreThSelector: true,
        hasColumnHeader: true,
        hasRowHeader: true,
        cellClassSelectorPreffix: 'cell_',
        focusClassSelector: 'focus',
        defaultClass: 'jss_default_class',
        navigable: true
    }

    get colLength() {
        return this._colLength;
    };

    set colLength(value) {
        this._colLength = value;
    };

    get rowLength() {
        return this._rowLength;
    };

    set rowLength(value) {
        this._rowLength = value;
    };

    get tbody() {
        var tbody;
        if (this.table.querySelectorAll('*').length == 0) {
            tbody = document.createElement(this.props.tbodySelector);
            this.table.appendChild(tbody);
        } else {
            tbody = this.table.querySelectorAll(this.props.tbodySelector)[0];
            if (!tbody) {
                tbody = this.table;
            }
        }
        return tbody;
    }

    cellChangeEvent(event) {
        var element = event.target;
        var cell = this.getCellByData(element.dataset);
        var change = this.props.onChange(
            JSimpleSpreadsheetCell.getColumnNameChar(element.dataset.column),
            element.dataset.row,
            cell.value,
            cell.lastValue,
            cell);
        if (!change) {
            cell.value = cell.lastValue;
        } else {
            cell.lastValue = cell.value;
        }
    }

    cellBlurEvent(event) {
        var element = event.target;
        var cell = this.getCellByData(element.dataset);
        this.props.onBlur(JSimpleSpreadsheetCell.getColumnNameChar(element.dataset.column), element.dataset.row, cell);
    }

    cellFocusEvent(event) {
        var element = event.target;
        var cell = this.getCellByData(element.dataset);
        this.props.onFocus(JSimpleSpreadsheetCell.getColumnNameChar(element.dataset.column), element.dataset.row, cell);
    }

    cellKeyboardEvent(event) {
        var element = event.target;
        var colIndex = element.dataset.column * 1;
        var rowIndex = element.dataset.row * 1;
        var nextCol = colIndex * 1;
        var nextRow = rowIndex * 1;
        var confirmNavigate = false;
        var length;
        var selectionStart;
        if (element instanceof HTMLInputElement) {
            length = element.value.length;
            selectionStart = element.selectionStart;
        } else {
            selectionStart = window.getSelection().getRangeAt(0).endOffset;
            length = element.innerText.length;
        }
        switch (event.which) {
            case KeyEvent.DOM_VK_RETURN:
            case KeyEvent.DOM_VK_DOWN:
                event.preventDefault();
                nextRow++;
                confirmNavigate = true;
                break;
            case KeyEvent.DOM_VK_UP:
                event.preventDefault();
                nextRow--;
                confirmNavigate = true;
                break;
            case KeyEvent.DOM_VK_RIGHT:
                if (length === selectionStart) {
                    event.preventDefault();
                    nextCol++;
                    confirmNavigate = true;
                }
                break;
            case KeyEvent.DOM_VK_LEFT:
                if (selectionStart === 0) {
                    event.preventDefault();
                    nextCol--;
                    confirmNavigate = true;
                }
                break;
        }
        if (confirmNavigate) {
            var cellToMove = this.getCellByIndex(nextCol, nextRow);
            if (cellToMove) cellToMove.setSelected(true);
        }
    }

    _fill(elements, cellRow) {
        var cellColumn = 1;
        for (let element of elements.children) {
            switch (element.localName) {
                case this.props.tbodySelector:
                    this._fill(element, cellRow);
                    break;
                case this.props.trSelector:
                    if (element.querySelectorAll(this.props.tdSelector).length > 0 || !this.props.ignoreThSelector) {
                        this._fill(element, ++cellRow);
                        this.rowLength = cellRow > this.rowLength ? cellRow : this.rowLength;
                    }
                    break;
                case this.props.thSelector:
                    if (this.props.ignoreThSelector) {
                        break;
                    }
                case this.props.tdSelector:
                    var cellOriginalName = JSimpleSpreadsheetCell.getCellNameByIndex(cellColumn, cellRow);
                    var cellName = element.dataset.name ? element.dataset.name : cellOriginalName;
                    if (element.dataset.cell == undefined) {
                        var cellNameFull = this.props.cellClassSelectorPreffix + cellName;
                        var newCell;
                        var jssCellClass;
                        switch (element.dataset.type) {
                            case 'boolean':
                                jssCellClass = JSimpleSpreadsheetCellBoolean;
                                break;
                            case 'richtext':
                                jssCellClass = JSimpleSpreadsheetCellRichText;
                                break;
                            case 'number':
                                jssCellClass = JSimpleSpreadsheetCellNumber;
                                break;
                            default:
                                jssCellClass = JSimpleSpreadsheetCell;
                        }
                        newCell = new jssCellClass(element, cellName, cellNameFull, cellColumn, cellRow, cellOriginalName);  
                        newCell.addJSSEventListener(this, 'keydown', this.cellKeyboardEvent);
                        newCell.addJSSEventListener(this, 'change', this.cellChangeEvent);
                        newCell.addJSSEventListener(this, 'focus', this.cellFocusEvent);
                        newCell.addJSSEventListener(this, 'blur', this.cellBlurEvent);
                        this.cells[cellName] = newCell;
                    }
                    cellColumn++;
                    break;
            }
        }
        if (cellColumn > this.colLength) {
            this.colLength = cellColumn;
        }
        if (cellRow > this.colLength) {
            this.rowLength = cellRow;
        }
    }

    getCell(item) {
        var self = this;
        if (typeof (item) == 'string') {
            var itemName = item;
            if (this.cells[itemName]) {
                return this.cells[itemName];
            }
            var cells = Object.entries(self.cells);
            var cellReturn = Object.entries(cells).filter(([key, cell]) => {
                var cellItem = cell[1];
                if (cellItem.cellOriginalName === item) {
                    return cellItem;
                }
            });
            try {
                return cellReturn[0][1][1];
            } catch (e) {
                return null;
            }
        } else if (Array.isArray(item)) {
            var items = item;
            var resultFilter = items.map((cell) => {
                return self.cells[cell];
            });
            return new JSimpleSpreadsheetMultipleCells(resultFilter);
        }
    }

    getCellByIndex(col, row) {
        return this.getCell(JSimpleSpreadsheetCell.getCellNameByIndex(col, row));
    }

    getCellByData(dataset) {
        var cellName = JSimpleSpreadsheetCell.getCellNameByIndex(dataset.column, dataset.row);
        return this.getCell(cellName);
    }

    addRow() {
        var newRow = document.createElement(this.props.trSelector);
        var tbody = this.tbody;
        tbody.appendChild(newRow);
        if (this.props.hasRowHeader) {
            var th = document.createElement(this.props.thSelector);
            th.innerHTML = this.rowLength + 1;
            newRow.appendChild(th);
        }
        for (var col = 1; col < this.colLength; col++) {
            var td = document.createElement(this.props.tdSelector);
            newRow.appendChild(td);
        }
        this._fill(tbody, 0);
    }

    addColumn() {
        var trLines = this.table.querySelectorAll(this.props.trSelector);
        var hitHeader = false;
        var rowIndex = 0;
        trLines.forEach((tr) => {
            if (this.props.hasColumnHeader && !hitHeader) {
                var th = document.createElement(this.props.thSelector);
                th.innerHTML = JSimpleSpreadsheetCell.getColumnNameChar(this.colLength);
                tr.appendChild(th);
                hitHeader = true;
            } else {
                var td = document.createElement(this.props.tdSelector);
                tr.appendChild(td);
                this._fill(tr, ++rowIndex);
            }

        });
    }
}


class JSimpleSpreadsheetValuable {
    set value(v) {
        this.setValue(v)
    }
    get value() {
        return this.getValue();
    }
    set enabled(v) {
        this.setEnabled(v)
    }
    get enabled() {
        return this.getEnabled();
    }
}


class JSimpleSpreadsheetCell extends JSimpleSpreadsheetValuable {
    constructor(tdElement, cellName, cellNameFull, cellColumn, cellRow, cellOriginalName) {
        super(tdElement, cellName, cellNameFull);
        this.cellName = cellName;
        this.cellOriginalName = cellOriginalName;
        this.cellNameFull = cellNameFull;
        this.column = cellColumn;
        this.line = cellRow;
        this.tdElement = tdElement;
        if (tdElement.dataset.ignore === undefined) {
            tdElement.getValue = function () {
                return this.innerText;
            }
            tdElement.dataset.cell = cellName;
            tdElement.classList.add(cellNameFull);
            this.originalContentHTML = tdElement.innerHTML;
            this.lastValue = tdElement.innerText;
            tdElement.innerText = '';
            this.cellInput = document.createElement('input');
            this.cellInput.value = this.originalContentHTML;
            this.cellInput.type = 'hidden';
            this.cellInput.name = cellNameFull;
            this.cellInput.id = cellNameFull;
            this.baseElementUI = this.cellInput;
            tdElement.appendChild(this.cellInput);
            this._fill();
            this.baseElementUI.classList.add('cell');
            this.baseElementUI.dataset.column = this.column;
            this.baseElementUI.dataset.row = this.line;
            this.setEnabled(tdElement.dataset.disabled === undefined);
        }
    }

    static getColumnNameChar(colNumber) {
        var numChar;
        colNumber = colNumber * 1;
        if (colNumber <= 26) {
            return String.fromCharCode(colNumber + 64);
        } else {
            var n1 = Math.floor((colNumber - 1) / 26);
            var n2 = ((colNumber - 1) % 26);
            return String.fromCharCode(n1 + 64) + String.fromCharCode(n2 + 65) ;
        } 
    }

    static getCellNameByIndex(col, row) {
        return JSimpleSpreadsheetCell.getColumnNameChar(col) + (row * 1);
    }

    addJSSEventListener(jss, eventName, callback) {
        if (this.baseElementUI) {
            this.baseElementUI.addEventListener(eventName,
                function (event) {
                    switch (eventName) {
                        case 'change':
                            jss.cellChangeEvent(event);
                            break;
                        case 'focus':
                            jss.cellFocusEvent(event);
                            break;
                        case 'blur':
                            jss.cellBlurEvent(event);
                            break;
                        default:
                            jss.cellKeyboardEvent(event);
                    }
                }
                , false);
        }
    }

    _fill() {
        this.cellInput.type = 'text';
    }

    setValue(value) {
        this.cellInput.value = value;
        this.lastValue = value;
    }

    getValue() {
        return this.cellInput.value;
    }

    setEnabled(value) {
        this.cellInput.disabled = !value;
        if (value) {
            this.cellInput.removeAttribute('data-disabled');
        } else {
            this.cellInput.dataset.disabled = 'true';
        }
    }

    setSelected(value) {
        this.baseElementUI.focus();
    }

}


class JSimpleSpreadsheetCellNumber extends JSimpleSpreadsheetCell {
    _fill() {
        this.cellInput.type = 'number';
    }
}


class JSimpleSpreadsheetCellBoolean extends JSimpleSpreadsheetCell {
    _fill() {
        if (this.originalContentHTML !== '') {
            this.label = document.createElement('label');
            this.label.htmlFor = this.cellInput.id;
            this.label.innerHTML = this.originalContentHTML;
            this.tdElement.appendChild(this.label);
        }
        this.cellInput.type = 'checkbox';
        this.lastValue = this.baseElementUI.checked;
    }
    getValue() {
        return this.baseElementUI.checked;
    }
    setValue(value) {
        this.baseElementUI.checked = value ? true : false;
    }
}


class JSimpleSpreadsheetCellRichText extends JSimpleSpreadsheetCell {
    _fill() {
        this.cellRichText = document.createElement('div');
        this.cellRichText.innerHTML = this.originalContentHTML;
        this.cellRichText.contentEditable = 'true';
        var self = this;
        // TO-DO: replace setInterval -> MutationObserver (?)
        setInterval(function () {
            if (self.cellRichText.innerHTML !== self.cellInput.value) {
                self.cellInput.value = self.cellRichText.innerHTML;
            }
        }, 500);
        this.tdElement.appendChild(this.cellRichText);
        this.baseElementUI = this.cellRichText;
    }
    setValue(value) {
        this.cellRichText.innerText = (value);
    }
    setSelected(value) {
        this.cellRichText.focus();
    }
}


class JSimpleSpreadsheetMultipleCells extends JSimpleSpreadsheetValuable {
    constructor(cells) {
        super(cells);
        this.cells = cells;
    }
    setValue(value) {
        this.cells.forEach(cell => {
            cell.setValue(value);
        })
    }
    setEnabled(value) {
        this.cells.forEach(cell => {
            cell.setEnabled(value);
        })
    }
    getValue() {
        return this.cells.map(cell => {
            return cell.getValue();
        })
    }
}


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
