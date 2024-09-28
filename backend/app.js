const express = require("express");
const path=require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var Float = require('mongoose-float').loadType(mongoose);
//cryconst GoogleChartsNode = require('google-charts-node');

const app = express();

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));



let currentUser;


// DATABASE CONNECTION


 mongoose.connect("mongodb://localhost: 27017/usersDB", {
useNewUrlParser: true
}, {
  useUnifiedTopology: true
}).catch(error => handleError(error));;




const cryptoSchema = new mongoose.Schema({
  cryptoname: {
    type: String,
    // required: [true, "Please enter crypto's name"]
  },
  username: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
  address: String,
  balance: {
    type: Float
  }
});

const bankSchema = new mongoose.Schema({

  bankname: {
    type: String,
    // required: [true, "Please enter bank's name"]
  },
  accountnumber: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
  balance: {
    type: Float
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter username']
  },
  email: {
    type: String,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }

});

const connectBankSchema = new mongoose.Schema({
  username: String,
  bankname: {
    type: String,
    // required: [true, "Please enter bank's name"]
  },
  accountnumber: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
  balance: {
    type: Float
  },
  pin: Number
});

const connectCryptoSchema = new mongoose.Schema({
  user: String,
  cryptoname: {
    type: String,
    // required: [true, "Please enter crypto's name"]
  },
  username: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
  address: String,
  balance: {
    type: Float
  }
});

const walletSchema = new mongoose.Schema({
  user: String,
  balance: {
    type: Float
  },
  transactionPin: Number
});

const transactionSchema = new mongoose.Schema({
  user: String,
  transactionamt: Float,
  balance: Float,
  transactiontype: String,
  date: String,
  time: String
});

const feedbackSchema = new mongoose.Schema({
  user: String,
  rating: String,
  feedback: String
});











app.get("/", function(req, res) {
  res.render('home'); // Renders 'views/home.ejs'
});

app.get("/login", function(req, res) {
  res.render('form'); // Renders 'views/form.ejs'
});

app.get("/dashboard", function(req, res) {
  res.render('dashboard'); // Renders 'views/dashboard.ejs'
});

app.get("/connect", function(req, res) {
  res.render('connect'); // Renders 'views/connect.ejs'
});



app.get("/cryptoWallet",function(req,res){

  const conn2 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });

  const ConnectCrypto = conn2.model("Coin", connectCryptoSchema);

  module.exports = connectCryptoSchema;



  ConnectCrypto.find({user: currentUser},function(err,foundUsers){
    if (!foundUsers) {

      res.render('cryptopayment',{message: '' , connectedCryptos: [] , cryptobalance: 0});

    }else{

    res.render('cryptopayment',{message:'' , connectedCryptos: foundUsers , cryptobalance: 0});
    }



  });

});



app.get("/payment", function(req, res) {

  let balance;

  const conn2 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });

  const Wallet = conn2.model("Wallet", walletSchema);

  module.exports = walletSchema;

  Wallet.findOne({user: currentUser},function(err, foundWallet){

    if (!foundWallet) {



    }else {

      balance = foundWallet.balance;

    }

    const ConnectCrypto = conn2.model("Coin", connectCryptoSchema);

    module.exports = connectCryptoSchema;

    ConnectCrypto.find({user: currentUser},function(err,foundUsers){
      if (!foundUsers) {

        res.render('payment',{message: '', balance: balance , connectedCryptos: [] , cryptobalance: 0});

      }else{

        res.render('payment',{message: '', balance: balance , connectedCryptos: foundUsers , cryptobalance: 0});
      }



    });


  });

});



app.get("/transactions", function(req, res) {
  res.render('transactions');
});

app.get("/feedback", function(req, res) {
  res.render( "feedback");
});

app.get("/load", function(req, res) {
  res.render("load");
});

app.get("/pin", function(req, res) {
  res.render("pin");
});




