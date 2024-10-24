import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import styles from './style';

interface MapProps {
  latitude: number;
  longitude: number;
  markers?: {
    coords: {
      latitude: number;
      longitude: number;
    },
    title?: string,
    description?: string
  }[];
}

const Map = ({latitude = 0, longitude = 0, markers = []}: MapProps) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
      scrollEnabled
      zoomEnabled>
      {markers.map(item => (
        <Marker
          coordinate={item.coords}
          title={item.title || ''}
          description={item.description || ''}
        />
      ))}
    </MapView>
  );
};

export default Map;
