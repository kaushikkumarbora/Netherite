import { actionTypes } from "../actions/actionTypes";

const initialState = {
  assets: [],
  subset: []
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ASSETS_UPDATED: {
      const newState = { ...state };
      newState.assets = action.payload.assets;
      var j = 0, lensub = newState.subset.length, lenasset = action.payload.assets.length;
      for (var i = 0; i < lenasset && j < lensub; i++) {
        if(newState.subset[j].asset_id === action.payload.assets[i].asset_id){
          newState.subset[j] = action.payload.assets[i];
          j = j+1;
        }
      }
      return newState;
    }
    case actionTypes.FILTERED_ASSETS: {
      const newState = { ...state };
      newState.subset = action.payload.subset;
      return newState;
    }
    case actionTypes.ASSETS_LOADED: {
      const newState = { ...state };
      newState.assets = action.payload.assets;
      newState.subset = action.payload.assets;
      return newState;
    }
    default:
      return state;
  }
}

export default dashboardReducer;