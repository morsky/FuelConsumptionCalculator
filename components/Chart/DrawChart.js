import { StyleSheet, Dimensions } from "react-native";

import { LineChart, BarChart } from "react-native-chart-kit";

function DrawChart({ data }) {
  const screenWidth = Dimensions.get("window").width;

  function dotSize(length) {
    if (length > 7) return "3";

    return "6";
  }

  return (
    // <ScrollView horizontal={true}>
    <LineChart
      data={{
        // Object.keys(data)
        // labels: Object.keys(data),
        // legend: ["Cnsumption"], // optional
        labels: data.labels,
        datasets: [
          {
            // Object.values(data)
            // data: Object.values(data),
            data: data.values,
          },
        ],
      }}
      width={screenWidth - 24} // from react-native
      height={220}
      yAxisLabel="l "
      // yAxisSuffix="k"
      yAxisInterval={1} // optional, defaults to 1
      // verticalLabelRotation={-90}
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
          // r: "6",
          r: dotSize(data.labels.length),
          strokeWidth: "2",
          stroke: "#ffa726",
        },
      }}
      bezier
      style={styles.chartStyles}
    />
    // </ScrollView>
  );
}

export default DrawChart;

const styles = StyleSheet.create({
  chartStyles: {
    borderRadius: 16,
    marginVertical: 8,
    marginRight: -24,
  },
});
