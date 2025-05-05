const express= require('express');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');


const getCoordinate = async (district,sector) =>{
    const query =`${sector},${district},Rwanda`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    try{
        const response = await axios.get(url,{
            header:{
                'User-Agent': 'RwandaMapProject/1.0 (tuyisengee09@gmail.com)'
            }
        });

        if(response.data && response.data.length > 0){
            const{lat,lon} = response.data[0];
            return{
                latitude:parseFloat(lat),
                longitude:parseFloat(lon)
            };
        }
       throw new Error('Location not found');
    }catch(error){
        console.Error('Geocoding failed',error.message);
        return {latitude:null,longitude:null};
    }
};

exports.register = async (req, res) => {
    try {
      const { firstname, lastname, email, password, phone, location } = req.body;
      
      // Validate required fields
      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Get coordinates - handle if geocoding fails
      let coordinates = { latitude: null, longitude: null };
      if (location?.district && location?.sector) {
        try {
          coordinates = await getCoordinate(location.district, location.sector);
        } catch (geocodeError) {
          console.log('Geocoding failed, proceeding without coordinates');
        }
      }
  
      const user = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        phone: phone || '',
        location: {
          district: location?.district || '',
          sector: location?.sector || '',
          ...coordinates
        }
      });
  
      await user.save();
      res.status(201).json({ 
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          firstname: user.firstname
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ 
        success: false,
        message: 'Registration failed: ' + err.message 
      });
    }
  };
exports.login = async(req,res)=>{
    try{
        const {email,password}=req.body;

        const user = await User.findOne({email});
        if(!user)return res.status(404).json({message:"User not found "});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)return res.status(400).json({message:'Invalid credentials'});

        const token = jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );
        res.status(200).json({message: 'login successful',token});
    }catch(err){
        res.status(500).json({message:err.message})
    }
}