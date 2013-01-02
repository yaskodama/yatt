
$(document).ready(function(){
    var lv = new LoginValidator();
    var lc = new LoginController();
	/* add by yass */
    var hc = new HomeController();
	/* add by yas */
    loadBundles(null);
    jQuery('.open-LayoutGroup').click(function() {
	var k=jQuery('.glength')[0].value;
	for(var i=0; i<k; i++) {
	    jQuery('.modal-group'+i).empty().append(jQuery('#group'+i)[0].value);
            jQuery('.input-group'+i).attr({value:jQuery('#group'+i)[0].value});
	}
	});
    jQuery('.open-ContentsGroup').click(function() {
	if(jQuery('#Code').is('*')) jQuery('#input-cntcode').attr({value: jQuery('#Code')[0].value });
	if(jQuery('#title').is('*')) jQuery('.input-title').attr({value:jQuery('#title')[0].value });
	if(jQuery('#url').is('*')) jQuery('.input-url').attr({value: jQuery('#url')[0].value });
	if(jQuery('#title').is('*')) jQuery('#modal-title').empty().append(jQuery('#title')[0].value);
	if(jQuery('#url').is('*')) jQuery('#modal-url').empty().append(jQuery('#url')[0].value);
        if(jQuery('#optionsRadios1').is('*')) {
	    jQuery('#modal-radio').empty().append(jQuery('input[name="optionsRadios"]:checked').val());
	    jQuery('.input-type').attr({value: jQuery('input[name="optionsRadios"]:checked').val()});
	}
	});
    jQuery('select#lang').empty().append('<option value="browser">Indicated by the browser</option><option value="en">en</option><option value="ja">ja</option>');
    jQuery('#langbrowser').text('('+jQuery.i18n.browserLang()+')');                                      
    jQuery('#lang').change(function() {
        var selection = jQuery('#lang option:selected').val();
        jQuery('#langbrowser').append(selection);
        loadBundles(selection != 'browser' ? selection : null);
        jQuery('#langbrowser').empty();
        if(selection == 'browser') {                                                                      
            jQuery('#langbrowser').text('('+jQuery.i18n.browserLang()+')');                               
        }                                                                                                
        });
    jQuery('.open-UpdateAndEnd').click(function() {
	if(jQuery('#Code').is('*')) jQuery('#input-leccode').attr({value: jQuery('#Code')[0].value });
	});
    });
    function loadBundles(lang) {
        jQuery.i18n.properties({
	    name:'Messages', 
            path:'/bundle/', 
            mode:'both',
            language:lang, 
            callback: function() {
            	updateExamples();
	    }
        });
    }
    function updateExamples() {
	jQuery('#welcome_i18n').empty().append(jQuery.i18n.prop('welcome_i18n'));
	jQuery('#timetable_i18n').empty().append(jQuery.i18n.prop('timetable_i18n'));
	jQuery('#library_i18n').empty().append(jQuery.i18n.prop('library_i18n'));
	jQuery('#lectures_i18n').empty().append(jQuery.i18n.prop('lectures_i18n'));
	jQuery('#eportfolio_i18n').empty().append(jQuery.i18n.prop('eportfolio_i18n'));
	jQuery('#ranking_i18n').empty().append(jQuery.i18n.prop('ranking_i18n'));
	jQuery('#requirements_i18n').empty().append(jQuery.i18n.prop('requirements_i18n'));
	jQuery('#username_i18n').empty().append(jQuery.i18n.prop('username_i18n'));
	jQuery('#password_i18n').empty().append(jQuery.i18n.prop('password_i18n'));
	jQuery('#login_name_i18n').empty().append(jQuery.i18n.prop('login_name_i18n'));
	jQuery('#logout_name_i18n').empty().append(jQuery.i18n.prop('logout_name_i18n'));
	jQuery('#edit_name_i18n').empty().append(jQuery.i18n.prop('edit_name_i18n'));
	jQuery('#edit_name_2_i18n').empty().append(jQuery.i18n.prop('edit_name_2_i18n'));
	jQuery('#language_i18n').empty().append(jQuery.i18n.prop('language_i18n'));
	jQuery('#event_meeting_i18n').empty().append(jQuery.i18n.prop('event_meeting_i18n'));
	jQuery('#monday_i18n').empty().append(jQuery.i18n.prop('monday_i18n'));
	jQuery('#tuesday_i18n').empty().append(jQuery.i18n.prop('tuesday_i18n'));
	jQuery('#wednesday_i18n').empty().append(jQuery.i18n.prop('wednesday_i18n'));
	jQuery('#thursday_i18n').empty().append(jQuery.i18n.prop('thursday_i18n'));
	jQuery('#friday_i18n').empty().append(jQuery.i18n.prop('friday_i18n'));
	jQuery('#saturday_i18n').empty().append(jQuery.i18n.prop('saturday_i18n'));
	jQuery('#first_lec_i18n').empty().append(jQuery.i18n.prop('first_lec_i18n'));
	jQuery('#second_lec_i18n').empty().append(jQuery.i18n.prop('second_lec_i18n'));
	jQuery('#third_lec_i18n').empty().append(jQuery.i18n.prop('third_lec_i18n'));
	jQuery('#fourth_lec_i18n').empty().append(jQuery.i18n.prop('fourth_lec_i18n'));
	jQuery('#fifth_lec_i18n').empty().append(jQuery.i18n.prop('fifth_lec_i18n'));
	jQuery('#fromthrough_i18n').empty().append(jQuery.i18n.prop('fromthrough_i18n'));
	jQuery('#signin_i18n').empty().append(jQuery.i18n.prop('signin_i18n'));
	jQuery('#username_i18n').empty().append(jQuery.i18n.prop('username_i18n'));
	jQuery('#edit2_name_2_i18n').empty().append(jQuery.i18n.prop('edit2_name_2_i18n'));
	jQuery('.confirm_i18n').empty().append(jQuery.i18n.prop('confirm_i18n'));
	jQuery('.delete_i18n').empty().append(jQuery.i18n.prop('delete_i18n'));
	jQuery('.copy_i18n').empty().append(jQuery.i18n.prop('copy_i18n'));
	jQuery('#update_and_edit_i18n').empty().append(jQuery.i18n.prop('update_and_edit_i18n'));
	jQuery('#objective_i18n').empty().append(jQuery.i18n.prop('objective_i18n'));
	jQuery('#textbooks_i18n').empty().append(jQuery.i18n.prop('textbooks_i18n'));
	jQuery('#references_i18n').empty().append(jQuery.i18n.prop('references_i18n'));
	jQuery('#advreferences_i18n').empty().append(jQuery.i18n.prop('advreferences_i18n'));
	jQuery('#modal_title_i18n').empty().append(jQuery.i18n.prop('modal_title_i18n'));
	jQuery('.title_i18n').empty().append(jQuery.i18n.prop('title_i18n'));
	jQuery('.type_i18n').empty().append(jQuery.i18n.prop('type_i18n'));
	jQuery('#modal_textbooks_i18n').empty().append(jQuery.i18n.prop('modal_textbooks_i18n'));
	jQuery('#modal_objectives_i18n').empty().append(jQuery.i18n.prop('modal_objectives_i18n'));
	jQuery('#modal_references_i18n').empty().append(jQuery.i18n.prop('modal_references_i18n'));
	jQuery('#modal_advreferences_i18n').empty().append(jQuery.i18n.prop('modal_advreferences_i18n'));
	jQuery('#modal_advreferences_i18n').empty().append(jQuery.i18n.prop('modal_advreferences_i18n'));
	jQuery('#update_button_i18n').empty().append(jQuery.i18n.prop('update_button_i18n'));
	jQuery('#cancel_and_edit_off_i18n').empty().append(jQuery.i18n.prop('cancel_and_edit_off_i18n'));
	jQuery('#signout_i18n').empty().append(jQuery.i18n.prop('signout_i18n'));
	jQuery('#signin_name_i18n').empty().append(jQuery.i18n.prop('signin_name_i18n'));
	jQuery('#message_title_i18n').empty().append(jQuery.i18n.prop('message_title_i18n'));
	jQuery('#page_not_found_i18n').empty().append(jQuery.i18n.prop('page_not_found_i18n'));
	jQuery('#author_name_i18n').empty().append(jQuery.i18n.prop('author_name_i18n'));
	jQuery('#accounts_name_i18n').empty().append(jQuery.i18n.prop('accounts_name_i18n'));
	jQuery('#log_title_i18n').empty().append(jQuery.i18n.prop('log_title_i18n'));
	jQuery('#clayout_button_i18n').empty().append(jQuery.i18n.prop('clayout_button_i18n'));
	jQuery('#edit_back_button_i18n').empty().append(jQuery.i18n.prop('edit_back_button_i18n'));
    }
