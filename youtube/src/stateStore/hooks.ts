import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./index.ts";
import { TypedUseSelectorHook, useSelector } from "react-redux";


export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
