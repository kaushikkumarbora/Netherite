import { actionTypes } from "./actionTypes";

const concat = (jsonobj) => {
    if (jsonobj.workgroup != null) {
        return jsonobj.id + ' ' + jsonobj.hostname + ' ' + jsonobj.ip + ' ' + jsonobj.mac + ' ' + jsonobj.os + ' ' + jsonobj.os_ver + ' ' + jsonobj.status + ' ' + jsonobj.workgroup;
    }
    else {
        return jsonobj.id + ' ' + jsonobj.hostname + ' ' + jsonobj.ip + ' ' + jsonobj.mac + ' ' + jsonobj.os + ' ' + jsonobj.os_ver + ' ' + jsonobj.status + ' ' + jsonobj.domain;
    }
}

export const reformat = (assets) => {
    return assets.map(asset => {
        return asset = {
            asset_id: asset.id,
            hostname: asset.hostname,
            ip: asset.ip,
            mac: asset.mac,
            os: asset.os,
            build: asset.os_ver,
            workgroup: asset.workgroup,
            domain: asset.domain,
            status: (asset.status)? 'Online':'Offline',
            summ: concat(asset)
        }
    })
}

export const setupDone = () => ({
    type: actionTypes.SETUP_DONE,
    payload: {
    }
})

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

export const sendCreds = (creds) => {
    return (dispatch) => {
        return fetch('/setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(creds)
        }).then(data => data.json()).then(respose => {
            if (respose.status === '200') {
                dispatch(setupDone());
            }
        })
    }
}

export const fetchAssets = () => {
    return (dispatch) => {
        return fetch('/assets', {
            method: 'GET',
        }).then(data => data.json()).then(assets => {
            var temp = reformat(assets);
            console.log('temp',temp);
            return temp;
        }).then(assets => dispatch(assetsLoaded(assets)));
    }
}