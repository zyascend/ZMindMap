//数据
const dataset = {
  name: "中国",
  children: [
    {
      name: "浙江浙江浙江\n浙江浙江浙江",
      children: [
        { name: "杭州", value: 100 },
        { name: "宁波", value: 100 },
        { name: "温州温州温州温州温州\n温州温州温州温州温州温州", value: 100 },
        { name: "绍兴绍兴绍兴绍兴绍兴绍兴\n绍兴绍兴绍兴绍兴绍兴\n绍兴绍兴绍兴", value: 100 }
      ]
    },
    {
      name: "浙江浙江浙江",
      children: [
        {
          name: "桂林桂林桂林桂林桂\n林桂林桂林",
          children: [
            { name: "秀峰区", value: 100 },
            { name: "叠彩区", value: 100 },
            { name: "象山区", value: 100 },
            { name: "七星区", value: 100 }
          ]
        },
        { name: "南宁", value: 100 },
        { name: "柳州", value: 100 },
        { name: "防城港", value: 100 }
      ]
    },
    {
      name: "黑龙江",
      children: [
        { name: "哈尔滨", value: 100 },
        { name: "齐齐哈尔", value: 100 },
        { name: "牡丹江", value: 100 },
        { name: "大庆", value: 100 }
      ]
    },
    {
      name: "新疆",
      children:
        [
          { name: "乌鲁木齐" },
          { name: "克拉玛依" },
          { name: "吐鲁番" },
          { name: "哈密" }
        ]
    }
  ]
};