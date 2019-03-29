/**
 * Enabled v-data-table to have moire than one filter.
 */

interface ICallbacks<V> {
    [key: string]: V;
}

class MultiFilters {
    /**
     * Updates filter values.
     * @param filters filter´s object
     * @param val JSON chunk to be updated.
     * @returns {*}
     */
    public static updateFilters(filters: any, val: any): any {
        return Object.assign({}, filters, val);
    }

    private items: any;
    private filter: any;
    private headers: any;
    private filters: any;
    private filterCallbacks: ICallbacks<any>;

    /**
     * Constructor.
     *
     * @param items
     * @param filters
     * @param filter
     * @param headers
     */
    constructor(items: any, filters: any, filter: any, headers: any) {
        this.items = items;
        this.filter = filter;
        this.headers = headers;
        this.filters = filters;
        this.filterCallbacks = new Map<string, any>();
    }

    /**
     * Adds a new filter
     * @param filterName The name of the filter from which the information will be extracted
     * @param filterCallback The callback that will apply the filter.
     */
    public registerFilter(filterName: string, filterCallback: any) {
        this.filterCallbacks[filterName] = filterCallback;
    }

    /**
     * Run all filters.
     * @returns {*}
     */
    public runFilters(): any {
        const self = this;
        let filteredItems = self.items;

        Object.entries(this.filterCallbacks).forEach(([entity, cb]) => {
            filteredItems = cb.call(self, self.filters[entity], filteredItems);
        });

        return filteredItems;
    }
}

// Vue plugin.
const MultiFiltersPlugin = {
    install(Vue: any, options: any) {
        Vue.prototype.$MultiFilters = MultiFilters;
    },
};

export default MultiFiltersPlugin;
