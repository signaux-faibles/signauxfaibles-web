const lib = {
    accessor(store: any, prop: string) {
        return {
            get() {
                return store.state[prop]
            },
            set(value: any) {
                store.state.commit(prop, value)
            }
        }
    }
}
export default lib