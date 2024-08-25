import { configureStore } from '@reduxjs/toolkit'
import { reducer } from 'src/shared/redux/reducer'
import { listenerMiddleware } from 'src/shared/redux/middleware'

export default configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware)
})
