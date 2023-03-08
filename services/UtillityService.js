const excelToJson = require('convert-excel-to-json');
const { Lg, Ward, PollingUnit, sequelize } = require('../models');


module.exports = {
    buildCriteria: params => {
        const { where = {} } = params;
        delete params.where;
        where.deleted = false;
        return { params, where };
    },

    formatCurrency: input => {
        return parseInt(input).toLocaleString('en-US', { style: 'decimal' });
    },

    postIntro: (post, no_of_letters = 500) => {
        if (post.length <= no_of_letters) return post;
        const intro = post.substr(0, no_of_letters - 1);
        return intro.substr(0, intro.lastIndexOf(' ')) + '...';
    },

    formatDate: date => new Date(date).toLocaleDateString('fr-CA'),

    readData: async () => {
        // extract data from sheet
        const { 'All Wards': data } = excelToJson({
            sourceFile: './inec.xlsx',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'lg',
                C: 'state',
                D: 'ward'
            }
        });

        // group local governments by state
        const enuguWards = data.filter(d => d.state == 'Enugu');
        const wards = enuguWards.reduce((wardArr, row) => {
            wardArr[row.lg] ||= [];
            wardArr[row.lg].push(row.ward);
            return wardArr;
        }, {});


        Object.keys(wards).forEach(async lg => {
            const _lg = await Lg.create({ name: lg });
            const _wards = wards[lg].map(ward => ({ name: ward, lg_id: _lg.id }));
            await Ward.bulkCreate(_wards);
            // console.log(wards[lg])
        });
    },

    buildData: async () => {
        let sql = 'SELECT * FROM wards ORDER BY id limit 150000, 50000';
        const [wards] = await sequelize.query(sql);

        await Promise.all(wards.map(async ward => {
            const pdata = await prepareData(ward);
            PollingUnit.bulkCreate(pdata);
        }));

        async function prepareData(ward) {
            sql = `SELECT pu name, delim delimiter, ${ward.id} as ward_id FROM pu_data WHERE rid = ${ward.wid}`;
            const [d] = await sequelize.query(sql);
            return d;
        }
        // let sql = 'SELECT * FROM lgs';
        // const [lgs] = await sequelize.query(sql);

        // await Promise.all(lgs.map(async lg => {
        //     const wdata = await prepareData(lg);
        //     Ward.bulkCreate(wdata);
        // }));

        // async function prepareData(lg) {
        //     sql = `SELECT DISTINCT ward, rid FROM pu_data WHERE lid = ${lg.lid}`;
        //     const [data] = await sequelize.query(sql);
        //     return data.map(d => {
        //         return { name: d.ward, state_id: lg.state_id, lg_id: lg.id, wid: d.rid };
        //     });
        // }

        // const [states] = await sequelize.query('select * from states order by name')
        // let lgData = [];
        // states.forEach(async state => {
        //     sql = `SELECT DISTINCT lga, lid FROM pu_data WHERE state = '${state.name}'`;
        //     const [data] = await sequelize.query(sql);
        //     data.forEach(d => {
        //         lgData.push({ name: d.lga, state_id: state.id, lid: d.lid });
        //     });
        //     await Lg.bulkCreate(lgData);
        // });
        // sql = `SELECT lga FROM pu_data WHERE state = 'ABIA' GROUP BY lga`;
        // const [data] = await sequelize.query(sql);
        // console.log(data)

    }
}