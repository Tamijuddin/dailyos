import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Views
import { Home, Orders, Order, Planned } from '../../views'

const Main = () => {
   return (
      <main>
         <Switch>
            <Route path="/apps/order" exact>
               <Home />
            </Route>
            <Route path="/apps/order/orders" exact>
               <Orders />
            </Route>
            <Route path="/apps/order/orders/:id" exact>
               <Order />
            </Route>
            <Route path="/apps/order/planned" exact>
               <Planned />
            </Route>
         </Switch>
      </main>
   )
}

export default Main
