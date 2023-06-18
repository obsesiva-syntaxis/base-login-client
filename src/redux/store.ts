import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer: []
})

export const useAppSelector: TypedUseSelectorHook<ReduxStateEssence> = useSelector;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export type ReduxStateEssence = ReturnType<typeof store.getState>
export type DispatchEssence = typeof store.dispatch;