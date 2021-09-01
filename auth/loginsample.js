   //------- check user by email ------//
    try{
        Users.findOne({email: req.body.email}, (err, user) => {
            if(err) return res.status(500).json({LoginProcessError: 'Unable to process this request now! make sure you have active internet connection and try again.'});

            if(!user){
                res.status(400).render('Authentication/login', {
                    unknownEmail: req.flash('unknown_email')
                });
                return;
            }

            //check if user is verified
            if(!user.active){
                res.status(400).render('Authentication/login', {
                    notVerified: req.flash('verify_error')
                });
                return;
            }
            
             //user is found and verified,compare password
             bcrypt.compare(password, user.password, (err, matched) => {
                if(err) return res.status(500).json({passError: 'Unable to process password match request'+ err});

                if(!matched){
                    res.status(400).render('Authentication/login', {
                        wrongPassword: req.flash('wrong_pass')
                    });
                    return;
                }
                else{
                    // You can try to create a token to track how long the user is logged into the dashboard and set it to expire in 24hrs before redirecting the user dashboard
                    //User is logged in
                    // req.session.user = {
                    //     username,
                    // };
                
                    res.redirect("/welcome");
                }
                return;
            });
        })
    }catch(error){
        return res.status(500).json({systemFail: 'Unable to process this request! Please try again'});
    }