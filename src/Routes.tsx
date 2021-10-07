import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Home } from './components/pages/Home'
import ScrollToTop from './utils/scrollToTop'

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
]

export default function Routes() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {routes.map((props) => (
          <Route {...props} />
        ))}
      </Switch>
    </>
  )
}
