
import Vue from 'vue'

Vue.filter('formatDate', (value) => {
  const date = new Date(value)
  return date.toLocaleString(['en-GB'], {
    month: 'short',
    year: 'numeric'
  })
})
Vue.filter('formatYear', (value) => {
  const date = new Date(value)
  return date.toLocaleString(['en-GB'], {
    year: 'numeric'
  })
})