module.exports.slugify = function(text) {
	return text.toString().toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

module.exports.isInt=function (value) {
                                    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
