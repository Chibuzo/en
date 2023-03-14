const User = require('../models').User;
// const bcrypt = require('bcryptjs');
// const saltRounds = 10;
const crypto = require('crypto');
const { ErrorHandler } = require('../helpers/errorHandler');
const { AGENT_LEVEL } = require('../config/constants');
const { State, Lg, Ward, PollingUnit } = require('../models');

// const fetchUserData = async ({ role, lg_id, ward_id, pu_id }) => {
//     let lg, agentData = {};

//     if (role === AGENT_LEVEL.lg) {
//         lg = await Lg.findAll({ where: { state_id: 14 }, raw: true });
//         agentData.lg = lg;
//     } else if (role === AGENT_LEVEL.ward) {
//         [lg, wards] = await Promise.all([
//             Lg.findOne({ where: { id: lg_id }, raw: true }),
//             Ward.findAll({ where: { lg_id }, raw: true })
//         ]);
//         agentData.lg = lg;
//         agentData.wards = wards;
//     } else if (role === AGENT_LEVEL.pu) {
//         [ward, pus] = await Promise.all([
//             Ward.findOne({
//                 where: { id: ward_id },
//                 include: 'lg'
//             }),
//             PollingUnit.findAll({ where: { ward_id }, raw: true })
//         ]);
//         agentData.ward = ward;
//         agentData.pollingUnits = pus;
//     }
//     return agentData;
// }

const create = async ({ fullname = 'agent', username, role, lg_id, ward_id = null, password }) => {
    //const passwordHash = await bcrypt.hash(password, saltRounds);
    const passwordHash = crypto.createHash('md5').update(password).digest("hex")

    const data = {
        fullname,
        username,
        role,
        lg_id,
        ward_id: ward_id || null,
        password: passwordHash
    };
    const newAdmin = await User.create(data);
    return newAdmin;
}

const login = async ({ email: username, password }) => {
    if (username !== 'resultgov') throw new ErrorHandler(404, 'Username or password is incorrect');
    const hPassword = crypto.createHash('md5').update(password).digest("hex");
    const foundUser = await User.findOne({
        where: { password: hPassword },
        attributes: ['id', 'fullname', 'email', 'role', 'lg_id', 'ward_id', 'pu_id', 'password']
    });
    if (!foundUser) throw new ErrorHandler(404, 'Username or password is incorrect');

    // const match = await bcrypt.compare(password, foundUser.password);
    // if (!match) throw new ErrorHandler(400, 'Email and password doesn\'t match');

    const user = foundUser.toJSON();
    const [lg, wards] = await Promise.all([
        Lg.findOne({ where: { id: foundUser.lg_id }, raw: true }),
        Ward.findAll({ where: { lg_id: foundUser.lg_id }, raw: true })
    ]);

    const data = { lg, wards };
    user.agentData = data;

    delete user.password;
    return user;
}

const list = async () => {
    return User.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    }, { raw: true });
}

module.exports = {
    create,
    login,
    list
}