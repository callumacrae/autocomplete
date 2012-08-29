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
		caseSensitive: false, // Case sensitive?
		minChars: 1, // Minimum characters to autocomplete on
		operator: '', // Operator to put before words to be autocompleted
		words: [] // Words to be autocompleted (alphanumeric only)
	}, options);

	// STEAK
	this.keyup(function (e) {
		var $this = $(this),
			code = e.keyCode,
			cursor = this.selectionStart,
			finalWords = [],
			$ul = $('#autocomplete-ul'),
			value = $this.val();

		// If not alphanumeric, return
		if ((code < 65 || code > 90) && (code < 48 || code > 57)) {
			$ul.hide();
			return;
		}

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

		// nub
		if (!value) {
			$ul.hide();
			return;
		}

		$.each(options.words, function (i, word) {
			if ((options.caseSensitive && word.indexOf(value) === 0) ||
				word.toLowerCase().indexOf(value.toLowerCase()) === 0) {
				finalWords.push(word);
			}
		});

		if (finalWords.length) {
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

	if (!$('#autocomplete-ul').length) {
		$('<ul id="autocomplete-ul"></ul>').appendTo('body');
	}

	$('#autocomplete-ul').on('click', 'li', function () {
		var $this = $(this),
			data = $this.parent('ul').data(),
			text = $textarea.val(),
			value = $this.text();

		// This event is for another form :-(
		if (data.current !== id) {
			return;
		}

		// Generate text. Use whole word from the autocomplete list, not just
		// the last part.
		text = text.slice(0, data.cursor - data.word.length) +
			value + text.slice(data.cursor);
		$textarea.val(text);

		$this.parent('ul').hide();
	});
};

})(jQuery);
