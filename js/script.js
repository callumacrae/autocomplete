var words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
	'nine', 'ten', 'Callum'];

$('#basic').autocomplete(words);

$('#operator').autocomplete({
	caseSensitive: true,
	minChars: 2,
	operator: '@',
	words: words
});