app.post("/login", function(req, res) {

  const conn1 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });
  // .catch(error => handleError(error));;

  const User = conn1.model("User", userSchema);

  module.exports = userSchema;

  currentUser = req.body.userName;

  User.findOne({
    username: req.body.userName,
    password: req.body.password
  }, function(err, foundUser) {
    if (!foundUser) {

      res.render('form',{message: "Username/Password does not match! Try logging in again."});

      // res.send("Username/Password does not match! Try logging in again.")
    } else {
      //  res.sendFile(__dirname+ "/dashboard.html");

      res.redirect("/dashboard");
    }
  });
});



app.post("/signup", function(req, res) {
  const conn1 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });

  const User = conn1.model("User", userSchema);

  module.exports = userSchema;

  const user = new User({
    username: req.body.userName,
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({
    $or: [{
      username: req.body.userName
    }, {
      email: req.body.email
    }]
  }, function(err, foundUser) {
    if (!foundUser) {
      user.save();

      res.render('form',{message: "Successfully signed up. Please login to your account."});


      // res.redirect("/login");
    } else {

      res.render('form',{message: "Username already taken/ Email is already registered, please choose a different username/use different email."});


      // res.send("Username already taken/ Email is already registered, please choose a different username/use different email.");

    }
  });

});


// Dashboard BACKEND


//1.Connect accounts



app.post("/bank", function(req, res) {
  const conn2 = mongoose.createConnection("mongodb://localhost: 27017/bankDB", {
    useNewUrlParser: true,
    poolSize: 10
  });

  const Bank = conn2.model("Bank", bankSchema);

  module.exports = bankSchema;

  // console.log(currentUser);

  let bankName = req.body.bankName;
  let accNum = req.body.accountNumber;
  let pw = req.body.password;

  // console.log(bankName, accNum, pw);


  Bank.findOne({
    bankname: bankName,
    accountnumber: accNum,
    password: pw
  }, function(err, foundUser) {


    // console.log(foundUser);

    if (!foundUser) {
      console.log(foundUser);
      res.send("No user found");
    } else {

      console.log(foundUser);



      const conn1 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
        useNewUrlParser: true,
        poolSize: 10
      });
      // .catch(error => handleError(error));;


      const ConnectBank = conn1.model("Connect", connectBankSchema);

      module.exports = connectBankSchema;

      // console.log(foundUser);
      //
      //
      //
      // mongoose.connection.close();

      let nameOfbank = foundUser.bankname;
      let acN = foundUser.accountnumber;
      let passw = foundUser.password;
      let bal = foundUser.balance;

      console.log(nameOfbank, acN, passw, bal + 1000);

      ConnectBank.find({
        bankname: nameOfbank,
        accountnumber: acN
      }, function(err, foundAccount) {

        console.log(foundAccount);
        if (foundAccount.length != 0) {

          res.render('connect',{message: "Account already connected."});

          // res.send("Account already connected.");
        } else {


          const bank = new ConnectBank({
            username: currentUser,
            bankname: nameOfbank,
            accountnumber: acN,
            password: passw,
            balance: bal
          });

          bank.save();

          res.render('connect',{message: "Account successfully connected."});

          // res.send("Account successfully connected.");

        }




      });


      //
      // ConnectBank.findOne({bankname: nameOfbank,accountnumber: foundUser.accountnumber},function(err,foundAccount){
      //
      //   console.log(foundAccount);
      //   if (!foundAccount) {
      //
      //     console.log("NO ACCOUNTS");
      //     console.log(currentUser);
      //
      //
      //
      //     const bank = new ConnectBank({
      //       username: currentUser,
      //       bankname: nameOfbank,
      //       accountnumber: acN,
      //       password: passw,
      //       balance: bal
      //     });
      //
      //     // ConnectBank.create({bank},function(err,result){
      //     //   if(err){
      //     //     console.log(err);
      //     //   }else{
      //     //     res.send("Account Connected!");
      //     //   }
      //     // })
      //
      //     ConnectBank.findOne({bankname: nameOfbank, accountnumber: acN},function(err,foundAccount){
      //
      //       console.log(foundAccount);
      //       if (!foundAccount) {
      //
      //             bank.save();
      //
      //
      //
      //             res.send("Account Connected!");
      //             console.log("HI");
      //
      //       }else{
      //
      //         res.send("Same account cannot be connected twice.")
      //       }
      //     });
      //
      //
      //
      //     // User.create({bank: bank},function(err,result){
      //     //   if (err) {
      //     //     console.log(err);
      //     //   }else {
      //     //     console.log("Added bank");
      //     //   }
      //     // })
      //
      //     // User.updateOne({username: currentUser},{$set:{bank: bank} },function(err){
      //     //   if (err) {
      //     //       console.log(err);
      //     //   }else {
      //     //     console.log("successfully updated");
      //     //   }
      //     // });
      //
      //
      //
      //
      //
      //
      //
      //   }else{
      //     mongoose.connection.close();
      //     res.send("Account already connected!");
      //   }
      // });







      // res.send("Account connected successfully.");
    }
  });



});








