//IMPORTANT NOTE : To simplify running this app on Snack Expo, I've conveniently included all screens and navigation within App.tsx
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
        contentContainerStyle={{paddingBottom:35}}
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
        <View style={styles.ActivityIndicatorView}>
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
      {loading ? (
        <View style={styles.ActivityIndicatorView}>
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
  resetSelections,
}: any) => {
  const handleReset = () => {
    resetSelections();
    navigation.navigate("Year");
  };

  return (
    <SafeAreaView style={styles.summaryContainer}>
      <ImageBackground
        source={{
          uri: "https://www.freepnglogos.com/uploads/autozone-png-logo/autozone-symbol-png-logo-6.png",
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

  const resetSelections = () => {
    setSelectedYear(null);
    setSelectedMake(null);
    setSelectedModel(null);
  };

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
              resetSelections={resetSelections}
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
    // paddingTop: 0,
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
    resizeMode: "cover",
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
    alignSelf: "center",
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
  ActivityIndicatorView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
