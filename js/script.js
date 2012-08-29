var words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
	'nine', 'ten', 'Callum'];

$('#basic').autocomplete(words);

$('#operator').autocomplete({
	caseSensitive: true,
	operator: '@',
	words: words
});