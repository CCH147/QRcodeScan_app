import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Button, Linking, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createBrowserRouter, RouterProvider, Link ,BrowserRouter } from 'react-router-dom';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('掃描條碼')

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // 請求權限
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // when scan the bar
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    console.log('Type: ' + type + '\nData: ' + data)
  };

  const OpenURLButton = ({url, children}) => {
    const handlePress = useCallback(async () => {
      // 檢查連結
      const supported = await Linking.canOpenURL(text);

      if (supported) {
        await Linking.openURL(text);
      } else {
        Alert.alert(`無法開啟連結: ${text}`);
      }
    }, [text]);
    return <Button title={children} onPress={handlePress} color='#5A6CF3'/>;
  };

  // 查看權限
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>請求相機權限中...</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>權限被拒...</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return 前端
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.containerForm} />
      </View>
      <Text style={styles.maintext}>{text}</Text>
      <OpenURLButton url={text}>開啟連結</OpenURLButton>
      {scanned && <Button title={'重新掃描'} onPress={() => setScanned(false)} color='tomato' />} 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
		paddingHorizontal: 16,
  },
  containerForm: {
    height: "100%",
    width: "100%", 
		flexDirection: 'row',
		flexWrap: 'wrap',
		margin: 10,
		justifyContent: 'space-between'
	},
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  btn: {
    width: 50,
    color: '#494949',
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: "70%",
    width: "90%",
    overflow: 'hidden',
    borderRadius: 30,
  }
});
