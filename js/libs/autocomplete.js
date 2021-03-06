(function ($) {

/**
 * Adds autocomplete functionality to the textarea or input that it is
 * called on.
 *
 * @param {object} options Either an object containing some options - see the
 *	.extend call below in order to see what options are available - or just an
 *	array of words.
 */
$.fn.autocomplete = function (options) {
	"use strict";

	var id = Math.random(),
		$textarea = this;

	if ($.isArray(options)) {
		options = {
			words: options
		};
	}

	options = $.extend({}, {
		callback: false, // Callback for if something is autocompleted
		caseSensitive: false, // Case sensitive?
		maxWords: 10, // List will not display if more words than this
		minChars: 1, // Minimum characters to autocomplete on
		operator: '', // Operator to put before words to be autocompleted
		words: [] // Words to be autocompleted (alphanumeric only)
	}, options);

	// STEAK
	this.keypress(function (e) {
		var $this = $(this),
			cursor = this.selectionStart,
			finalWords = [],
			$ul = $('#autocomplete-ul'),
			value = $this.val();

		value = value.slice(0, cursor) + String.fromCharCode(e.charCode) +
			value.slice(cursor);
		cursor++;

		// Internet Explorer is not worthy of my time
		if (typeof cursor === 'undefined') {
			return;
		}

		// Must be last character in word
		if (value.length !== cursor &&
			value.slice(cursor, cursor + 1) !== ' ') {
			$ul.hide();
			return;
		}

		value = value.slice(value.lastIndexOf(' ', cursor - 1) + 1, cursor);

		if (options.operator) {
			if (value.indexOf(options.operator) !== 0) {
				$ul.hide();
				return;
			}

			value = value.slice(1);
		}

		// If too short, kill here
		if (value.length < options.minChars) {
			$ul.hide();
			return;
		}

		$.each(options.words, function (i, word) {
			if ((options.caseSensitive && word.indexOf(value) === 0) ||
				word.toLowerCase().indexOf(value.toLowerCase()) === 0) {
				finalWords.push(word);
			}
		});

		if (finalWords.length && finalWords.length < options.maxWords) {
			$ul.html('')
				.css('display', 'inline-block')
				.data({
					current: id,
					cursor: cursor,
					word: value
				});

			$.each(finalWords, function (i, word) {
				$ul.append('<li>' + word + '</li>');
			});
		} else {
			$ul.hide();
		}
	});

	this.keydown(function (e) {
		if ($('#autocomplete-ul').is(':hidden')) {
			return;
		}

		// When a key is pressed that will move the cursor but not fire the
		// keypress event, hide the ul
		if ([37, 38, 39, 40, 46].indexOf(e.keyCode) !== -1) {
			$('#autocomplete-ul').hide();
			return;
		}

		// When tab is pressed, complete if possible
		if (e.keyCode === 9) {
			e.preventDefault();

			if ($('#autocomplete-ul li').length === 1) {
				$('#autocomplete-ul li').click();
			}
		}
	});

	this.click(function () {
		$('#autocomplete-ul').hide();
	});


	if (!$('#autocomplete-ul').length) {
		$('<ul id="autocomplete-ul"></ul>').appendTo('body');
	}

	$('#autocomplete-ul').on('click', 'li', function () {
		var $this = $(this),
			data = $this.parent('ul').data(),
			text = $textarea.val(),
			oldText = text,
			value = $this.text();

		// This event is for another form :-(
		if (data.current !== id) {
			return;
		}

		// Generate text. Use whole word from the autocomplete list, not just
		// the last part.
		text = text.slice(0, data.cursor - data.word.length) +
			value + text.slice(data.cursor);

		if ($.isFunction(options.callback)) {
			options.callback.call(this, value, oldText, text);
		}

		if (oldText.length === data.cursor) {
			text += ' ';
			data.cursor++;
		}

		$textarea.val(text)
			.focus();

		data.cursor += value.length - data.word.length;
		$textarea.get(0).selectionStart = data.cursor;
		$textarea.get(0).selectionEnd = data.cursor;

		$this.parent('ul').hide();
	});
};

})(jQuery);
