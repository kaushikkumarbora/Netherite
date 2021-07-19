const db = require("../database/database");

getAssetHistory = (req, res) => {
    console.log('asset history');
    const asset = db.asset;
    asset.findAll({
        where: {
            id: req.params.assetID
        },
        include: [
            {
                model: db.status, as: 'statuses',
                attributes: ['id','status','timestamp'],
                order: [['id', 'dsc']]
            }]
    }).then((assets) => res.status(200).json(assets));
    return;
}

module.exports = getAssetHistory;