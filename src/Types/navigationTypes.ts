import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { ComponentType } from "react";

import { ScreenNameConstants } from "../Constants/navigationConstants";

const {
    LOGIN,
    SIGNUP,
    HOME,
    ALARM_SCREEN,
    CONTACTS
} = ScreenNameConstants

export type RootStackParamList = {
    [LOGIN]: undefined;
    [SIGNUP]: undefined;
    [HOME]: undefined;
    [CONTACTS]: undefined;
    [ALARM_SCREEN]: {
        latitude: number;
        longitude: number;
    }
};

export type NavigationObj = {
    name: keyof RootStackParamList;
    options?: NativeStackNavigationOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: ComponentType<any>;
  };
