import * as React from "react";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { Color } from "csstype";
// import { fromJS } from "immutable";
interface Item {
  title: string;
  unit: string;
  data: Array<Array<string>>;
}
interface Props {
  datas: Item[]; //要展示的数据
  componentStyle?: React.CSSProperties; //echarts组件的样式
  isSmooth?: boolean; //是否采用线条平滑的方式
  hasDataZoom?: boolean; //是否需要缩放
  dataZoomInner?: boolean; //缩放区域是否内置
  lineColors?: Color[]; //线条的颜色
  averageLineColors?: Color[]; //平均值的线条颜色
  areaStartColors?: Color[]; //区域开始的颜色
  areaEndColors?: Color[]; //区域结束的颜色
  areaOpacity?: number; //背景区域的透明度
  dataStart?: number; //数据展示区域的开始点
  dataEnd?: number; //数据展示区域的结束点
}

export default class ChartComponent extends React.Component<Props> {
  static defaultProps = {
    componentStyle: {
      height: "500px",
      width: "100%",
      background: "#063247",
      opacity: 0.9
    },
    isSmooth: false,
    hasDataZoom: false,
    dataZoomInner: false,
    lineColors: ["#00F9E4", "#E0F900", "#DA70D6"],
    averageLineColors: ["#00F9E4", "#E0F900", "#DA70D6"],
    areaStartColors: ["#087687", "#FFFE00", "#DA70D6"],
    areaEndColors: ["#063145", "#063145", "#D8BFD8"],
    areaOpacity: 0.46,
    dataStart: 0,
    dataEnd: 23
  };

  getOption() {
    return {
      grid: {
        //组件距离容器左右间距的控制
        left: 50,
        right: 25,
        bottom: 20
      },
      legend: {
        top: 10,
        textStyle: {
          color: "#FFFFFF",
          fontSize: 14
        },
        data: this.parseDatas().dataNames
      },
      tooltip: {
        trigger: "item"
        //formatter: `{b}: {c} ${this.parseDatas().units[0]}`
      },
      dataZoom: this.props.hasDataZoom && {
        type: this.props.dataZoomInner ? "inside" : "slider",
        show: true,
        start: this.props.dataStart,
        end: this.props.dataEnd
      },
      xAxis: this.getXAxis(),
      yAxis: this.getYAxis(),
      series: this.setSeries().series
    };
  }

  //对x轴坐标进行设置
  getXAxis() {
    return {
      type: "category",
      data: this.parseDatas().xAxisDatas,
      boundaryGap: false, //坐标轴两边是否留有空白
      splitLine: { show: false },
      position: "top",
      axisTick: {
        //坐标轴上的刻度（不显示）
        show: false
      },
      axisPointer: {
        //控制tooltip下面的竖线
        lineStyle: {
          type: "solid",
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#07D9F6" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#063348" // 100% 处的颜色
              }
            ]
          },
          opacity: 0.5,
          width: 2
        },
        handle: {
          show: true,
          size: 0
        }
      },
      axisLabel: { color: "#FFFFFF", fontSize: 10 }, //坐标文本颜色
      axisLine: {
        //控制轴线的显隐
        show: false
      }
    };
  }

  getYAxis() {
    return {
      type: "value",
      boundaryGap: ["0%", "0%"],
      axisTick: {
        //坐标轴上的刻度（不显示）
        show: false
      },
      splitLine: {
        show: false //默认不显示y轴的刻度尺的轴线
      },
      axisLabel: {
        margin: 20,
        color: "#FFFFFF",
        fontSize: 10
      },
      axisLine: {
        show: false
      }
    };
  }

  //解析数据
  parseDatas() {
    const { datas } = this.props;
    let dataNames: string[] = []; //标题名
    let unit: string = ""; //单位
    let data: string[] = []; //用于存储历史数据或者实时数据或者其他的数据
    let xAxisDatas: string[] = [];
    const yAxisDatas: Array<Array<string>> = [];
    datas.map((item: Item) => {
      data = []; //由于datas的数据结构问题，所以对datas进行map时，需要先将data和xAxisDatas置空
      if (item.data.length > 0) xAxisDatas = [];
      unit = item.unit;
      item.data.map(item => {
        xAxisDatas.push(item[0]); //item[0]为时间
        data.push(item[1]); //item[1]为对应的值
      });
      yAxisDatas.push(data);
      dataNames.push(item.title);
    });
    return {
      xAxisDatas,
      yAxisDatas,
      dataNames,
      unit
    };
  }

  //设置series
  setSeries() {
    let yAxisDatas = this.parseDatas().yAxisDatas;
    let series = yAxisDatas.map((item, index) => {
      return {
        name: this.parseDatas().dataNames[index],
        type: "line",
        symbol: "none", //去掉拐点的样式
        itemStyle: {
          //设置线条的样式
          normal: {
            color: this.props.lineColors && this.props.lineColors[index]
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic["LinearGradient"](0, 0, 0, 1, [
              {
                offset: 0,
                color:
                  this.props.areaStartColors &&
                  this.props.areaStartColors[index]
              },
              {
                offset: 1,
                color:
                  this.props.areaEndColors && this.props.areaEndColors[index]
              }
            ]),
            opacity: this.props.areaOpacity
          }
        },
        smooth: this.props.isSmooth, //线条使用折线，如用平滑的，则将值改为true
        data: item,
        markLine: {
          symbol: "none", //去掉均值的两端图标
          label: {
            normal: {
              position: "middle" //文本位置
            }
          },
          data: [{ type: "average", name: "平均值" }],
          lineStyle: {
            normal: {
              color:
                this.props.averageLineColors &&
                this.props.averageLineColors[index],
              type: "solid",
              opacity: this.props.areaOpacity
            }
          }
        }
      };
    });
    return {
      series
    };
  }

  public render() {
    return (
      <div>
        <ReactEcharts
          option={this.getOption()}
          style={this.props.componentStyle}
        />
      </div>
    );
  }
}
