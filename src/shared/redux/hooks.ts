import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/shared/redux/StateTypes'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
