const User = require('../models').User;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ErrorHandler } = require('../helpers/errorHandler');
const { AGENT_LEVEL } = require('../config/constants');
const { State, Lg, Ward, PollingUnit } = require('../models');

const fetchUserData = async ({ role, lg_id, ward_id, pu_id }) => {
    let lg, ward, agentData = {};

    if (role === AGENT_LEVEL.lg) {
        lg = await Lg.findByPk(lg_id, { raw: true });
    } else if (role === AGENT_LEVEL.ward) {
        [lg, ward] = await Promise.all([
            Lg.findByPk(lg_id, { raw: true }),
            Ward.findByPk(ward_id, { raw: true })
        ]);
        agentData.ward = ward.name;
    } else if (role === AGENT_LEVEL.pu) {
        [lg, ward, pu] = await Promise.all([
            Lg.findByPk(lg_id, { raw: true }),
            Ward.findByPk(ward_id, { raw: true }),
            PollingUnit.findByPk(pu_id, { raw: true })
        ]);
        agentData.ward = ward.name;
        agentData.pu = pu.name;
    }
    agentData.lg_name = lg.name;
    return agentData;
}

const create = async ({ fullname, username, role, password }) => {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const data = {
        fullname,
        username,
        role,
        password: passwordHash
    };
    const newAdmin = await User.create(data);
    return newAdmin;
}

const login = async ({ email: username, password }) => {
    const foundUser = await User.findOne({
        where: { username },
        attributes: ['id', 'fullname', 'email', 'role', 'lg_id', 'ward_id', 'pu_id', 'password']
    });
    if (!foundUser) throw new ErrorHandler(404, 'Email or password is incorrect');

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new ErrorHandler(400, 'Email and password doesn\'t match');

    const user = foundUser.toJSON();
    user.agentData = await fetchUserData(foundUser);

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