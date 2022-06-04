const User = require('../models/users');

module.exports.registerForm = (req, res) => {
    res.render('user/register.ejs');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser , (err) => {
            if(err){
                return next(err);
            }else{
                req.flash('success', 'Registration Successful!');
                res.redirect('/agency');
            }
        });
        
    } catch (e) {
        req.flash('userError' , e.message);
        res.redirect('register');
    }
}

module.exports.loginForm = (req,res) => {
    res.render('user/login.ejs');
}

module.exports.loginUser = (req,res) => {
    const { username } = req.body;
    req.flash('success' , `Welcome Back ${username}`);
    const redirectUrl = req.session.returnTo || '/agency';
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res) => {
    req.logout();
    req.flash('success' , 'Successfully Logged out!');
    res.redirect('/agency');
}