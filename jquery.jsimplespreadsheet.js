/**
 * jSimpleSpreadsheet 1.0
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


if (typeof KeyEvent == "undefined") {
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
	        DOM_VK_DELETE: 46,
	        
	    };
	}

(function ( $ ) {      
	$.widget( "tdg.jSimpleSpreadsheet", {
		
		options: {
        	onFocus: function(colName, rowIndex, valueRaw){
				console.log(colName + rowIndex + ' focus! value: ' + valueRaw);
			},
			onBlur: function(colName, rowIndex, valueRaw){
				console.log(colName + rowIndex + ' blur! value: ' + valueRaw);
				return true;
			},
			
			id: _jSmpSprsht_Rnd(),
			__widget__: null,
			jSmpSprshtTableSelector : null
			
		},
		change: function(values) {
			var widget = this.__widget__;
			$.each(values, function(cellname, value){
				widget.makeCalc(widget, cellname.substring(0), cellname.substring(1), value); // Better?
			})
		},	
		enableCell: function(cellName, enable, dontForce){
			console.log(enable);
			console.log(dontForce);
			var selector = '.' + this.jSmpSprshtTableSelector + ' input[data-cell-name="' + cellName.toUpperCase() + '"]';
			var selector_disabled = '.' + this.jSmpSprshtTableSelector + ' span[data-cell-name="' + cellName.toUpperCase() + '"]';
			if(enable !== undefined){
				if(enable){
					$(selector).show();
					$(selector).prop('disabled', '');
					$(selector).data('disabled', undefined);
					$(selector_disabled).hide();				
				}else{
					if (dontForce===undefined||dontForce==true){
						$(selector).hide();
						$(selector_disabled).show();
					} else{
						$(selector).prop('disabled',true);
						$(selector).show();
						$(selector_disabled).hide();
					}
					
					$(selector).data('disabled', true);
				}
			} else {
				return ( $(selector).data('disabled') === undefined )
			}
			return $(selector).val()
		},
		cell: function(cellName, value){
			console.log(value);
			var selector = '.' + this.jSmpSprshtTableSelector + ' input[data-cell-name="' + cellName.toUpperCase() + '"]';
			var selector_disabled = '.' + this.jSmpSprshtTableSelector + ' span[data-cell-name="' + cellName.toUpperCase() + '"]';
			console.log(selector);
			if (value !== undefined){
				$(selector).val(value);
								
			}
			$(selector_disabled).html($(selector).val());
			return $(selector).val()
		},
		_create: function() {
			console.log('start');
	        var jssthis = this.element;
	        this.__widget__ = this;
	        var widget = this;
			var jSmpSprshtTableSelector = 'jSimpleSpreadsheet-runner-' + this.options.id;
			this.jSmpSprshtTableSelector = jSmpSprshtTableSelector;
			$(jssthis).addClass(jSmpSprshtTableSelector);
			$(jssthis).addClass('jSimpleSpreadsheet-runner');
			jSmpSprshtTableSelector = 'table.' + jSmpSprshtTableSelector;
			
			
			var colIndex;
			var rowIndex = 0;
			var inputStyle='';
			var textStyle='';
			
			$(jSmpSprshtTableSelector + ' tr').each(function() {
				colIndex = 1;
				$(this).children('td').each(function(){ 
					var valueRaw =  $(this).text().trim();
		        	var colName = String.fromCharCode(colIndex + 64);    
		        	if ($(this).data('disabled')=== undefined){
			        	inputStyle = '';
						textStyle = 'display: none';
	            	} else {
	            		inputStyle = 'display: none';
	            		textStyle = '';
	            	}
					$(this).html('<input type="text' + 
									  '" name="' + colName + rowIndex + '_' + colName + '_' + rowIndex +
									  '" class="value" style="' + inputStyle + 
									  '" data-cell-name="' + colName + rowIndex + 
									  '" data-col-name="' + colName + 
									  '" data-col="' + colIndex + 
									  '" data-row="' + rowIndex + 
									  '" data-value="' + valueRaw + 
									  '" value="'+ valueRaw + 
									  '">' + 
									  '<span data-cell-name="' + colName + rowIndex + 
									  '" style="' + textStyle +
									  '" class="value">'+ valueRaw + 
									  '</span>');
					
					colIndex++;
	            });
	            rowIndex++;
	        });
			
			
			/**
			 * evento: Ao focar célula
			 * 
			 */
			
			$(jSmpSprshtTableSelector + " input").focus(function() {
	            var colName = $(this).data('col-name');
	            var rowIndex = $(this).data('row');
	            var valueRaw = $(this).val();
	        	$(this).addClass('focus');
	        	widget.options.onFocus(colName, rowIndex, valueRaw);	                         
	        });
	        
			/**
			 * evento: Ao sair da célula
			 * 
			 */
			
	        $(jSmpSprshtTableSelector + " input").blur(function() {
	            var colName = $(this).data('col-name');
	            var rowIndex = $(this).data('row');
	            var valueRaw = $(this).val();
	            var selector_disabled =  jSmpSprshtTableSelector + ' span[data-cell-name="' + colName + rowIndex + '"]';
	            $(this).removeClass('focus');
	            $(selector_disabled).html(valueRaw);
	            r = widget.options.onBlur(colName, rowIndex, valueRaw);
	            if (r == false){	            	
		            $(this).focus();
	            }     
	            
	        });	
			
			/**
	         * evento: seleção do texto ao focar célula
	         */
	        
	        $(jSmpSprshtTableSelector + ' input[type=text]').focus(function() {
	            this.select();
	        });
	        
	        /**
	         * evento: ao pressionar teclas direcionais ou Enter
	         */
	        
	        $(jSmpSprshtTableSelector + ' input').keydown(function(event) {
	            var next;
	            switch (event.which) {
	                case KeyEvent.DOM_VK_RETURN:
	                case KeyEvent.DOM_VK_DOWN:
	                    event.preventDefault();
	                    next = $(jSmpSprshtTableSelector + ' input[data-col="' + ($(this).data('col')) + '"][data-row="' + ($(this).data('row') + 1) + '"]');
	                    next.focus();
	                    break;
	                case KeyEvent.DOM_VK_UP:
	                    event.preventDefault();
	                    next = $(jSmpSprshtTableSelector + ' input[data-col="' + ($(this).data('col')) + '"][data-row="' + ($(this).data('row') - 1) + '"]');
	                    next.focus();
	                    break;
	                case KeyEvent.DOM_VK_RIGHT:
	                    if (this.value.length === _jSmpSprsht_getPosition(this)) {
	                        event.preventDefault();
	                        next = $(jSmpSprshtTableSelector + ' input[data-col="' + ($(this).data('col') + 1) + '"][data-row="' + ($(this).data('row')) + '"]')
	                        next.focus();
	                    }
	                    break;
	                case KeyEvent.DOM_VK_LEFT:
	                    if (_jSmpSprsht_getPosition(this) === 0) {
	                        event.preventDefault();
	                        next = $(jSmpSprshtTableSelector + ' input[data-col="' + ($(this).data('col') - 1) + '"][data-row="' + ($(this).data('row')) + '"]')
	                        next.focus();
	                    }
	                    break;
	            }
	        });
	    }
	          
	} );
	
}( jQuery ));

/**
 * _jSmpSprsht_Rnd 
 * Returns a random number of 1 to 99999
*/		
function _jSmpSprsht_Rnd (){
	return Math.round(Math.random() * 100000);
}


/**
 * _jSmpSprsht_getPosition
 * Returns the caret (cursor) position of the specified text field.
 * Return value range is 0-oField.value.length.
 * Original method: doGetCaretPosition
 * https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
*/
function _jSmpSprsht_getPosition(oField) {
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
