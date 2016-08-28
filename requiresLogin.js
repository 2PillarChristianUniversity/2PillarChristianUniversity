module.exports = function(req, res, next) {
	if (typeof req.cookies['ng-security-authorization'] != 'undefined') {
		if(req.headers['authorization'] == req.cookies['ng-security-authorization']) {
			next();
		} else {
	  		return res.redirect('/404_error/');
	  	}
	} else {
  		return res.redirect('/404_error/');
  	}
}
