import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import { Op } from 'sequelize';

export const getProducts = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                attributes:['uuid','name','price'],
                include: [{
                    model: User,
                    attributes:['name','email']
                }]
            })
        }else{
            response = await Product.findAll({
                attributes:['uuid','name','price'],
                where:{
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes:['name','email']
                }]
            })
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getProductById = async (req, res) => {
    try {
        const products = await Product.findOne({
            where:{
                uuid: req.params.id
            },
        })
        if(!products) return res.status(404).json({message: "Product not found"});
        let response;
        if(req.role === "admin"){
            response = await Product.findOne({
                where:{
                    id: products.id
                },
                attributes:['uuid','name','price'],
                include: [{
                    model: User,
                    attributes:['name','email']
                }]
            })
        }else{
            response = await Product.findOne({
                attributes:['uuid','name','price'],
                where:{
                    [Op.and]:[{id: products.id}, {userId: req.userId}]
                },
                include: [{
                    model: User,
                    attributes:['name','email']
                }]
            })
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createProducts = async (req, res) => {
    const {name, price} = req.body;
    try {
        await Product.create({
            name,
            price,
            userId: req.userId
        })
        res.status(201).json({message: "Product created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateProducts = async (req, res) => {
    try {
        const products = await Product.findOne({
            where:{
                uuid: req.params.id
            },
        })
        if(!products) return res.status(404).json({message: "Product not found"});
        const {name, price} = req.body;
        if(req.role === "admin"){
            await Product.update({
                name,
                price
            },{
                where:{
                    id: products.id
                }
            })
        }else{
            if(req.userId !== products.userId) return res.status(403).json({message: "You are not allowed to update this product"});
            await Product.update({
                name,
                price
            },{
                where:{
                    [Op.and]:[{id: products.id}, {userId: req.userId}]
                }
            })
        }
        res.status(200).json({message: "Product updated"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteProducts = async (req, res) => {
    try {
        const products = await Product.findOne({
            where:{
                uuid: req.params.id
            },
        })
        if(!products) return res.status(404).json({message: "Product not found"});
        const {name, price} = req.body;
        if(req.role === "admin"){
            await Product.destroy({
                where:{
                    id: products.id
                }
            })
        }else{
            if(req.userId !== products.userId) return res.status(403).json({message: "You are not allowed to delete this product"});
            await Product.destroy({
                where:{
                    [Op.and]:[{id: products.id}, {userId: req.userId}]
                }
            })
        }
        res.status(200).json({message: "Product Deleted Succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}