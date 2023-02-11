import React, { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';

import { COLORS } from '../../common';

export const AddPhotoButton = () => {
  const [response, setResponse] = useState();
  const onButtonPress = React.useCallback(async () => {
    let image = await launchImageLibrary({
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      quality: '0.5',
    });
    if (image.assets) {
      console.log(image.assets);
      setResponse(image);
    }
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onButtonPress()}>
      {response ? (
        <Image
          resizeMethod="resize"
          style={styles.image}
          source={{
            uri: response.assets[0].uri,
          }}
        />
      ) : (
        <>
          <Text style={styles.text}>Add a photo</Text>
          <MaterialIcon name="add" size={16} />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  text: {
    fontSize: 16,
  },
});
