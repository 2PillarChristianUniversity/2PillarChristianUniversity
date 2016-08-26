module.exports = function(req, res, next) {
	console.log(req.cookies);
	if (typeof req.cookies['ng-security-authorization'] != 'undefined') {
		console.log(123);
		if(req.headers['authorization'] == req.cookies['ng-security-authorization']) {
			console.log(3434);
			next();
		} else {
	  		return res.redirect('/404_error/');
	  	}
	} else {
  		return res.redirect('/404_error/');
  	}
}