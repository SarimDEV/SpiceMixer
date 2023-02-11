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

export const AddPhotoButton = ({ image, setImage }) => {
  const onButtonPress = React.useCallback(async () => {
    let im = await launchImageLibrary({
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      quality: '0.25',
    });
    if (im.assets) {
      setImage(im);
    }
  }, [setImage]);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onButtonPress()}>
      {image ? (
        <Image
          resizeMethod="resize"
          style={styles.image}
          source={{
            uri: image.assets[0].uri,
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
