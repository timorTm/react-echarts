import * as React from "react";
import ChartComponent from "../component/echartsChart/index";
interface State {
  datas: Array<Object>;
}
export default class ChartTest extends React.Component<{}, State> {
  state = {
    datas: []
  };
  componentWillMount() {
    const datas = [
      {
        title: "测试数据1",
        unit: "km/h",
        data: [
          ["00:01", "45"],
          ["00:03", "34"],
          ["00:05", "74"],
          ["00:07", "--"],
          ["00:09", "--"],
          ["00:11", "--"]
        ]
      },
      {
        title: "测试数据2",
        unit: "km/h",
        data: [
          ["00:01", "32"],
          ["00:03", "44"],
          ["00:05", "34"],
          ["00:07", "--"],
          ["00:09", "--"],
          ["00:11", "--"]
        ]
      },
      {
        title: "测试数据3",
        unit: "km/h",
        data: [
          ["00:01", "28"],
          ["00:03", "46"],
          ["00:05", "58"],
          ["00:01", "--"],
          ["00:03", "--"],
          ["00:05", "--"]
        ]
      }
    ];
    this.setState({ datas });
    this.changeDatas();
  }
  //改变数据
  changeDatas() {
    const datas = [
      {
        title: "测试数据1",
        unit: "km/h",
        data: [
          ["00:01", "45"],
          ["00:03", "34"],
          ["00:05", "74"],
          ["00:07", "34"],
          ["00:09", "56"],
          ["00:11", "71"]
        ]
      },
      {
        title: "测试数据2",
        unit: "km/h",
        data: [
          ["00:01", "32"],
          ["00:03", "44"],
          ["00:05", "34"],
          ["00:07", "54"],
          ["00:09", "63"],
          ["00:11", "64"]
        ]
      },
      {
        title: "测试数据3",
        unit: "km/h",
        data: [
          ["00:01", "28"],
          ["00:03", "46"],
          ["00:05", "58"],
          ["00:01", "28"],
          ["00:03", "45"],
          ["00:05", "37"]
        ]
      }
    ];
    setTimeout(() => {
      this.setState({
        datas: datas
      });
    }, 3000);
  }
  render() {
    return (
      <ChartComponent
        datas={this.state.datas}
        isSmooth={false}
        hasDataZoom={false}
        dataZoomInner={false}
      />
    );
  }
}
