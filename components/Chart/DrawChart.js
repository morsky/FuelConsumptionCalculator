import { StyleSheet, Dimensions } from "react-native";

import { LineChart } from "react-native-chart-kit";
import { Colors } from "../../constants/colors";

const CHART_LABEL_RIGHT_MARGIN = -33;
const CHART_DOT_SIZE = 10;

function DrawChart({ data }) {
  const screenWidth = Dimensions.get("window").width;

  function dotSize(length) {
    if (length > CHART_DOT_SIZE && length < CHART_DOT_SIZE * 2) return "3";
    if (length > CHART_DOT_SIZE * 2) return "2";

    return "6";
  }

  return (
    <LineChart
      data={{
        labels: data.labels,
        datasets: [
          {
            data: data.values,
          },
        ],
      }}
      width={screenWidth + CHART_LABEL_RIGHT_MARGIN}
      height={220}
      yAxisLabel="l "
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundGradientFrom: Colors.orange700,
        backgroundGradientTo: Colors.orange700,
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
          r: dotSize(data.labels.length),
          strokeWidth: "2",
          stroke: Colors.orange800,
        },
      }}
      bezier
      style={styles.chartStyles}
    />
  );
}

export default DrawChart;

const styles = StyleSheet.create({
  chartStyles: {
    borderRadius: 10,
    marginVertical: 8,
    marginRight: CHART_LABEL_RIGHT_MARGIN,
  },
});
