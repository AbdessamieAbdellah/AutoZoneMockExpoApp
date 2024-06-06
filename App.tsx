import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons"; // For icons
import { BackHandler } from "react-native"; // For exiting the app
import axios from "axios";
import { FlashList } from "@shopify/flash-list";

const years = Array.from({ length: 2024 - 1995 + 1 }, (_, i) => 2024 - i);

interface Make {
  MakeId: number;
  MakeName: string;
}

interface Model {
  Model_ID: number;
  Model_Name: string;
}

const YearScreen = ({ navigation, setSelectedYear }: any) => {
  const handleYearPress = (year: number) => {
    setSelectedYear(year);
    navigation.navigate("Make");
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={years}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleYearPress(item)}>
            <Text style={styles.listItem}>{item}</Text>
          </TouchableOpacity>
        )}
        estimatedItemSize={50}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const MakeScreen = ({ navigation, selectedYear, setSelectedMake }: any) => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedYear) {
      setLoading(true);
      axios
        .get(
          "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"
        )
        .then((response) => {
          setMakes(response.data.Results);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedYear]);

  const handleMakePress = (make: string) => {
    setSelectedMake(make);
    navigation.navigate("Model");
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.ActivityIndicatorView} >
        <ActivityIndicator size="small" color="red" />
        </View>
      ) : (
        <FlashList
          data={makes}
          keyExtractor={(item) => item.MakeId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMakePress(item.MakeName)}>
              <Text style={styles.listItem}>{item.MakeName}</Text>
            </TouchableOpacity>
          )}
          estimatedItemSize={50}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const ModelScreen = ({ navigation, selectedMake, setSelectedModel }: any) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedMake) {
      setLoading(true);
      axios
        .get(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${selectedMake}?format=json`
        )
        .then((response) => {
          setModels(response.data.Results);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedMake]);

  const handleModelPress = (model: string) => {
    setSelectedModel(model);
    navigation.navigate("Summary");
  };

  return (
    <View style={styles.container}>
      {loading ? (<View style={styles.ActivityIndicatorView} >
        <ActivityIndicator size="small" color="red" />
        </View>
      ) : (
        <FlashList
          data={models}
          keyExtractor={(item) => item.Model_ID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleModelPress(item.Model_Name)}>
              <Text style={styles.listItem}>{item.Model_Name}</Text>
            </TouchableOpacity>
          )}
          estimatedItemSize={50}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const SummaryScreen = ({
  selectedYear,
  selectedMake,
  selectedModel,
  navigation,
}: any) => {
  const handleReset = () => {
    navigation.navigate("Year");
  };

  return (
    <SafeAreaView style={styles.summaryContainer}>
      <ImageBackground
        source={{
          uri: "data:image/png;base64,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",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.summaryText}>Car info :</Text>
          <Text
            style={styles.summaryText}
          >{`${selectedYear} ${selectedMake} ${selectedModel}`}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default function App() {
  const Stack = createStackNavigator();

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const Header = ({ navigation, activeSection }: any) => {
    const handleBack = () => {
      navigation.goBack();
    };

    const handleClose = () => {
      BackHandler.exitApp();
    };

    const renderIcon = () => {
      if (activeSection === "Year") {
        return (
          <TouchableOpacity onPress={handleClose}>
            <AntDesign name="close" size={24} color="red" />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={handleBack}>
            <AntDesign name="left" size={28} color="red" />
          </TouchableOpacity>
        );
      }
    };

    const renderText = () => {
      switch (activeSection) {
        case "Year":
          return "Choose Year";
        case "Make":
          return "Choose Make";
        case "Model":
          return "Choose Model";
        default:
          return "";
      }
    };

    return (
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.topBar}>
          <View style={{ width: "10%", height: "auto" }}>
            {renderIcon()}
          </View>
          <View style={{ width: "65%", height: "auto" }}>
            <Text style={styles.topBarText}>{renderText()}</Text>
          </View>
        </View>
        <View style={styles.selectedValuesContainer}>
          {selectedModel !== null ||
          selectedMake !== null ||
          selectedYear !== null ? (
            <Text style={styles.selectedText}>{`${selectedYear ?? ""} ${
              selectedMake ?? ""
            } ${selectedModel ?? ""}`}</Text>
          ) : null}
        </View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Year")}>
            <Text
              style={[
                styles.headerText,
                activeSection === "Year" && styles.activeHeader,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Make")}
            disabled={!selectedYear}
          >
            <Text
              style={[
                styles.headerText,
                activeSection === "Make" && styles.activeHeader,
              ]}
            >
              Make
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Model")}
            disabled={!selectedMake}
          >
            <Text
              style={[
                styles.headerText,
                activeSection === "Model" && styles.activeHeader,
              ]}
            >
              Model
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Year">
        <Stack.Screen name="Year" options={{ headerShown: false }}>
          {(props) => (
            <>
              <Header {...props} activeSection="Year" />
              <YearScreen {...props} setSelectedYear={setSelectedYear} />
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="Make" options={{ headerShown: false }}>
          {(props) => (
            <>
              <Header {...props} activeSection="Make" />
              <MakeScreen
                {...props}
                selectedYear={selectedYear}
                setSelectedMake={setSelectedMake}
              />
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="Model" options={{ headerShown: false }}>
          {(props) => (
            <>
              <Header {...props} activeSection="Model" />
              <ModelScreen
                {...props}
                selectedMake={selectedMake}
                setSelectedModel={setSelectedModel}
              />
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="Summary" options={{ headerShown: false }}>
          {(props) => (
            <SummaryScreen
              {...props}
              selectedYear={selectedYear}
              selectedMake={selectedMake}
              selectedModel={selectedModel}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  headerContainer: {
    width: "100%",
    height: "17%",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  topBarText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    color: "#888",
  },
  activeHeader: {
    fontWeight: "bold",
    color: "#000",
  },
  selectedValuesContainer: {
    alignItems: "center",
  },
  selectedText: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
  },
  listItem: {
    padding: 15,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
  },
  summaryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: 'cover'
  },
  summaryText: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
  resetButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    alignSelf:'center'
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 20,
    borderRadius: 10,
  },
  ActivityIndicatorView:{
    flex:1,
     justifyContent:'center',
      alignItems:'center'
  }
});
