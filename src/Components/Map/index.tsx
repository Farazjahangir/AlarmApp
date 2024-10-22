import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import styles from './style';

const Map = ({latitude = 0, longitude = 0, markers = []}) => {
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
      zoomEnabled
      >
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