app.post("/crypto", function(req, res) {

  const conn3 = mongoose.createConnection("mongodb://localhost: 27017/cryptoDB", {
    useNewUrlParser: true,
    poolSize: 10
  });
  // .catch(error => handleError(error));;

  const Crypto = conn3.model("Crypto", cryptoSchema);




  module.exports = cryptoSchema;



  let cryptoName = req.body.cryptoName;
  let userName = req.body.userNameCrypto;
  let pw = req.body.cryptoPassword;



  Crypto.findOne({
    $and: [{
      cryptoname: cryptoName
    }, {
      username: userName
    }, {
      password: pw
    }]
  }, function(err, foundUser) {



    if (!foundUser) {

        res.render('connect',{message: "No user found"});

      // res.send("No user found");
    } else {
      console.log(foundUser);

      const conn1 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
        useNewUrlParser: true,
        poolSize: 10
      });
      // .catch(error => handleError(error));;


      const ConnectCrypto = conn1.model("Coin", connectCryptoSchema);




      module.exports = connectCryptoSchema;




      // console.log(foundUser);
      //
      //
      //
      // mongoose.connection.close();

      let nameOfcrypto = foundUser.cryptoname;
      let usN = foundUser.username;
      let passW = foundUser.password;
      let bala = foundUser.balance;
      let add = foundUser.address;

      // ConnectCrypto.findOne({$and:[{cryptoname: nameOfcrypto},{username: usN}]},function(err,foundAccount)



      ConnectCrypto.count({
        $and: [{
          cryptoname: nameOfcrypto
        }, {
          username: usN
        }]
      }, function(err, foundAccount) {

        console.log(foundAccount);
        console.log(ConnectCrypto.db.name, ConnectCrypto.collection.name);
        if (foundAccount > 0) {

            res.render('connect',{message: "Account already connected."});

          // res.send("Account already connected.")
        } else {


          const crypto = new ConnectCrypto({
            user: currentUser,
            cryptoname: nameOfcrypto,
            username: usN,
            password: passW,
            balance: bala,
            address: add
          });

          crypto.save();

          res.render('connect',{message:"Account successfully connected."});

          // res.send("Account successfully connected.");

        }




      });




      // mongoose.connect("mongodb://localhost: 27017/cryptoDB",{poolSize: 100000,
      //   useNewUrlParser: true
      // }).catch(error => handleError(error));;
      //
      //
      //
      // User.updateOne({username: currentUser},{$set:{crypto: foundUser} },function(err){
      //   if (err) {
      //       console.log(err);
      //   }else {
      //     console.log("successfully updated");
      //   }
      // });
      //
      // mongoose.connection.close();


    }
  });



});


//2.payment




