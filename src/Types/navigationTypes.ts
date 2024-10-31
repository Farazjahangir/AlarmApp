import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { ComponentType } from "react";
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';

import { ScreenNameConstants } from "../Constants/navigationConstants";

const {
    LOGIN,
    SIGNUP,
    HOME,
    ALARM_SCREEN,
    CONTACTS,
    COMPLETE_PROFILE,
    TAB_NAV
} = ScreenNameConstants

export type RootStackParamList = {
    [LOGIN]: undefined;
    [SIGNUP]: undefined;
    [HOME]: undefined;
    [CONTACTS]: undefined;
    [ALARM_SCREEN]: {
        latitude: number;
        longitude: number;
    },
    [COMPLETE_PROFILE]: undefined;
    [TAB_NAV]: undefined
};

export type NavigationObj = {
    name: keyof RootStackParamList;
    options?: NativeStackNavigationOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: ComponentType<any>;
};

export interface BottomNavigationObj extends Omit<NavigationObj, 'options'> {
    options?: BottomTabNavigationOptions;
}
