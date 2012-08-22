$('.destroy').live('click', function(e){
	e.preventDefault();
	if(confirm('Are you sure you want to delete that item?')){
		var element = $(this),
			form = $('<form></form>');
		form
			.attr({
				method: 'POST',
				action: element.attr('href')
			})
			.hide()
			.append('<input type="hidden" />')
			.find('input')
			.attr({
				'name': '_method',
				'value': 'put'
			})
			.append('<input type="hidden" />')
			.find('input')
			.attr({
				'name': 'document[trashed]',
				'value': true
			})
			.end();
			//.submit();
	}
});