app.post("/cryptopayment", function(req, res) {

  const conn1 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });
  // .catch(error => handleError(error));;


  const ConnectCrypto = conn1.model("Coin", connectCryptoSchema);

  module.exports = connectCryptoSchema;


  let cryptoName = req.body.selectedCrypto;
  let paymentamt = req.body.paymentAmount;
  let recipientAddress = req.body.walletAddress;
  let pw = req.body.password;
  let username = req.body.username;

  ConnectCrypto.findOne({
    user: currentUser,
    cryptoname: cryptoName,
    username: username
  }, function(err, foundAccount) {

    console.log(foundAccount + " This is connected crypto's data");



    if (foundAccount) {

      if (foundAccount.balance >= paymentamt) {

        var updatedBalance = foundAccount.balance - parseFloat(paymentamt);

        console.log(updatedBalance);

        ConnectCrypto.updateOne({
          user: currentUser,
          cryptoname: cryptoName,
          username: username
        }, {
          balance: updatedBalance
        }, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully updated account's balance");
          }
        });


        ConnectCrypto.findOne({
          cryptoname: cryptoName,
          address: recipientAddress
        }, function(err, found) {
          if (found) {

            var updatedBalance2 = found.balance + parseFloat(paymentamt);

            ConnectCrypto.updateOne({
              cryptoname: cryptoName,
              address: recipientAddress
            }, {
              balance: updatedBalance2
            }, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("successfully updated account's balance");
              }
            });

          }
        });



        const conn3 = mongoose.createConnection("mongodb://localhost: 27017/cryptoDB", {
          useNewUrlParser: true,
          poolSize: 10
        });
        // .catch(error => handleError(error));;

        const Crypto = conn3.model("Crypto", cryptoSchema);


        module.exports = cryptoSchema;

        Crypto.findOne({
          cryptoname: cryptoName,
          address: recipientAddress
        }, function(err, foundAccount) {

          console.log(foundAccount);


          if (!foundAccount) {

            ConnectCrypto.find({user: currentUser},function(err,foundUsers){
              if (!foundUsers) {

                res.render('cryptopayment',{message: '' , connectedCryptos: [] });

              }else{

              res.render('cryptopayment',{message:"Transaction could not be carried out. No account found." , connectedCryptos: foundUsers });

              }



            });

            // res.render('cryptopayment',{message:"Transaction could not be carried out. No account found."});

            // res.send("Transaction could not be carried out. No account found.");

            // <%= hello %> res.render("home", { hello: foundAccount.balance});
          } else {

            var newBal = (foundAccount.balance) + parseFloat(paymentamt);

            console.log(newBal + " This is new balance");

            Crypto.updateOne({
              username: foundAccount.username,
              cryptoname: cryptoName
            }, {
              balance: newBal
            }, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log(foundAccount);
                console.log("Transaction Completed");

                ConnectCrypto.find({user: currentUser},function(err,foundUsers){
                  if (!foundUsers) {

                    res.render('cryptopayment',{message: '' , connectedCryptos: [] });

                  }else{
                    console.log("Transaction Successful.");

                  // res.render('cryptopayment',{message:"Transaction successful. Your new balance is "+newBal , connectedCryptos: foundUsers });
                  }



                });
                // res.render('payment',{message:"Transaction successful"});
                // res.send("Transaction successful");
              }
            });

          }
        });


        // ************************************************

        Crypto.findOne({
          cryptoname: cryptoName,
          username: username
        }, function(err, foundAccount) {

          if (!foundAccount) {
            console.log("Balance could not be updated.");
            // res.send("Balance could not be updated.");

            // <%= hello %> res.render("home", { hello: foundAccount.balance});
          } else {

            var newBal2 = (foundAccount.balance) - parseFloat(paymentamt);

            console.log(newBal2 + " This is new balance");

            Crypto.updateOne({
              cryptoname: cryptoName,
              username: username
            }, {
              balance: newBal2
            }, function(err) {
              if (err) {
                console.log(err);
              } else {

                ConnectCrypto.find({user: currentUser},function(err,foundUsers){
                  if (!foundUsers) {

                    res.render('cryptopayment',{message: '' , connectedCryptos: [] });

                  }else{
                    console.log("Transaction Successful.");
                      res.render('cryptopayment',{message:"Transaction successful. Your new balance is "+newBal2 , connectedCryptos: foundUsers });

                  // res.render('cryptopayment',{message:"Transaction successful. Your new balance is "+newBal , connectedCryptos: foundUsers });
                  }



                });


              }
            });
          }
        });



      } else {

        ConnectCrypto.find({user: currentUser},function(err,foundUsers){
          if (!foundUsers) {

            res.render('cryptopayment',{message: '' , connectedCryptos: [] });

          }else{

          res.render('cryptopayment',{message:"Insufficient Balance." , connectedCryptos: foundUsers });
          }



        });

        // res.render('payment',{message:"Insufficient Balance."});

        // res.send("Insufficient Balance.")
      }


    } else {
      console.log(err, "ERROR FOUND");

      ConnectCrypto.find({user: currentUser},function(err,foundUsers){
        if (!foundUsers) {

          res.render('cryptopayment',{message: '' , connectedCryptos: [] });

        }else{

        res.render('cryptopayment',{message:"The account you wanted to pay with is not linked to your account. " , connectedCryptos: foundUsers });
        }



      });


      // res.render('payment',{message:"The account you wanted to pay with is not linked to your account. "});
      // res.send("The account you wanted to pay with is not linked to your account. ");
    }
  });

  console.log(cryptoName);

});


