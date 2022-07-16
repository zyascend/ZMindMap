const productionHostName = 'map.kimjisoo.cn'
// sentry相关配置
export const sentryCfg = {
  tracingOrigins: [productionHostName, 'localhost'],
  dsn: 'https://286635702ecc437687d97885795599be@o1237174.ingest.sentry.io/6387522',
  tracesSampleRate: 1.0
}
// 网站默认配置
export const websiteCfg = {
  defaultMapStyle: {
    colorId: 'COLOR-Florid-2',
    mapStyleId: 'MAPID-LogicTree'
  }
}
