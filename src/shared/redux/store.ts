import 'src/shared/redux/listeners/computerPlayer'

import { configureStore } from '@reduxjs/toolkit'
import { reducer } from 'src/shared/redux/reducer'
import { listenerMiddleware } from 'src/shared/redux/listenerMiddleware'

export default configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware)
})
