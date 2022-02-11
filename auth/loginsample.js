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
                    res.redirect("/welcome");
                }
                return;
            });
        })
    }catch(error){
        return res.status(500).json({systemFail: 'Unable to process this request! Please try again'});
    }