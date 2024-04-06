import { useSyncExternalStore } from "react"
import { store } from "../store"

const useSyncProviders = () => {
 return  useSyncExternalStore(store.subscribe, store.value, store.value)
}

export default useSyncProviders