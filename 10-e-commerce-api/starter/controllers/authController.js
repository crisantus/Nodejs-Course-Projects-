const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {attachCookiesToResponse,createTokenUser} = require('../utils');

const register = async (req, res) => {
    const {email, name , password} = req.body;
    const emailAlreadyExist = await User.findOne({email})
    if(emailAlreadyExist){
        throw new CustomError.BadRequestError('Email already exists')
    }

    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({email, name, password, role})
    const tokenUser = createTokenUser(user);
    // const tokenUser = {name:user.name,userId:user._id,role:user.role}
    //const token = createJWT({payload:tokenUser}); 
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user: tokenUser})
}
const login = async (req, res) => {
    const {email,password} = req.body;
    if(!email || !password) {
        throw new CustomError.BadRequestError("Please provide email and password")
    }
    //check if user exist
    const user = await User.findOne({email});
    if(!user){
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }
    //check if password is correct
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }
    const tokenUser = createTokenUser(user);
    //const tokenUser = {name:user.name,userId:user._id,role:user.role}
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user: tokenUser})
}
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
  };

module.exports = {register, login, logout}