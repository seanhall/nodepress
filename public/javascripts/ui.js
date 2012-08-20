$(document).ready(function(){
	/*$('#postcoll').mouseenter(function(){
		$('#postsub').collapse('show');
	});
	$('#postcoll').mouseleave(function(){
		$('#postsub').collapse('hide');
	});

	$('#pagecoll').mouseenter(function(){
		$('#pagesub').collapse('show');
	});
	$('#pagecoll').mouseleave(function(){
		$('#pagesub').collapse('hide');
	});
	$('ul.nav.nav-tabs li a').mouseenter(function(){
		$(this).tab('show');
	});
	$('ul.nav.nav-tabs li a').mouseleave(function(){
		$(this).tab('hide');
	});*/
	if(window.location.pathname === '/'){
		$('li#home').addClass('active');
	}
	else{
		var loc = window.location.pathname.substring(1,window.location.pathname.length);
		$('li#' + loc).addClass('active');
	}
	$('.home #postsubmit').click(function(e){
		e.preventDefault();
		$('form#quickpost').append('<input type="hidden" name="document[published]" value="true"><input type="hidden" name="document[pubdate]" value="' + Date.now + '">');
		$('form#quickpost').submit();
	});
	$('form#postedit button').click(function(e){
		e.preventDefault();
		$('textarea#postbody').val($('.te iframe').contents().find('body#editor').html());
		console.log($('textarea#postbody').val());
		$('form#postedit').append('<input type="hidden" name="document[modified]" value="' + Date.now() + '">');
		$('form#postedit').submit();
	});
	$('form#pageedit button').click(function(e){
		e.preventDefault();
		$('textarea#pagebody').val($('.te iframe').contents().find('body#editor').html());
		$('form#pageedit').submit();
	});
	$('td').each(function(i){
		$(this).mouseenter(function(){
			$(this).find('.actions').css('visibility','visible');
		});
		$(this).mouseleave(function(){
			$(this).find('.actions').css('visibility','hidden');
		});
	});
	var trashItem = function trashItem(id){
		$.ajax({
			url: window.location + '/' + id,
			type: 'PUT',
			dataType: 'json',
			data: {
				document: {
					trashed: true
				}
			}
		})
		.done(function(data,textStatus,jqXHR){
			console.log('done');
			console.dir(data);
			console.log(textStatus);
			console.dir(jqXHR);
			window.location = '/posts';
		})
		.fail(function(data,textStatus,jqXHR){
			console.log('wtf');
			console.log(textStatus);
			console.dir(jqXHR);
			//console.log(errorThrown);
			window.location = '/posts';
		});
	};
	$('.postrow .destroy').live('click', function(e){
		trashItem($(this).parents('td').attr('id'));
	});
	var deleteItem = function deleteCategory(id,dir){
		$.ajax({
			url: window.location + '/' + id,
			type: 'DELETE',
			dataType: 'json',
			data: {
				_id: id
			}
		})
		.done(function(data,textStatus,jqXHR){
			console.log('done');
			console.dir(data);
			console.log(textStatus);
			console.dir(jqXHR);
			window.location = '/' + dir;
		})
		.fail(function(data,textStatus,jqXHR){
			console.log('wtf');
			console.log(textStatus);
			console.dir(jqXHR);
			//console.log(errorThrown);
			window.location = '/' + dir;
		});
	};
	var pageCopy = function pageCopy(id){
		$.ajax({
			url: '/pages/' + id + '/copy',
			type: 'POST',
			dataType: 'json'
		})
		.done(function(textStatus,jqXHR){
			console.log('done');
			console.log(textStatus);
		})
		.fail(function(textStatus,jqXHR){
			console.log('fail');
			console.log(textStatus);
		});
	};
	$('.pagecopylink').live('click', function(e){
		e.preventDefault();
		pageCopy($(this).attr('id'));
	});
	$('.catrow .destroy').live('click', function(e){
		deleteItem($(this).parents('td').attr('id'),'categories');
	});
	$('.tagrow .destroy').live('click', function(e){
		deleteItem($(this).parents('td').attr('id'),'tags');
	});
	$('.pagerow .destroy').live('click', function(e){
		deleteItem($(this).parents('td').attr('id'),'pages');
	});
	$('.mediarow .destroy').live('click', function(e){
		deleteItem($(this).parents('td').attr('id'),'media');
	});
});

var TE = function TE(id){
	new TINY.editor.edit('editor',{
    id:id, // (required) ID of the textarea
    width:510, // (optional) width of the editor
    height:175, // (optional) heightof the editor
    cssclass:'te', // (optional) CSS class of the editor
    controlclass:'tecontrol', // (optional) CSS class of the buttons
    rowclass:'teheader', // (optional) CSS class of the button rows
    dividerclass:'tedivider', // (optional) CSS class of the button diviers
    //controls:['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|', 'orderedlist', 'unorderedlist', '|' ,'outdent' ,'indent', '|', 'leftalign', 'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'n', 'font', 'size', 'style', '|', 'image', 'hr', 'link', 'unlink', '|', 'print'], // (required) options you want available, a '|' represents a divider and an 'n' represents a new row
    controls:['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|', 'orderedlist', 'unorderedlist', '|' ,'outdent' ,'indent', '|', 'leftalign', 'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'n', 'font', 'size', 'style', '|', 'image', 'hr', 'link', 'unlink'],
    footer:true, // (optional) show the footer
    fonts:['Verdana','Arial','Georgia','Trebuchet MS'],  // (optional) array of fonts to display
    xhtml:true, // (optional) generate XHTML vs HTML
    cssfile:'/javascripts/tinyeditor/tinyeditor.css', // (optional) attach an external CSS file to the editor
    //content:'starting content', // (optional) set the starting content else it will default to the textarea content
    css:'body{background-color:#fff}', // (optional) attach CSS to the editor
    bodyid:'editor', // (optional) attach an ID to the editor body
    footerclass:'tefooter', // (optional) CSS class of the footer
    toggle:{text:'source',activetext:'wysiwyg',cssclass:'toggle'}, // (optional) toggle to markup view options
    resize:{cssclass:'resize'} // (optional) display options for the editor resize
});
};