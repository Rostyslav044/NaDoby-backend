// const crypto = require("crypto");
// const asyncHandler = require("../../middleware/async");
// const ErrorResponse = require("../../utils/errorResponse");
// const sendEmail = require("../../utils/sendEmail");
// const sendEmailVerification = require("../../utils/sendEmailVerification");

// const User = require("../users/user.model");

// // Функция для регистрации юзера

// exports.register = asyncHandler(async (req, res, next) => {
//   let new_password = crypto.randomBytes(10).toString("hex");
//   let { name, email, password, type, role = "user" } = req.body;
//   let user = await User.findOne({ email });
//   console.log(user);
 
//   await sendEmail({
//       template: "forgot-password",
//       email: 'volodimirzukivskij@gmail.com',
//       locals: {
//         link: 'volodimirzukivskij@gmail.com',
//       },
//     });
// if(!user){
// if (type ==="google" && !password) {
//    password = new_password 
// }
//   email = email.toLowerCase();
 
//   user = await User.create({
//     name,
//     email,
//     password,
//     role,
//   });
//   sendTokenResponse(user, 200, res);

// }else{
//       return next(new ErrorResponse("error user registration", 500));
// }


//   //   sendEmailVerification(user, req);

// });
// // Функция для авторизации юзера

// exports.login = asyncHandler(async (req, res, next) => {
//   let { email, password, type } = req.body;
// if (!email && type == "google") {
//   return next(new ErrorResponse("Please provide an email", 400));
// }
//   if ((!email || !password) && type !== "google") {
//     return next(new ErrorResponse("Please provide an email and password", 400));
//   }

//   email = email.toLowerCase();

//   let user = null;
//   if (type === "google") {
//     user = await User.findOne({ email });
//     console.log(user);
//   } else {
//     user = await User.findOne({ email }).select("+password");
//   }

//   if (!user) {
//     return next(new ErrorResponse("Invalid credentials", 400));
//   }
// if(type !== "google"){
//  const isMatch = await user.matchPassword(password);

//   if (!isMatch ) {
//     return next(new ErrorResponse("Invalid credentials", 400));
//   }
// }
 
//   sendTokenResponse(user, 200, res);
// });

// // @desc    Log user out / clear cookie
// // @route   GET /api/v1/auth/logout
// // @access  Private
// exports.logout = asyncHandler(async (req, res, next) => {
//   res.cookie("token", "none", {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });

//   res.status(200).json({ success: true, data: {} });
// });

// // @desc    Get current logged in user
// // @route   POST /api/v1/auth/me

// exports.getMe = asyncHandler(async (req, res, next) => {
//   const user = req.user;

//   res.status(200).json({ success: true, data: user });
// });

// // @desc    Update user details
// // @route   POST /api/v1/auth/updatedetails
// // @access  Private
// exports.updateDetails = asyncHandler(async (req, res, next) => {
//   const fieldsToUpdate = {
//     name: req.body.name,
//     email: req.body.email.toLowerCase(),
//   };
//   const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
//     new: true,
//     runValidators: true,
//     context: "query",
//   });

//   res.status(200).json({ success: true, data: user });
// });

// // @desc    Update password
// // @route   PUT /api/v1/auth/updatepassword
// // @access  Private
// exports.updatePassword = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");

//   if (!(await user.matchPassword(req.body.currentPassword))) {
//     return next(new ErrorResponse("Password is incorrect", 401));
//   }

//   user.password = req.body.newPassword;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });

// // @desc    Forgot password
// // @route   POST /api/v1/auth/forgotpassword
// // @access  Public
// exports.forgotPassword = asyncHandler(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email.toLowerCase() });

//   if (!user) {
//     return next(new ErrorResponse("There is no user with that email", 404));
//   }

//   const resetToken = user.getResetPasswordToken();

//   await user.save({ validateBeforeSave: false });

//   const resetUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/auth/resetpassword/${resetToken}`;

//   // const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

//   try {
//     await sendEmail({
//       template: "forgot-password",
//       email: user.email,
//       locals: {
//         link: resetUrl,
//       },
//     });
//     res.status(200).json({ success: true, data: "Email sent" });
//   } catch (err) {
//     console.log(err);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorResponse("Email could not be sent", 500));
//   }
// });

// // @desc    Reset password
// // @route   PUT /api/v1/auth/resetpassword/:resettoken
// // @access  Public
// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   // Get hashed token
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.resettoken)
//     .digest("hex");

//   console.log(resetPasswordToken);

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new ErrorResponse("Invalid token", 400));
//   }

//   // Set new password
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });

// // @desc    Email verification
// // @route   PUT /api/v1/auth/emailverification/:resettoken
// // @access  Public
// exports.emailVerification = asyncHandler(async (req, res, next) => {
//   // Get hashed token
//   const emailVerificationToken = crypto
//     .createHash("sha256")
//     .update(req.params.resettoken)
//     .digest("hex");

//   console.log(emailVerificationToken);

//   const user = await User.findOne({
//     emailVerificationToken,
//     emailVerificationExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new ErrorResponse("Email verification link has expired", 400));
//   }