app.post("/pin", function(req, res) {

  const conn1 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });
  // .catch(error => handleError(error));;


  const Wallet = conn1.model("Wallet", walletSchema);

  module.exports = walletSchema;

  let user = currentUser;
  let balance = 0;
  let pin = req.body.transactionPin;

  Wallet.find({
    user: user
  }, function(err, foundAccount) {

    console.log(foundAccount);
    if (foundAccount.length != 0) {
        res.render('pin',{message:"Wallet already exists."});

      // res.send("Wallet already exists.")
    } else {


      const wallet = new Wallet({
        user: user,
        balance: 0,
        transactionPin: pin
      });

      wallet.save();


      res.render('pin',{message:"Wallet created successfully."});
      // res.send("Wallet created successfully.");

    }
  });

});




app.post("/load", function(req, res) {

  const conn1 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });
  // .catch(error => handleError(error));;


  const ConnectBank = conn1.model("Connect", connectBankSchema);

  module.exports = connectBankSchema;

  let user = currentUser;
  let bank = req.body.bank;
  let accNumber = req.body.accnum;
  let password = req.body.password;

  let amount = parseFloat(req.body.amount);


  ConnectBank.findOne({
    bankname: bank,
    accountnumber: accNumber,
    username: user,
    password: password
  }, function(err, foundAccount) {

    console.log(foundAccount + "This is from ConnectBank");
    if (!foundAccount) {

        res.render('load',{message:"This bank account is not connected to your TradeIT account."});

      // res.send("This bank account is not connected to your TradeIT account.")
    } else {

      if (foundAccount.balance < amount) {

          res.render('load',{message:"Not enough balance in your bank account, cannot load money into Wallet."});
        // res.send("Not enough balance in your bank account, cannot load money into Wallet.")
      } else {

              console.log("Now we are here!");

              const conn2 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
                useNewUrlParser: true,
                poolSize: 10
              });

              const Wallet = conn2.model("Wallet", walletSchema);

              module.exports = walletSchema;

              Wallet.findOne({
                user: currentUser
              }, function(err, foundWallet) {
                if (!foundWallet) {
                  res.render('load',{message:"No wallet found, create wallet first."});

                  // res.send("No wallet found, create wallet first.");
                } else {

                  console.log(foundWallet + "This is wallet found");

                  var newBalance2 = foundWallet.balance + amount;
                  Wallet.updateOne({
                    user: currentUser
                  }, {
                    balance: newBalance2
                  }, function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("Successfully updated wallet's balance");
                    }
                  });

                  var newBalance = foundAccount.balance - amount;

                  ConnectBank.updateOne({
                    bankname: bank,
                    accountnumber: accNumber,
                    username: user,
                    password: password
                  }, {
                    balance: newBalance
                  }, function(err) {
                    if (err) {
                      console.log(err);
                    } else {

                      console.log("Balance updated.");
                    }
                  });




                  const conn3 = mongoose.createConnection("mongodb://localhost: 27017/bankDB", {
                    useNewUrlParser: true,
                    poolSize: 10
                  });

                  const Bank = conn3.model("Bank", bankSchema);


                  module.exports = bankSchema;

                  console.log(Bank.db.name);

                  Bank.findOne({
                    bankname: bank,
                    accountnumber: accNumber
                  }, function(err, foundBankAccount) {



                    if (!foundBankAccount){
                      console.log("No Account Found ----- Bank");
                    } else {

                      var updatedBalance = parseFloat(foundBankAccount.balance) - amount;
                      console.log(updatedBalance);

                      Bank.updateOne({
                        bankname: bank,
                        accountnumber: accNumber
                      }, {
                        balance: updatedBalance
                      }, function(err) {

                        if (err) {

                          console.log(err);

                        } else {

                          console.log("Amount updated in Bank's Database too.");
                        }

                      });

                    }

                  });

                  var today = new Date();

                  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

                  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                  var dateTime = date+' '+time;

                  console.log(dateTime);


                  const conn4 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
                    useNewUrlParser: true,
                    poolSize: 10
                  });

                  const Transaction = conn4.model("Transaction", transactionSchema);

                  module.exports = transactionSchema;

                  const transaction = new Transaction({
                    user: currentUser,
                    transactionamt: amount,
                    balance: newBalance2,
                    transactiontype: "LOAD",
                    date: date,
                    time: time
                  });

                  transaction.save();


                  res.render('load',{message:"Amount added to your wallet."});
                  // res.send("Amount added to your wallet.");


                }
              });


      }

    }

  });

});



