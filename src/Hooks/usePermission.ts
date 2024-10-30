import React, { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { askContactsPermission, askNotificationPermission } from '../Utils';

const usePermissions = () => {
  const [hasPermission, setHasPermission] = useState({});
  const prevAppState = useRef(AppState.currentState);
  const isPermissionChecked = useRef(false);
  const isSettingsOpened = useRef(false);

  // Generic function to request a specific permission
  const requestPermission = async (permissionName) => {
    let permissionStatus = null;
    
    if (permissionName === 'notification') {
      permissionStatus = await askNotificationPermission();
    } else if (permissionName === 'contacts') {
      permissionStatus = await askContactsPermission();
    }
    // Add more permissions here as needed
    // For example:
    // else if (permissionName === 'location') {
    //   permissionStatus = await askLocationPermission();
    // }

    if (permissionStatus === 'settings_opened') {
      isSettingsOpened.current = true;
    }

    return permissionStatus === 'granted';
  };

  // Function to request multiple permissions
  const requestPermissions = async (permissionsList) => {
    try {
      isPermissionChecked.current = true;
      isSettingsOpened.current = false;

      const permissions = { ...hasPermission };

      for (const permission of permissionsList) {
        const isGranted = await requestPermission(permission);
        permissions[permission] = permissions[permission] || isGranted;
      }

      console.log("permissions ARR ====>", permissions)
      setHasPermission(permissions);

      // Reset permission check flag if no settings were opened
      if (!isSettingsOpened.current) {
        isPermissionChecked.current = false;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error.message);
    }
  };

  // Handle app state changes to recheck permissions if needed
  const handleAppStateChange = async (currentAppState) => {
    const prevAppStateStatus = prevAppState.current;
    prevAppState.current = currentAppState;

    if (isSettingsOpened.current && currentAppState === 'active') {
        console.log("RUKNE WALA IFFFFFFFFFFFF")
      isSettingsOpened.current = false;
      isPermissionChecked.current = false;

      // Check if all permissions are granted
      const allGranted = await Promise.all(
        Object.keys(hasPermission).map(async (perm) => await requestPermission(perm))
      ).then(results => results.every(res => res));

      console.log("hasPermission", hasPermission)
      console.log("ALL GRANTED", allGranted)
      if (!allGranted) {
        requestPermissions(Object.keys(hasPermission));
      }
      return;
    }

    // Request permissions on app return if not yet checked
    if (!isPermissionChecked.current && prevAppStateStatus === 'background' && currentAppState === 'active') {
      requestPermissions(Object.keys(hasPermission));
    }
  };

  // Initial permission request and setup AppState listener
  useEffect(() => {
    requestPermissions(['notification', 'contacts']); // Initial permission list
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);
    return () => appStateListener.remove();
  }, []);

  return hasPermission;
};

export default usePermissions
