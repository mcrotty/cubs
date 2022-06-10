
Vue.component('event-list', {
	props: ['filterUpcoming', 'filterImportant', 'filterSearch', 'content', 'nodetails'],
	data: () => ({
		eventList: []
	}),
	computed: {
		height() {
						if (this.nodetails) return '400px';

		        switch (this.$vuetify.breakpoint.name) {
		          case 'xs': return '500px'
		          case 'sm': return '500px'
		          case 'md': return '450px'
		          case 'lg': return '450px'
		          case 'xl': return '450px'
		        }
		      },
		maxwidth() {
		        switch (this.$vuetify.breakpoint.name) {
		          case 'xs': return '350px'
		          case 'sm': return '600px'
		          case 'md': return '700px'
		          case 'lg': return '700px'
		          case 'xl': return '700px'
		        }
		      },
	},

	methods: {
		filteredList() {
			// if (this.eventList === undefined || this.eventList === null) {
			// 	return false;
			// }

			return this.eventList.filter(e => {
				if (e === undefined || e === null) {
					return false;
				}
				let conditions = [true, true, true];
				conditions[0] = e.upcoming == this.filterUpcoming;

				if(this.filterImportant)
					conditions[1] = e.important == this.filterImportant;
				if(this.filterSearch.trim() != '')
					conditions[2] = e.title.toLowerCase().includes(this.filterSearch.trim().toLowerCase());

				return conditions.every(e => e === true);
			});
		},
		cardBeforeEnter(el) {
			el.style.opacity = 0;
			el.style.transform = 'scale(90%)';
			el.style.height = 0;
		},
		cardEnter(el, done) {
			let h = this.height;
			let delay = el.dataset.index * 200;
			setTimeout(() => {
				Velocity(
					el,
					{ opacity: 1, height: h, scale: '100%' },
					{ complete: done }
				);
			}, delay);
		},
		cardLeave(el, done) {
			let delay = el.dataset.index * 200;
			setTimeout(() => {
				Velocity(
					el,
					{ opacity: 0, height: 0, scale: '90%' },
					{ complete: done }
				);
			}, delay);
		}
	},
	created() {
		fetch(this.content)
			.then(r => r.json())
			.then( json => {
				let to = Date.now() - (1000 * 60 * 60 * 24); // reset to 24 hours ago
				json.forEach(e => e.upcoming = to < Date.parse(e.date));
				return json; })
			.then( json => (this.eventList = json));
	},
	template: document.getElementById('componentTemplate').innerHTML
});

const vuetifyOptions = { };
Vue.use(Vuetify);

new Vue({
	el: "#app",
	vuetify: new Vuetify(vuetifyOptions),
	data: () => ({
		searchIsFocused: false,
		eventsUpcomingFilter: 'upcoming',

		filter: {
			upcoming: true,
			important: false,
			search: ''
		}
	}),
	methods: {
		searchFocus() {
			this.searchIsFocused = true;
		},
		searchUnfocus() {
			this.searchIsFocused = false;
		},
		upcomingFilterChange() {
			switch(this.eventsUpcomingFilter) {
				case 'important':
					this.filter.upcoming = true;
					this.filter.important = true;
					break;
				case 'upcoming':
					this.filter.upcoming = true;
					this.filter.important = false;
					break;
				case 'finished':
					this.filter.upcoming = false;
					this.filter.important = false;
					break;
			}
		}
	}
});
