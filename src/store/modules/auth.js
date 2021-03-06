import authAPI from '@/API/auth'
import {setItem} from '@/utils/persistenStorage'

const state={
    isSubmitting:false,
    isLoading:false,
    currentUser:null,
    validationErrors:null,
    isLoggedIn:null
}
export const mutationTypes ={
    registerStart: '[auth] registerStart',
    registerSuccess: '[auth] registerSuccess',
    registerFailure: '[auth] registerFailure',

    loginStart: '[auth] loginStart',
    loginSuccess: '[auth] loginSuccess',
    loginFailure: '[auth] loginFailure',

    getCurrentUserStart: '[auth] getCurrentUserStart',
    getCurrentUserSuccess: '[auth] getCurrentUserSuccess',
    getCurrentUserFailure: '[auth] getCurrentUserFailure'
}

export const actionsTypes={
    register: '[register] register',
    login: '[register] login',
    getCurrentUser: '[register] getCurrentUser'
}
export const gettersTypes ={
    currentUser:'[auth] currentUser',
    isLoggedIn:'[auth] isLoggedIn',
    isAnonymous:'[auth] isAnonymous'
}
const getters={
    [gettersTypes.currentUser]: state =>{
       return state.currentUser
    },
    [gettersTypes.isLoggedIn]: state =>{
        return Boolean(state.isLoggedIn)
    },
    [gettersTypes.isAnonymous]: state=>{
        return state.isLoggedIn===false
    }
}

const mutations={
    [mutationTypes.registerStart](state){
        state.isSubmitting=true
        state.validationErrors=null
    },
    [mutationTypes.registerSuccess](state, payload){
        state.isSubmitting=false
        state.currentUser=payload
        state.isLoggedIn=true
    },
    [mutationTypes.registerFailure](state, payload){
        state.isSubmitting=false
        state.validationErrors=payload
    },

    [mutationTypes.loginStart](state){
        state.isSubmitting=true
        state.validationErrors=null
    },

    [mutationTypes.loginSuccess](state, payload){
        state.isSubmitting=false
        state.currentUser=payload
        state.isLoggedIn=true
    },

    [mutationTypes.registerFailure](state, payload){
        state.isSubmitting=false
        state.validationErrors=payload
    },

    [mutationTypes.getCurrentUserStart](state){
        state.isLoading=true
    },

    [mutationTypes.getCurrentUserSuccess](state, payload){
        state.isLoading=false
        state.currentUser=payload
        state.isLoggedIn=true
    },

    [mutationTypes.getCurrentUserFailure](state){
        state.isLoading=false
        state.isLoggedIn=false
        state.currentUser=null
    }
}

const actions ={
    [actionsTypes.register](context, credentials){
       return new Promise(resolve => {
           context.commit(mutationTypes.registerStart)
           authAPI.register(credentials)
               .then(response =>{
                   context.commit(mutationTypes.registerSuccess, response.data.user)
                   setItem('accessToken', response.data.user.token)
                   resolve(response.data.user)
               })
               .catch(result =>{
                   context.commit(mutationTypes.registerFailure, result.response.data.errors)
               })
       })
    },

    [actionsTypes.login](context, credentials){
        return new Promise(resolve => {
            context.commit(mutationTypes.loginStart)
            authAPI
                .login(credentials)
                .then(response =>{
                    context.commit(mutationTypes.loginSuccess, response.data.user)
                    setItem('accessToken', response.data.user.token)
                    resolve(response.data.user)
                })
                .catch(result =>{
                    context.commit(mutationTypes.loginFailure, result.response.data.errors)
                })
        })
    },

    [actionsTypes.getCurrentUser](context){
        return new Promise(resolve => {
            context.commit(mutationTypes.getCurrentUserStart)
            authAPI
                .getCurrentUser()
                .then(response =>{
                    context.commit(mutationTypes.getCurrentUserSuccess, response.data.user)
                    resolve(response.data.user)
                })
                .catch(() =>{
                    context.commit(mutationTypes.getCurrentUserFailure)
                })
        })
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}