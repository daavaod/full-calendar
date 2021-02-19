<template>
    <section>
        <BusyIndicator v-if="loading" />
        <FullCalendar
            :options="calendarOptions"
        />
        <Dialog :key="dialog">
            <template v-slot:body>
                <v-form
                    ref="form"
                    v-model="valid"
                    :lazy-validation="lazy"
                >
                    <v-card>
                        <v-card-title v-if="dialogOptions.title">{{ dialogOptions.title }}</v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            dense
                                            filled
                                            label="Event Title"
                                            v-model="eventDetails.title"
                                            :rules="[() => !!eventDetails.title || 'This field is required']"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-menu
                                            v-model="calendarMenuStart"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            transition="scale-transition"
                                            bottom
                                            offset-y
                                            filled
                                            min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    dense
                                                    filled
                                                    v-model="eventDetails.start"
                                                    label="Start Date"
                                                    prepend-inner-icon="event"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    required
                                                    :rules="[() => !!eventDetails.start || 'This field is required']"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="eventDetails.start" @input="calendarMenuStart = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-menu
                                            v-model="calendarMenuEnd"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            transition="scale-transition"
                                            bottom
                                            offset-y
                                            min-width="290px"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                dense
                                                filled
                                                v-model="eventDetails.end"
                                                label="End Date"
                                                prepend-inner-icon="event"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                            ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="eventDetails.end" @input="calendarMenuEnd = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-menu
                                            ref="menuStart"
                                            v-model="timeMenuStart"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="eventDetails.eventStartTime"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                            :disabled="eventDetails.allDay"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    dense
                                                    filled
                                                    v-model="eventDetails.eventStartTime"
                                                    label="Start Time"
                                                    prepend-inner-icon="access_time"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    :disabled="eventDetails.allDay"
                                                    required
                                                    :rules="[() => !!eventDetails.eventStartTime || 'This field is required']"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                format="24hr"
                                                v-if="timeMenuStart"
                                                v-model="eventDetails.eventStartTime"
                                                full-width
                                                @click:minute="$refs.menuStart.save(eventDetails.eventStartTime)"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-menu
                                            ref="menuEnd"
                                            v-model="timeMenuEnd"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="eventDetails.eventEndTime"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                            :disabled="eventDetails.allDay"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    dense
                                                    filled
                                                    v-model="eventDetails.eventEndTime"
                                                    label="End Time"
                                                    prepend-inner-icon="access_time"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    :disabled="eventDetails.allDay"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                format="24hr"
                                                v-if="timeMenuEnd"
                                                v-model="eventDetails.eventEndTime"
                                                full-width
                                                @click:minute="$refs.menuEnd.save(eventDetails.eventEndTime)"
                                            ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col  cols="12" sm="6">
                                        <v-checkbox
                                            v-model="eventDetails.IsRecurring"
                                            label="Recurring Event"
                                            
                                            type="checkbox"
                                        ></v-checkbox>
                                    </v-col>
                                    <v-col  cols="12" sm="6">
                                        <v-checkbox
                                            v-model="eventDetails.allDay"
                                            label="All Day Event"
                                            data-vv-name="checkbox"
                                            type="checkbox"

                                        ></v-checkbox>
                                    </v-col>
                                    <v-col  cols="12" sm="6" v-if="eventDetails.IsRecurring">
                                        <v-select
                                            :disabled="!eventDetails.IsRecurring"
                                            :items="days"
                                            filled
                                            multiple
                                            chips
                                            v-model="eventDetails.daysOfWeek"
                                            label="Recurring days"
                                            :menu-props="{ top: false, offsetY: true }"
                                            item-text="value"
                                            item-value="day"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea
                                            dense
                                            filled
                                            clearable
                                            auto-grow
                                            rows="3"
                                            label="Event Description"
                                            prepend-inner-icon="mdi-clipboard-text-outline"
                                            v-model="eventDetails.description"
                                        ></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field
                                            dense
                                            filled
                                            label="Location"
                                            prepend-inner-icon="mdi-map-marker"
                                            v-model="eventDetails.location"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select
                                            v-model="eventDetails.category"
                                            :items="categories"
                                            label="Event Category"
                                            :menu-props="{ top: false, offsetY: true }"
                                            item-text="categorie"
                                            item-value="categorie"
                                        >
                                            <template v-slot:item="{ item }">
                                                <div :style="{ backgroundColor: item.color, width: 100 + '%' }" class="pa-2">
                                                    {{item.categorie}}
                                                </div>
                                            </template>
                                            <template v-slot:selection="{ item }">
                                                <div :style="{ color: item.color, width: 100 + '%' }">
                                                    {{item.categorie}}
                                                </div>
                                            </template>
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary align-self-start" text @click.prevent="toggleDialogFn(); resetEventDetails()">Close</v-btn>
                            <v-btn color="normal" v-if="dialogOptions.edit" @click.prevent="toggleConfirmDialog()">Delete</v-btn>
                            <v-btn color="primary" :disabled="!valid" v-if="dialogOptions.create" @click.prevent="createEvent(); toggleDialogFn(); resetEventDetails()">Create</v-btn>
                            <v-btn color="primary" :disabled="!valid" v-if="dialogOptions.edit" @click.prevent="updateEvent(); toggleDialogFn(); resetEventDetails()">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
                <v-dialog v-model="dialogConfirm" width="500">
                    <v-card>
                        <v-card-title>Are you sure you want to delete this event?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary align-self-start" text @click.prevent="toggleConfirmDialog();">Cancel</v-btn>
                            <v-btn color="primary" @click.prevent="deleteEvent(); toggleConfirmDialog(); toggleDialogFn(); resetEventDetails();">Confirm</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>
        </Dialog>
    </section>
