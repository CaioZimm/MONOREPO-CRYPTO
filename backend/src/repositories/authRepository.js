const User = require('../models/User')

exports.register = async (user) => {
    try {
        const newUser = await User.create(user)

        return newUser;
        
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.login = async (email) => {
    try {
        const user = await User.findOne({ where: { email }});

        return user;

    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updateProfile = async (userId, updatedFields) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("Usuário não encontrado");
        return await user.update(updatedFields);
    } catch (error) {
        throw new Error(error.message);
    }
}