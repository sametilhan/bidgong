import { combineReducers } from 'redux'

import categories from './GetCategoriesReducer';
import category from './GetCategoryByIdReducer';
import categorySelection from './SelectCurrentCategoryReducer';
import leagueSelection from './SelectCurrentLeagueReducer';
import matches from './GetMatchesReducer';
import currentMatch from './GetMatchReducer';
import leagues from './GetLeaguesReducer';
import user from './LoginUserReducer';
import registerUser from './RegisterUserReducer';
import betPlayer from './BetPlayerReducer';

export default combineReducers({
    categories,category,categorySelection,matches,currentMatch,leagues,leagueSelection,
    user,registerUser,betPlayer
})