</template>

<script>
import Dialog from './Dialog'
import BusyIndicator from './BusyIndicator'

import FullCalendar from '@fullcalendar/vue'
import DayGridPlugin from '@fullcalendar/daygrid'
import InteractionPlugin from '@fullcalendar/interaction'
import ListPlugin from '@fullcalendar/list'
import TimegridPlugin from '@fullcalendar/timegrid'
import momentPlugin from '@fullcalendar/moment'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import moment from 'moment';

import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

import {bus} from'../main.js';

export default {
    name: 'FullCalendarComponent',
    components: {
        FullCalendar,
        Dialog,
        BusyIndicator
    },
    props: {
        
    },
    data() {
        return {
            currentUser: {}, // current user data
            Username: '', // current username
            valid: true, // for form validation
            lazy: false, // for form validation
            loading: true, // busy indicator
            dialog: false, // initial dialog state
            dialogConfirm: false, // toggle dialog
            dialogOptions: { // options to hide/show buttons and title
                edit: false,
                create: false,
                title: ''
            },
            days: [ // data for recurring event
                {value: 'monday', day: '1'},
                {value: 'tuesday', day: '2'},
                {value: 'wednesday', day: '3'},
                {value: 'thursday', day: '4'},
                {value: 'friday', day: '5'},
                {value: 'saturday', day: '6'},
                {value: 'sunday', day: '7'}
            ],
            categories: [ // predefined events for Event Category
                {categorie: 'Vacation', color: 'Green'},
                {categorie: 'Sick Days', color: 'Orange'},
                {categorie: 'Work', color: 'Blue'},
                {categorie: 'Break', color: 'LightBlue'},
            ],
            calendarMenuStart: false, // start date var
            calendarMenuEnd: false, // end date var
            timeMenuStart: false, // start time var
            timeMenuEnd: false, // end time var
            eventDetails: { // event details from click events
                allDay: '',
                attendee: '',
                category: null,
                color: '',
                created: null,
                description: '',
                end: '',
                id: '',
                region: '',
                role: '',
                start: '',
                title: '',
                eventStartTime: '',
                eventEndTime: '',
                IsRecurring: '',
                daysOfWeek: [],
                startTime: '',
                endTime: '',
                startRecur: '',
                endRecur: '',
            },
            calendarOptions: { // calendar options and events
                timeZone: 'local',
                plugins: [
                    DayGridPlugin,
                    InteractionPlugin,
                    ListPlugin,
                    TimegridPlugin,
                    momentPlugin,
                    momentTimezonePlugin
                ],
                height: '100%',
                initialView: 'dayGridMonth',
                dayMaxEvents: true,
                eventDisplay: 'block',
                headerToolbar: {
                    start: 'title',
                    center: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                    end: 'prev today next'
                },
                selectable: false, // disable/enable select
                select: this.handleSelect, // define select Fn
                eventClick: this.handleClick, // define event click Fn
                dateClick: this.handleDateClick, // define date click Fn
                displayEventTime: true,
                displayEventEnd: true,
                eventTimeFormat: {
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false
                },
                events: [], // calendar events
            }
        }
    },
    computed: {
    },
    methods: {
        ...mapActions(['addEvent', 'getEvents']), // map store actions
        handleSelect: function(arg) { // when selecting one or more calendar fields (days)

            let payload = {
                start: arg.start,
                end: arg.end,
                title: arg.startStr,
                allDay: arg.allDay,
                color: "#d914a4"
            }

            this.$store.dispatch('addEvent', payload)
        },
        handleClick(arg) { // when clicking on event
            // set dialog title and mode (edit or create)
            this.dialogOptions.title = 'Event Edit';
            this.dialogOptions.edit = true;
            
            // extendedProps
            this.eventDetails.category = arg.event.extendedProps.Category;
            this.eventDetails.description = arg.event.extendedProps.Description;
            this.eventDetails.IsRecurring = (arg.event.extendedProps.IsRecurring == null) ? false : arg.event.extendedProps.IsRecurring;
            this.eventDetails.Region = arg.event.extendedProps.Region;
            this.eventDetails.Role = arg.event.extendedProps.Role;

            // fullcalendar standard props
            this.eventDetails.id = arg.event.id;
            this.eventDetails.groupId = arg.event.id;
            this.eventDetails.allDay = arg.event.allDay;
            this.eventDetails.title = arg.event.title;
            this.eventDetails.color = arg.event.color;
            this.eventDetails.start = (arg.event.start == undefined || arg.event.start == null) ? null : moment(arg.event.start).format('YYYY-MM-DD');
            this.eventDetails.end = (arg.event.end == undefined || arg.event.end == null) ? null : moment(arg.event.end).format('YYYY-MM-DD');
            this.eventDetails.eventStartTime = (arg.event.start == undefined || arg.event.start == null) ? null :moment(arg.event.start, "HH:mm").format('HH:mm');
            this.eventDetails.eventEndTime = (arg.event.end == undefined || arg.event.end == null) ? null : moment(arg.event.end, "HH:mm").format('HH:mm');
            // fullcalendar recurring properties
            this.eventDetails.daysOfWeek = (!this.eventDetails.IsRecurring) ? null : arg.event._def.recurringDef.typeData.daysOfWeek.split(",");
            this.eventDetails.startTime = (!this.eventDetails.IsRecurring) ? null : arg.event._def.recurringDef.typeData.startTime;
            this.eventDetails.endTime = (!this.eventDetails.IsRecurring) ? null : arg.event._def.recurringDef.typeData.endTime;
            this.eventDetails.startRecur = (!this.eventDetails.IsRecurring) ? null : arg.event._def.recurringDef.typeData.startRecur;
            this.eventDetails.endRecur = (!this.eventDetails.IsRecurring) ? null : arg.event._def.recurringDef.typeData.endRecur;

            this.toggleDialogFn(); // open dialog
        },
        handleDateClick(arg) {// when clicking on empty date to create an event
            // set dialog title and mode (edit or create)
            this.dialogOptions.title = 'Event Create';
            this.dialogOptions.create = true;

            // set eventDetails data
            this.eventDetails.start = moment(arg.date).format('YYYY-MM-DD');
            this.eventDetails.end = moment(arg.date).format('YYYY-MM-DD');
            this.eventDetails.eventStartTime = moment(arg.date, "HH:mm").format('HH:mm');
            this.eventDetails.eventEndTime = moment(arg.date, "HH:mm").format('HH:mm');
            this.eventDetails.allDay = false;
            
            this.toggleDialogFn(); // open dialog
        },
        toggleDialogFn() { // open/close dialog
            bus.$emit('toggleDialog', this.dialog);
        },
        toggleConfirmDialog() { // open/close dialog confirmation dialog (e.g. when deleting event)
            this.dialogConfirm = !this.dialogConfirm
        },
        resetEventDetails() { // reset eventDetails and dialogOptions
            Object.keys(this.eventDetails).forEach(key => {
               return (this.eventDetails[key] = '')
           })
            this.dialogOptions = {};
        },
        getCalendarData() {// get calendar data for current user
            let usernameSplit = this.currentUser.LoginName.split("|")[1];
            // let username = usernameSplit.replace('positive\\','') // get only username without 'positive\'
            this.Username = usernameSplit;

            // get events for current user
            this.$store.dispatch('getEvents', this.Username).then(() => {
                this.calendarOptions.events = this.$store.state.events;
                this.loading = false;
            });
        },
        createEvent() { // create calendar event
            let getStartTime = this.buildStartTime(this.eventDetails.start, this.eventDetails.eventStartTime);
            let getEndTime = this.buildEndTime(this.eventDetails.end, this.eventDetails.eventEndTime);

            this.loading = true;

            let eventModel = {
                id: this.eventDetails.id,
                title: this.eventDetails.title,
                Description: this.eventDetails.description,
                start: (this.eventDetails.start == undefined) ? null : getStartTime,
                end: (this.eventDetails.end == undefined) ? null : getEndTime,
                Created: null,
                Category: (this.eventDetails.category == undefined) ? null : this.eventDetails.category,
                Region: null,
                Role: null,
                Attendee: this.Username,
                allDay: this.eventDetails.allDay,
                IsRecurring: this.eventDetails.IsRecurring,
                daysOfWeek:  (!this.eventDetails.IsRecurring) ? null : this.eventDetails.daysOfWeek.toString()
            }

            this.$store.dispatch('createEvent', eventModel).then(() => {
                this.$store.dispatch('getEvents', this.Username).then(() => {
                    this.calendarOptions.events = this.$store.state.events;
                    this.loading = false;
                });
            });
        },
        updateEvent() { // update calendar event
            let getStartTime = this.buildStartTime(this.eventDetails.start, this.eventDetails.eventStartTime);
            let getEndTime = this.buildEndTime(this.eventDetails.end, this.eventDetails.eventEndTime);

            this.loading = true;

            let eventModel = {
                id: this.eventDetails.id,
                title: this.eventDetails.title,
                Description: this.eventDetails.description,
                start: (this.eventDetails.start == undefined) ? null : getStartTime,
                end: (this.eventDetails.end == undefined) ? null : getEndTime,
                Created: null,
                Category: (this.eventDetails.category == undefined) ? null : this.eventDetails.category,
                Region: null,
                Role: null,
                Attendee: this.Username,
                allDay: this.eventDetails.allDay,
                IsRecurring: this.eventDetails.IsRecurring,
                daysOfWeek:  (!this.eventDetails.IsRecurring) ? null : this.eventDetails.daysOfWeek.toString()
            }

            this.$store.dispatch('updateEvent', eventModel).then(() => {
                this.$store.dispatch('getEvents', this.Username).then(() => {
                    this.calendarOptions.events = this.$store.state.events;
                    this.loading = false;
                });
            });
        },
        deleteEvent() {
            this.loading = true;

            this.$store.dispatch('deleteEvent', this.eventDetails.id).then(() => {
                this.$store.dispatch('getEvents', this.Username).then(() => {
                    this.calendarOptions.events = this.$store.state.events;
                    this.loading = false;
                });
            });
        },
        createEventModel(event) {
            let getStartTime = this.buildStartTime(event.start, event.eventStartTime);
            let getEndTime = this.buildEndTime(event.end, event.eventEndTime);

            this.loading = true;

            let eventModel = {
                AllDay: event.allDay,
                Attendee: this.Username,
                Category: (event.category == undefined) ? null : event.category,
                Color: event.color,
                Created: null,
                Description: event.description,
                EndDateTime: (event.allDay || event.end == undefined) ? null : getEndTime,
                Id: event.id,
                Region: null,
                Role: event.administrator,
                StartDateTime: (event.allDay || event.start == undefined) ? null : getStartTime,
                Title: event.title,
                // recurring properties
                IsRecurring: event.IsRecurring,
                // GroupId: event.Id,
                DaysOfWeek: event.daysOfWeek.toString(),
                StartTime: (!event.IsRecurring) ? null : event.startTime,
                EndTime: (!event.IsRecurring) ? null : event.endTime,
                StartRecurringDate: (!event.IsRecurring) ? null : event.startRecur,
                EndRecurringDate: (!event.IsRecurring) ? null : event.endRecur,
            }

            return eventModel;
        },
        buildStartTime(startDate, startTime) {
            // create start time out of date and time
            return startDate + 'T' + startTime
        },
        buildEndTime(endDate, endTime) {
            // create end time out of date and time
            return endDate + 'T' + endTime
        },
        validate () {
            this.$refs.form.validate()
        },
    },
    created() {
        this.currentUser = window.userPermissions; // get current user information
        this.getCalendarData();
    }
};
</script>
<style>
    section {
        height: 100%;
        position: relative;
        padding: 20px;
    }
    .v-text-field__slot input[type=password],
    .v-text-field__slot input[type=text],
    .v-text-field__slot input[type=file],
    .v-text-field__slot input[type=time],
    .v-select__selections input[type=password],
    .v-select__selections input[type=text],
    .v-select__selections input[type=file],
    .v-select__selections input[type=time] {
        background-color: transparent;
        outline: none;
        border: none;
    }
</style>