import { actionTypes } from "./actionTypes";

const concat = (jsonobj) => {
    if (jsonobj.workgroup) {
        return jsonobj.id + ' ' + jsonobj.hostname + ' ' + jsonobj.ip + ' ' + jsonobj.mac + ' ' + jsonobj.o.name + ' ' + jsonobj.o.build + ' ' + jsonobj.status + ' ' + jsonobj.workgroup.name;
    }
    else {
        return jsonobj.id + ' ' + jsonobj.hostname + ' ' + jsonobj.ip + ' ' + jsonobj.mac + ' ' + jsonobj.o.name + ' ' + jsonobj.o.build + ' ' + jsonobj.status + ' ' + jsonobj.domain.name;
    }
}

export const reformat = (assets) => {
    return assets.map(asset => {
        return asset = {
            asset_id: asset.id,
            hostname: asset.hostname,
            ip: asset.ip,
            mac: asset.mac,
            os: asset.o.name,
            build: asset.o.build,
            workgroup: (asset.workgroup) ? asset.workgroup.name : 'null',
            domain: (asset.domain) ? asset.domain.name : 'null',
            status: asset.status,
            summ: concat(asset)
        }
    })
}

export const filteredAssets = (subset) => ({
    type: actionTypes.FILTERED_ASSETS,
    payload: {
        subset
    }
})

export const assetsLoaded = (assets) => ({
    type: actionTypes.ASSETS_LOADED,
    payload: {
        assets
    }
})

export const assetsUpdated = (assets) => ({
    type: actionTypes.ASSETS_UPDATED,
    payload: {
        assets
    }
})

export const fetchAssets = () => {
    return (dispatch) => {
        return fetch('/assets', {
            method: 'GET',
        }).then(data => data.json()).then(assets => {
            console.log(assets)
            return reformat(assets);
        }).then(assets => dispatch(assetsLoaded(assets)));
    }
}