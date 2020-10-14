export default {
    methods: {
        md_header_read: function (md_text) {
            const store = new Vuex.Store({
                state: {
                    title: "",
                    category: "",
                    tags: []
                },
                mutations: {
                    set_title(value) {
                        state.title = value
                    },
                    set_category(value) {
                        state.category = value
                    },
                    set_tags(value) {
                        state.tags = value
                    }

                }

            })
            var arr = md_text.split(/\r\n|\n/);

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === "") {
                    break
                }
                const row = arr[i].split(/:/)
                switch (row[0]) {
                    case "title":
                        store.set_title(row[1])
                        break
                    case "category":
                        store.set_category(row[1])
                        break
                    case "tag":
                        store.set_tags(row[1].split(/,/))
                        break
                }

            }
        }
    }
}
