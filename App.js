/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  View,
  PermissionsAndroid, 
  Platform,
  NativeModules
} from "react-native";

import wifi from "react-native-android-wifi";

const IOSWifiManager = NativeModules.IOSWifiManager;


type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isWifiNetworkEnabled: null,
      currentSSID: "",
      currentBSSID: "",
      status: null,
      iOScurrentSSID: ""
    };
  }

  componentDidMount() {
    if (Platform.OS === 'ios'){
      this.getiOS_SSIDOnPress();
    }
    else{
      console.log(wifi);
      this.askForUserPermissions();
      this.checkWifi();
    }

  }

  async askForUserPermissions() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Wifi networks',
          'message': 'We need your permission in order to find wifi networks'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Thank you for your permission! :)");
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      console.warn(err)
    }
  }


  checkWifi() {
    wifi.isEnabled(isEnabled => {
      if (isEnabled) {
        let checkStatus = setInterval(() => {
          wifi.connectionStatus(isConnected => {
            if (isConnected) {
              console.log("is connected");
              this.getSSIDOnPress();
              this.getBSSIDOnPress();
              clearInterval(checkStatus);
            } else {
              console.log("is not connected");
            }
          });
        },5000);

      } else {
        Promise.all([wifi.setEnabled(true)]).then(() => {
          let checkStatus = setInterval(() => {
            wifi.connectionStatus(isConnected => {
              if (isConnected) {
                console.log("is connected");
                this.getSSIDOnPress();
                this.getBSSIDOnPress();
                clearInterval(checkStatus);
              } else {
                console.log("is not connected");
              }
            });
          },3000);
        });
      }
    });
  }

  serviceCheckOnPress() {
    wifi.isEnabled(isEnabled => {
      this.setState({ isWifiNetworkEnabled: isEnabled });
      console.log(isEnabled);
    });
  }

  serviceSetEnableOnPress(enabled) {
    wifi.setEnabled(enabled);
  }

  getSSIDOnPress() {
      wifi.getSSID(ssid => {
        this.setState({ currentSSID: ssid });
    }
  }

  getBSSIDOnPress() {
      wifi.getBSSID(bssid => {
        this.setState({ currentBSSID: bssid });
      });
  }

  connectionStatusOnPress() {
    wifi.connectionStatus(isConnected => {
      this.setState({ status: isConnected });
    });
  }

  getiOS_SSIDOnPress(){
    IOSWifiManager.currentSSID(ssid => {
      this.setState({iOScurrentSSID:ssid})
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>
            React Native Android Wifi Example App
          </Text>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              Check wifi service status
            </Text>
            <View style={styles.row}>
              <TouchableHighlight
                style={styles.button}
                onPress={this.serviceCheckOnPress.bind(this)}
              >
                <Text style={styles.buttonText}>Check</Text>
              </TouchableHighlight>
              <Text style={styles.answer}>
                {this.state.isWifiNetworkEnabled == null
                  ? ""
                  : this.state.isWifiNetworkEnabled
                  ? "Wifi service enabled :)"
                  : "Wifi service disabled :("}
              </Text>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Connection status</Text>
            <View style={styles.row}>
              <TouchableHighlight
                style={styles.bigButton}
                onPress={this.connectionStatusOnPress.bind(this)}
              >
                <Text style={styles.buttonText}>Get connection status</Text>
              </TouchableHighlight>
              <Text style={styles.answer}>
                {this.state.status == null
                  ? ""
                  : this.state.status
                  ? "You're connected :)"
                  : "You're not connected :("}
              </Text>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              Enable/Disable wifi network
            </Text>
            <View style={styles.row}>
              <TouchableHighlight
                style={styles.button}
                onPress={this.serviceSetEnableOnPress.bind(this, true)}
              >
                <Text style={styles.buttonText}>Enable</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={this.serviceSetEnableOnPress.bind(this, false)}
              >
                <Text style={styles.buttonText}>Disable</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Current SSID</Text>
            <View style={styles.row}>
              <TouchableHighlight
                style={styles.button}
                onPress={this.getSSIDOnPress.bind(this)}
              >
                <Text style={styles.buttonText}>Get SSID</Text>
              </TouchableHighlight>
              <Text style={styles.answer}>{this.state.currentSSID + ""}</Text>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Current BSSID</Text>
            <View style={styles.row}>
              <TouchableHighlight
                style={styles.button}
                onPress={this.getBSSIDOnPress.bind(this)}
              >
                <Text style={styles.buttonText}>Get BSSID</Text>
              </TouchableHighlight>
              <Text style={styles.answer}>{this.state.currentBSSID + ""}</Text>
            </View>
          </View>
          <Text style={styles.title_IOS}>
            React Native iOS Wifi Example App
          </Text>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Current iOS SSID</Text>
            <View style={styles.row}>
              <TouchableHighlight
                style={styles.button}
                onPress={this.getiOS_SSIDOnPress.bind(this)}
              >
                <Text style={styles.buttonText}>Get BSSID</Text>
              </TouchableHighlight>
              <Text style={styles.answer}>{this.state.iOScurrentSSID + ""}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5FCFF",
    marginBottom: 100
  },
  row: {
    flexDirection: "row"
  },
  title: {
    fontSize: 20
  },
  title_IOS: {
    fontSize: 20,
    marginTop: 20
  },
  instructionsContainer: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC"
  },
  instructionsTitle: {
    marginBottom: 10,
    color: "#333333"
  },
  instructions: {
    color: "#333333"
  },
  button: {
    padding: 5,
    width: 120,
    alignItems: "center",
    backgroundColor: "blue",
    marginRight: 15
  },
  bigButton: {
    padding: 5,
    width: 180,
    alignItems: "center",
    backgroundColor: "blue",
    marginRight: 15
  },
  buttonText: {
    color: "white"
  },
  answer: {
    marginTop: 5
  }
});