//   user.isEmailVerified = true;
//   user.emailVerificationToken = undefined;
//   user.emailVerificationExpire = undefined;
//   await user.save();

//   res.status(200).json({ success: true, data: user });
// });

// // @desc    Send Email Verification
// // @route   POST /api/v1/auth/sendemailverification
// // @access  Public
// exports.sendEmailVerification = asyncHandler(async (req, res, next) => {
//   if (!req.body.email) {
//     return next(new ErrorResponse("Email is required", 400));
//   }

//   const user = await User.findOne({
//     email: req.body.email,
//     isEmailVerified: false,
//   });

//   if (!user) {
//     return next(
//       new ErrorResponse(
//         "User already verified or No user with that email address",
//         400
//       )
//     );
//   }

//   const isSent = sendEmailVerification(user, req);
//   isSent.then((data) => {
//     if (!data) {
//       return next(new ErrorResponse("Email could not be sent", 500));
//     }
//     return res.status(200).json({ success: true, data: "Email sent" });
//   });
// });

// // Get token from model, create cookie and send response
// const sendTokenResponse = (user, statusCode, res) => {
//   const token = user.getSignedJwtToken();

//   const options = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   if (process.env.NODE_ENV === "production") {
//     options.secure = true;
//   }

//   res
//     .status(statusCode)
//     .cookie("token", token, options)
//     .json({ success: true, token ,  profile:{...user._doc} });
// };



const crypto = require("crypto");
const asyncHandler = require("../../middleware/async");
const ErrorResponse = require("../../utils/errorResponse");
const sendEmail = require("../../utils/sendEmail");
const sendEmailVerification = require("../../utils/sendEmailVerification");

const User = require("../users/user.model");

// Функция для регистрации юзера

exports.register = asyncHandler(async (req, res, next) => {
  let new_password = crypto.randomBytes(10).toString("hex");
  let { name, email, password, type, role = "user" } = req.body;
  let user = await User.findOne({ email });
  console.log(user);
 

if(!user){
if (type ==="google" && !password) {
   password = new_password 
}
  email = email.toLowerCase();
 
  user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponse(user, 200, res);

}else{
      return next(new ErrorResponse("error user registration", 500));
}


  //   sendEmailVerification(user, req);

});
// Функция для авторизации юзера

exports.login = asyncHandler(async (req, res, next) => {
  let { email, password, type } = req.body;
if (!email && type == "google") {
  return next(new ErrorResponse("Please provide an email", 400));
}
  if ((!email || !password) && type !== "google") {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  email = email.toLowerCase();

  let user = null;
  if (type === "google") {
    user = await User.findOne({ email });
    console.log(user);
  } else {
    user = await User.findOne({ email }).select("+password");
  }

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }
if(type !== "google"){
 const isMatch = await user.matchPassword(password);

  if (!isMatch ) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }
}
 
  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({ success: true, data: user });
});

// @desc    Update user details - ОБНОВЛЕННЫЙ МЕТОД С НОВЫМИ ПОЛЯМИ
// @route   POST /api/v1/auth/updatedetails
// @access  Private
// @desc    Update user details - ИСПРАВЛЕННЫЙ МЕТОД
// @route   POST /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  // Создаем объект для обновления
  const fieldsToUpdate = {};
  
  // Добавляем только те поля, которые пришли в запросе
  if (req.body.name !== undefined) fieldsToUpdate.name = req.body.name;
  if (req.body.email !== undefined) fieldsToUpdate.email = req.body.email.toLowerCase();
  if (req.body.city !== undefined) fieldsToUpdate.city = req.body.city;
  if (req.body.phones !== undefined) fieldsToUpdate.phones = req.body.phones;
  if (req.body.about !== undefined) fieldsToUpdate.about = req.body.about;

  console.log('Updating user with fields:', fieldsToUpdate);

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({ 
    success: true, 
    data: user 
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/auth/resetpassword/${resetToken}`;
  const resetUrl = `${req.protocol}://localhost:3001/resetpassword/${resetToken}`;
  // const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      template: "forgot-password",
      email: user.email,
      locals: {
        link: resetUrl,
      },
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Email verification
// @route   PUT /api/v1/auth/emailverification/:resettoken
// @access  Public
exports.emailVerification = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const emailVerificationToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  console.log(emailVerificationToken);

  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Email verification link has expired", 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, data: user });
});

// @desc    Send Email Verification
// @route   POST /api/v1/auth/sendemailverification
// @access  Public
exports.sendEmailVerification = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse("Email is required", 400));
  }

  const user = await User.findOne({
    email: req.body.email,
    isEmailVerified: false,
  });

  if (!user) {
    return next(
      new ErrorResponse(
        "User already verified or No user with that email address",
        400
      )
    );
  }

  const isSent = sendEmailVerification(user, req);
  isSent.then((data) => {
    if (!data) {
      return next(new ErrorResponse("Email could not be sent", 500));
    }
    return res.status(200).json({ success: true, data: "Email sent" });
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token ,  profile:{...user._doc} });
};