app.post("/bankpayment",function(req,res){

  let amount = parseFloat(req.body.paymentAmount);
  let user = req.body.username;
  let transPin = req.body.pin;

  const conn2 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });

  const Wallet = conn2.model("Wallet", walletSchema);

  module.exports = walletSchema;

  const ConnectCrypto = conn2.model("Coin", connectCryptoSchema);

  module.exports = connectCryptoSchema;

  Wallet.findOne({user: currentUser, transactionPin: transPin}, function(err, foundUser){

    if (!foundUser) {

      ConnectCrypto.find({user: currentUser},function(err,foundUsers){
        if (!foundUsers) {

          res.render('payment',{message: '', balance: balance });

        }else{

        res.render('payment',{message:"Incorrect transaction Pin / No Wallet connected to your account. Please check!",balance: foundUser.balance });
        }



      });

      // res.render('payment',{message:"Incorrect transaction Pin / No Wallet connected to your account. Please check!",balance: 0 , connectedCryptos: [] , cryptobalance: 0});
      console.log("Incorrect transaction Pin / No Wallet connected to your account. Please check!");
    } else {
      if (foundUser.balance < amount) {

        ConnectCrypto.find({user: currentUser},function(err,foundUsers){
          if (!foundUsers) {

            res.render('payment',{message: '', balance: balance });

          }else{

          res.render('payment',{message:"NOT ENOUGH BALANCE IN YOUR WALLET. PLEASE LOAD MONEY!",balance: foundUser.balance });
          }



        });

        // res.render('payment',{message:"NOT ENOUGH BALANCE IN YOUR WALLET. PLEASE LOAD MONEY!",balance: foundUser.balance , connectedCryptos: [] , cryptobalance: 0});

        // res.send("NOT ENOUGH BALANCE IN YOUR WALLET. PLEASE LOAD MONEY!");
      }else {
        Wallet.findOne({user: user},function(err,foundReceiver){
          if (!foundReceiver) {

            ConnectCrypto.find({user: currentUser},function(err,foundUsers){
              if (!foundUsers) {

                res.render('payment',{message: '', balance: balance });

              }else{

              res.render('payment',{message:"The receiver with the username "+user+" does not exist.",balance: foundUser.balance });
              }



            });



            // res.render('payment',{message:"The receiver with the username "+user+" does not exist.",balance: foundUser.balance , connectedCryptos: [] , cryptobalance: 0});



            // res.send("The receiver with the username "+user+" does not exist.");
          }else {

            let newBalance = foundReceiver.balance + amount;
            let newBalance2 = foundUser.balance - amount
            Wallet.updateOne({user: user},{balance: newBalance},function(err){
              if (err) {
                console.log(err);
              }else {
                console.log("Transaction successfull.");



                ConnectCrypto.find({user: currentUser},function(err,foundUsers){
                  if (!foundUsers) {

                    res.render('payment',{message: '', balance: balance });

                  }else{

                  res.render('payment',{message:"Transaction successfull.",balance: newBalance2 });
                  }



                });




                // res.render('payment',{message:"Transaction successfull.",balance: newBalance2 , connectedCryptos: [] , cryptobalance: 0});


              }
            });



            Wallet.updateOne({user: currentUser, transactionPin: transPin}, {balance: newBalance2 }, function(err){
              if (err) {
                console.log(err);
              }else {
                console.log("Successfully updated the sender's wallet's balance");
              }
            });

            var today = new Date();

            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            var dateTime = date+' '+time;

            console.log(dateTime);


            const conn3 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
              useNewUrlParser: true,
              poolSize: 10
            });

            const Transaction = conn3.model("Transaction", transactionSchema);

            module.exports = transactionSchema;

            const transaction = new Transaction({
              user: currentUser,
              transactionamt: amount,
              balance: newBalance2,
              transactiontype: "DEBIT",
              date: date,
              time: time
            });

            transaction.save();

            const transaction2 = new Transaction({
              user: user,
              transactionamt: amount,
              balance: newBalance,
              transactiontype: "CREDIT",
              date: date,
              time: time
            });

            transaction2.save();


          }
        });
      }
    }
  });

});



