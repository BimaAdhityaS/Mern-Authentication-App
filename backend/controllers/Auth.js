import User from "../models/UserModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if(!user) return res.status(404).json({message: "User not found"});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match){
        return res.status(401).json({message: "Incorrect password"});
    }
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, name, email, role});
}

export const Me = async (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({message: "Please login first"});
    }
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(404).json({message: "User not found"});
    res.status(200).json(user);
}

export const logout = async (req, res) => {
    req.session.destroy((error)=>{
        if(error){
            res.status(400).json({message: "Unable to logout"});
        }
        res.status(200).json({message: "Logged out successfully"});
    })
}
