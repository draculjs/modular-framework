##Documentation
- [English](./readme-en.md)  
- [Spanish](./readme-es.md)


## Vuei18n Integration


On your main.js file
```js
import store from './store'
import i18n from './i18n'

//1. Load from localstore
i18n.locale = store.state.customization.language
//2. Load from backend
store.dispatch('loadCustomizations')
     .then(r => {
         i18n.locale = r.language
     })

```

