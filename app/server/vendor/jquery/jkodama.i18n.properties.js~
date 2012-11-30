/* jKodama */
(function($) {
$.kodama = {};

$.kodama.map = {};

$.kodama.properties = function(settings) {
    var defaults = {
        name:           'Messages',
        language:       '',
        path:           '',  
        mode:           'vars',
        cache:		false,
        encoding:       'UTF-8',
        callback:       null
    };
    var name = "json/Messages_ja.json"
    settings = $.extend(defaults, settings);
    if(settings.language === null || settings.language == '') {
	settings.language = $.kodama.browserLang();
    }	
    if(settings.language === null) {settings.language='';}
    loadAndParseFile(name,settings);
    /*    var files = getFiles(settings.name);
    for(i=0; i<files.length; i++) {
      loadAndParseFile(settings.path + files[i] + '.properties', settings);
      if(settings.language.length >= 2) {
        loadAndParseFile(settings.path + files[i] + '_' + settings.language.substring(0, 2) +'.properties', settings);
      }
      if(settings.language.length >= 5) {
            loadAndParseFile(settings.path + files[i] + '_' + settings.language.substring(0, 5) +'.properties', settings);
      }
    }
    } */
    if(settings.callback){ settings.callback(); }
};

$.kodama.prop = function(key) {
    var value = $.kodama.map[key];
window.alert(value);
    return value;
};

$.kodama.browserLang = function() {
    return normaliseLanguageCode(navigator.language /* Mozilla */ || navigator.userLanguage /* IE */);
}

function getFiles(names) {
	return (names && names.constructor == Array) ? names : [names];
}

function normaliseLanguageCode(lang) {
    lang = lang.toLowerCase();
    if(lang.length > 3) {
        lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
    }
    return lang;
}

function loadAndParseFile(name,settings) {
    $.getJSON(name, function(data,status) {
	parseData(data);
    });
}

function parseData(data) {
    var parsed = '';
      for(var i in data) {
	switch(data[i].division) {
	  case "top":
	    for(var j in data[i].item) {
	      var n = data[i].item[j].name;
              var v = data[i].item[j].contents;
	      $.kodama.map[n] = v;
	      parsed += n + "=" + v + ";";
	    }
	    break;
	  case "bottom":
	    for(var j in data[i].item) {
	      parsed += data[i].item[j].name + "=" + data[i].item[j].contents + ";";
	    }
	    break;
	  default:
	}
      }
    }
})(jQuery);
