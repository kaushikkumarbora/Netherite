const moment = require("moment");
const db = require("../database/database");

getAssets = (req, res) => {
    console.log('asset');
    const asset = db.asset;
    asset.findAll({
        order: [['id', 'asc']]
    }).then((assets) => res.status(200).json(assets));
    return;
}

// getAssets = (req, res) => {
//     console.log('asset');
//     const asset = db.asset;
//     asset.findAll({
//         include: [{
//             model: db.operating_system, as: 'o',
//             attributes: ['name', 'build']
//         },
//         {
//             model: db.workgroup, as: 'workgroup',
//             attributes: ['name']
//         },
//         {
//             model: db.domain, as: 'domain',
//             attributes: ['name']
//         },
//         {
//             model: db.status, as: 'latest_status_status',
//             attributes: ['status']
//         }],
//         order: [['id', 'asc']]
//     }).then((assets) => res.status(200).json(assets));
//     return;
// }

module.exports = getAssets;