app.post("/transactionlog", function(req,res){

  const conn3 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });

  const Transaction = conn3.model("Transaction", transactionSchema);

  module.exports = transactionSchema;

Transaction.find({user: currentUser},function(err,foundTransactions){

      if(foundTransactions.length != 0 ){

        res.render("transactions",{message: "You can view the transaction log below.", transactions: foundTransactions,transactionGraph: []});

      }else {

        res.render('transactions',{message: "No transactions found!", transactions: [],transactionGraph: []});

      }

});

});

app.post("/transactiongraph",function(req,res){

  const conn3 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
    useNewUrlParser: true,
    poolSize: 10
  });

  const Transaction = conn3.model("Transaction", transactionSchema);

  module.exports = transactionSchema;

Transaction.find({user: currentUser},function(err,foundTransactions){

  var dataArray = [];

  foundTransactions.forEach(function(transaction){
   var array = [];
   array.push(transaction.date);
   array.push(transaction.balance);

   console.log(array);

  dataArray.push(array);

 });

console.log(dataArray);

      if(foundTransactions.length != 0 ){

        res.render("transactions",{message: "You can view the graph below.", transactions: [],transactionGraph: dataArray});

      }else {

        res.render('transactions',{message: "No transactions found!", transactions: [],transactionGraph: []});

      }

});


// res.render('transactions',{message:"You can see the graph",transactions:[],graph: "image", transactionGraph: ["hi",123]});

});



app.post("/feedback", function(req,res){

    let rating = req.body.stars;
    let feedback1 = req.body.feedback;

    const conn3 = mongoose.createConnection("mongodb://localhost: 27017/usersDB", {
      useNewUrlParser: true,
      poolSize: 10
    });

    const Feedback = conn3.model("Feedback", feedbackSchema);

    module.exports = feedbackSchema;

    const feedback = new Feedback({
      user: currentUser,
      rating: rating,
      feedback: feedback1
    });

    feedback.save();

    res.render('feedback',{message: "Thank you for your precious feedback!"});



});



function handleError(error) {
  console.log(error);
}

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
