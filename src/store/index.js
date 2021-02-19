import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)
Vue.config.devtools = true;

export default new Vuex.Store({
    state: {
        events: [],
        userCourseById: []
    },
    getters: {
        EVENTS: state => state.events
    },
    mutations: {
        SET_EVENTS: (state, events) => (state.events = events),
        DELETE_EVENT: (state, response) => ( response ),
        UPDATE_EVENT: (state, response) => ( response ),
        ADD_EVENT: (state, response) => ( response ),
    },
    actions: {
        async getEvents({ commit }, payload ) {
            const response = await axios.get('https://custompbsapi.teampbs.com/api/calendars/geteventsbyusername?userName=' + payload + '&tableName=Calendar_EmployeeAbsence');

            commit('SET_EVENTS', response.data);
        },
        async createEvent({ commit }, payload ) {
            const response = await axios.post('https://custompbsapi.teampbs.com/api/calendars/createevent?tableName=Calendar_EmployeeAbsence', payload);

            commit('ADD_EVENT', payload);
        },
        async updateEvent({ commit }, payload ) {
            const response = await axios.put('https://custompbsapi.teampbs.com/api/calendars/updateevent?tableName=Calendar_EmployeeAbsence', payload);

            commit('UPDATE_EVENT', payload);
        },
        async deleteEvent({ commit }, payload ) {

            const response = await axios.get('https://custompbsapi.teampbs.com/api/calendars/deleteevent?eventId=' + payload + '&tableName=Calendar_EmployeeAbsence');

            commit('DELETE_EVENT', response.data);
        }
    },
    modules: {
    }
})
