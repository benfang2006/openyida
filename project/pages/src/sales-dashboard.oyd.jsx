// ============================================================
// 销售经营数据看板 - 自定义页面
// 演示数据版本：销售额 / 订单量 / 30 天趋势 / 渠道分布 / Top 商品
// TODO: 接入真实报表 REPORT-xxx 或表单 FORM-xxx
// ============================================================

var ECHARTS_CDN = 'https://g.alicdn.com/code/lib/echarts/5.4.3/echarts.min.js';

var THEME = {
  bgPage: '#0b1224',
  bgGradient: 'radial-gradient(circle at 20% 0%, #1b2a55 0%, #0b1224 55%, #060a1c 100%)',
  cardBg: 'rgba(20, 32, 64, 0.78)',
  cardBorder: 'rgba(123, 156, 255, 0.18)',
  textPrimary: '#e6ecff',
  textSecondary: '#9bb0e0',
  textMuted: '#6e7fa8',
  accent: '#5C72FF',
  accent2: '#22d3ee',
  good: '#22c55e',
  warn: '#f59e0b',
  danger: '#ef4444'
};

// ============================================================
// 状态管理
// ============================================================

var _customState = {
  loading: true,
  scriptReady: false,
  range: '30d',           // 7d / 30d / 90d
  channel: 'all',         // all / online / offline / dealer
  kpi: {
    salesTotal: 0,
    salesGrowth: 0,
    orderCount: 0,
    orderGrowth: 0,
    avgOrderValue: 0,
    avgGrowth: 0,
    activeCustomers: 0,
    customerGrowth: 0
  },
  trend: { labels: [], sales: [], orders: [] },
  channelBreakdown: [],
  topProducts: [],
  recentOrders: [],
  charts: {}
};

export function getCustomState(key) {
  if (key) return _customState[key];
  return _customState;
}

export function setCustomState(newState) {
  Object.keys(newState).forEach((key) => {
    _customState[key] = newState[key];
  });
  this.forceUpdate();
}

export function forceUpdate() {
  this.setState({ timestamp: new Date().getTime() });
}

// ============================================================
// 生命周期
// ============================================================

export function didMount() {
  var self = this;
  this.utils.loadScript(ECHARTS_CDN)
    .then(() => {
      _customState.scriptReady = true;
      self.loadAllData();
    })
    .catch((err) => {
      console.error('ECharts 加载失败', err);
      _customState.scriptReady = false;
      self.loadAllData();
    });
}

export function didUnmount() {
  Object.keys(_customState.charts).forEach((key) => {
    var inst = _customState.charts[key];
    if (inst && inst.dispose) {
      try { inst.dispose(); } catch (e) {}
    }
  });
  _customState.charts = {};
}

// ============================================================
// 数据加载（演示数据，可后续替换为 getDataAsync.json）
// ============================================================

export function loadAllData() {
  var self = this;
  _customState.loading = true;
  this.forceUpdate();

  setTimeout(() => {
    var data = self.buildMockData(_customState.range, _customState.channel);
    _customState.kpi = data.kpi;
    _customState.trend = data.trend;
    _customState.channelBreakdown = data.channels;
    _customState.topProducts = data.topProducts;
    _customState.recentOrders = data.recentOrders;
    _customState.loading = false;
    self.forceUpdate();
    setTimeout(() => { self.renderCharts(); }, 80);
  }, 200);
}

export function buildMockData(range, channel) {
  var days = range === '7d' ? 7 : (range === '90d' ? 90 : 30);
  var seed = (range === '7d' ? 1.1 : range === '90d' ? 0.9 : 1.0)
           * (channel === 'all' ? 1 : channel === 'online' ? 0.55 : channel === 'offline' ? 0.3 : 0.15);

  var labels = [];
  var sales = [];
  var orders = [];
  var now = Date.now();
  var totalSales = 0;
  var totalOrders = 0;
  for (var i = days - 1; i >= 0; i--) {
    var d = new Date(now - i * 24 * 3600 * 1000);
    var label = (d.getMonth() + 1) + '/' + d.getDate();
    labels.push(label);
    var weekday = d.getDay();
    var weekFactor = (weekday === 0 || weekday === 6) ? 1.35 : 1.0;
    var wave = Math.sin(i / 4.0) * 0.18 + 1.0;
    var randomNoise = 0.85 + Math.random() * 0.3;
    var daySales = Math.round(85000 * seed * weekFactor * wave * randomNoise);
    var dayOrders = Math.round(daySales / (320 + Math.random() * 80));
    sales.push(daySales);
    orders.push(dayOrders);
    totalSales += daySales;
    totalOrders += dayOrders;
  }

  var growthBase = days >= 30 ? 0.12 : 0.08;
  var kpi = {
    salesTotal: totalSales,
    salesGrowth: Math.round((growthBase + Math.random() * 0.08) * 1000) / 10,
    orderCount: totalOrders,
    orderGrowth: Math.round((growthBase - 0.02 + Math.random() * 0.06) * 1000) / 10,
    avgOrderValue: Math.round(totalSales / Math.max(totalOrders, 1)),
    avgGrowth: Math.round((0.03 + Math.random() * 0.05) * 1000) / 10,
    activeCustomers: Math.round(totalOrders * 0.62),
    customerGrowth: Math.round((0.05 + Math.random() * 0.06) * 1000) / 10
  };

  var channels = [
    { name: '线上商城', value: Math.round(totalSales * 0.46), color: '#5C72FF' },
    { name: '线下门店', value: Math.round(totalSales * 0.27), color: '#22d3ee' },
    { name: '经销渠道', value: Math.round(totalSales * 0.18), color: '#a855f7' },
    { name: 'KA 大客户', value: Math.round(totalSales * 0.09), color: '#f59e0b' }
  ];

  var productNames = ['臻享智能音箱', '极光降噪耳机', '星辰移动电源', '云河智能手表', '量子蓝牙键盘', '微光便携投影', '极速无线充电板'];
  var topProducts = productNames.slice(0, 6).map((name, idx) => {
    var amt = Math.round(totalSales * (0.18 - idx * 0.022) * (0.85 + Math.random() * 0.3));
    var qty = Math.round(amt / (320 + idx * 40));
    return {
      name,
      amount: amt,
      qty,
      growth: Math.round((0.18 - idx * 0.04 + Math.random() * 0.06) * 1000) / 10
    };
  }).sort((a, b) => b.amount - a.amount);

  var customers = ['星海科技', '云川集团', '蓝海智造', '远望电子', '北辰商贸', '风行物流', '极地科创'];
  var statuses = [
    { text: '已支付', color: THEME.good },
    { text: '已发货', color: THEME.accent2 },
    { text: '待处理', color: THEME.warn }
  ];
  var recentOrders = [];
  for (var k = 0; k < 8; k++) {
    var cust = customers[k % customers.length];
    var prod = productNames[k % productNames.length];
    var st = statuses[k % statuses.length];
    var amount = Math.round(800 + Math.random() * 18000);
    var ts = now - k * 1700000;
    recentOrders.push({
      id: 'SO' + (20260000 + (1234 + k * 13)),
      customer: cust,
      product: prod,
      amount,
      status: st.text,
      statusColor: st.color,
      time: formatTime(ts)
    });
  }

  return { kpi, trend: { labels, sales, orders }, channels, topProducts, recentOrders };
}

function formatTime(ts) {
  var d = new Date(ts);
  var pad = (n) => (n < 10 ? '0' + n : '' + n);
  return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function formatMoney(v) {
  if (v >= 100000000) return (v / 100000000).toFixed(2) + ' 亿';
  if (v >= 10000) return (v / 10000).toFixed(1) + ' 万';
  return String(v);
}

function formatNumber(v) {
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============================================================
// 图表渲染
// ============================================================

export function renderCharts() {
  if (!window.echarts) return;
  this.renderTrendChart();
  this.renderChannelChart();
}

export function renderTrendChart() {
  var el = document.getElementById('chart-trend');
  if (!el) return;
  var inst = _customState.charts.trend;
  if (!inst) {
    inst = window.echarts.init(el, null, { renderer: 'canvas' });
    _customState.charts.trend = inst;
  }
  var labels = _customState.trend.labels;
  var sales = _customState.trend.sales;
  var orders = _customState.trend.orders;

  var option = {
    backgroundColor: 'transparent',
    grid: { left: 56, right: 56, top: 50, bottom: 36 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20, 32, 64, 0.92)',
      borderColor: 'rgba(123, 156, 255, 0.4)',
      textStyle: { color: '#e6ecff' }
    },
    legend: {
      data: ['销售额', '订单量'],
      top: 8,
      textStyle: { color: THEME.textSecondary }
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(123, 156, 255, 0.25)' } },
      axisLabel: { color: THEME.textMuted, fontSize: 11 }
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额 (¥)',
        nameTextStyle: { color: THEME.textMuted },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(123, 156, 255, 0.12)' } },
        axisLabel: { color: THEME.textMuted, formatter: (v) => formatMoney(v) }
      },
      {
        type: 'value',
        name: '订单量',
        nameTextStyle: { color: THEME.textMuted },
        position: 'right',
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: THEME.textMuted }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        data: sales,
        lineStyle: { color: THEME.accent, width: 2.5 },
        itemStyle: { color: THEME.accent },
        areaStyle: {
          color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(92, 114, 255, 0.45)' },
            { offset: 1, color: 'rgba(92, 114, 255, 0.0)' }
          ])
        }
      },
      {
        name: '订单量',
        type: 'bar',
        yAxisIndex: 1,
        barWidth: '40%',
        data: orders,
        itemStyle: {
          color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34, 211, 238, 0.85)' },
            { offset: 1, color: 'rgba(34, 211, 238, 0.15)' }
          ])
        }
      }
    ]
  };
  inst.setOption(option, true);
}

export function renderChannelChart() {
  var el = document.getElementById('chart-channel');
  if (!el) return;
  var inst = _customState.charts.channel;
  if (!inst) {
    inst = window.echarts.init(el, null, { renderer: 'canvas' });
    _customState.charts.channel = inst;
  }
  var data = _customState.channelBreakdown.map((c) => ({
    name: c.name,
    value: c.value,
    itemStyle: { color: c.color }
  }));
  var option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(20, 32, 64, 0.92)',
      borderColor: 'rgba(123, 156, 255, 0.4)',
      textStyle: { color: '#e6ecff' },
      formatter: (p) => p.name + '<br/>金额: ¥ ' + formatMoney(p.value) + '<br/>占比: ' + p.percent + '%'
    },
    legend: {
      orient: 'vertical',
      right: 8,
      top: 'middle',
      textStyle: { color: THEME.textSecondary, fontSize: 12 },
      formatter: (name) => name
    },
    series: [
      {
        name: '渠道分布',
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        data
      }
    ]
  };
  inst.setOption(option, true);
}

// ============================================================
// 交互
// ============================================================

export function changeRange(range) {
  if (_customState.range === range) return;
  _customState.range = range;
  this.loadAllData();
}

export function changeChannel(channel) {
  if (_customState.channel === channel) return;
  _customState.channel = channel;
  this.loadAllData();
}

export function refreshAll() {
  this.utils.toast({ title: '已刷新最新数据', type: 'success' });
  this.loadAllData();
}

// ============================================================
// 渲染
// ============================================================

export function renderJsx() {
  var self = this;
  var isMobile = this.utils.isMobile();
  var kpi = _customState.kpi;
  var loading = _customState.loading;

  var styles = {
    page: {
      minHeight: '100vh',
      padding: isMobile ? '16px' : '24px',
      background: THEME.bgGradient,
      color: THEME.textPrimary,
      fontFamily: 'PingFangSC, "Helvetica Neue", Arial, sans-serif',
      boxSizing: 'border-box'
    },
    header: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: '12px',
      marginBottom: '20px'
    },
    title: {
      fontSize: isMobile ? '20px' : '26px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      margin: 0
    },
    subtitle: {
      fontSize: '13px',
      color: THEME.textMuted,
      marginTop: '4px'
    },
    toolbar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      alignItems: 'center'
    },
    segment: {
      display: 'inline-flex',
      background: 'rgba(20, 32, 64, 0.6)',
      border: '1px solid ' + THEME.cardBorder,
      borderRadius: '8px',
      padding: '2px',
      overflow: 'hidden'
    },
    segmentBtn: (active) => ({
      padding: '6px 14px',
      fontSize: '13px',
      border: 'none',
      background: active ? THEME.accent : 'transparent',
      color: active ? '#fff' : THEME.textSecondary,
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }),
    refreshBtn: {
      padding: '7px 16px',
      fontSize: '13px',
      border: '1px solid ' + THEME.accent,
      borderRadius: '8px',
      background: 'rgba(92, 114, 255, 0.12)',
      color: THEME.textPrimary,
      cursor: 'pointer'
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: isMobile ? '10px' : '16px',
      marginBottom: '20px'
    },
    kpiCard: (accent) => ({
      background: THEME.cardBg,
      border: '1px solid ' + THEME.cardBorder,
      borderRadius: '14px',
      padding: isMobile ? '14px' : '18px 20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 6px 18px rgba(8, 14, 36, 0.35)',
      borderTop: '2px solid ' + accent
    }),
    kpiLabel: { fontSize: '13px', color: THEME.textSecondary, marginBottom: '8px' },
    kpiValue: { fontSize: isMobile ? '22px' : '28px', fontWeight: 700, letterSpacing: '0.5px' },
    kpiGrowth: (up) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: '8px',
      padding: '2px 8px',
      borderRadius: '999px',
      background: up ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
      color: up ? THEME.good : THEME.danger,
      fontSize: '12px'
    }),
    chartRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
      gap: isMobile ? '12px' : '16px',
      marginBottom: '20px'
    },
    card: {
      background: THEME.cardBg,
      border: '1px solid ' + THEME.cardBorder,
      borderRadius: '14px',
      padding: isMobile ? '14px' : '18px 20px',
      boxShadow: '0 6px 18px rgba(8, 14, 36, 0.35)'
    },
    cardTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '15px',
      fontWeight: 600,
      marginBottom: '12px',
      color: THEME.textPrimary
    },
    cardTag: {
      fontSize: '11px',
      color: THEME.textMuted,
      background: 'rgba(123, 156, 255, 0.12)',
      border: '1px solid ' + THEME.cardBorder,
      borderRadius: '999px',
      padding: '2px 10px'
    },
    chartBox: { width: '100%', height: isMobile ? '260px' : '320px' },
    chartBoxSm: { width: '100%', height: isMobile ? '240px' : '320px' },
    bottomRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '12px' : '16px'
    },
    listRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid rgba(123, 156, 255, 0.08)',
      fontSize: '13px'
    },
    listRowLast: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      fontSize: '13px'
    },
    rank: (idx) => ({
      width: '22px',
      height: '22px',
      lineHeight: '22px',
      textAlign: 'center',
      borderRadius: '6px',
      background: idx < 3 ? THEME.accent : 'rgba(123, 156, 255, 0.18)',
      color: idx < 3 ? '#fff' : THEME.textSecondary,
      fontSize: '12px',
      marginRight: '10px',
      display: 'inline-block'
    }),
    statusPill: (color) => ({
      display: 'inline-block',
      padding: '2px 10px',
      fontSize: '11px',
      borderRadius: '999px',
      background: color + '22',
      color,
      border: '1px solid ' + color + '55'
    }),
    footer: {
      marginTop: '18px',
      textAlign: 'center',
      fontSize: '12px',
      color: THEME.textMuted
    },
    loadingMask: {
      padding: '40px',
      textAlign: 'center',
      color: THEME.textSecondary,
      fontSize: '14px'
    },
    demoBadge: {
      display: 'inline-block',
      marginLeft: '10px',
      padding: '2px 10px',
      fontSize: '11px',
      color: THEME.warn,
      background: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      borderRadius: '999px'
    }
  };

  var ranges = [
    { key: '7d', label: '近 7 天' },
    { key: '30d', label: '近 30 天' },
    { key: '90d', label: '近 90 天' }
  ];
  var channels = [
    { key: 'all', label: '全部渠道' },
    { key: 'online', label: '线上' },
    { key: 'offline', label: '线下' },
    { key: 'dealer', label: '经销' }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            销售经营数据看板
            <span style={styles.demoBadge}>演示数据</span>
          </h1>
          <div style={styles.subtitle}>实时洞察销售额、订单量与增长趋势</div>
        </div>
        <div style={styles.toolbar}>
          <div style={styles.segment}>
            {ranges.map((r) => (
              <button
                key={r.key}
                style={styles.segmentBtn(_customState.range === r.key)}
                onClick={(e) => { self.changeRange(r.key); }}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div style={styles.segment}>
            {channels.map((c) => (
              <button
                key={c.key}
                style={styles.segmentBtn(_customState.channel === c.key)}
                onClick={(e) => { self.changeChannel(c.key); }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <button style={styles.refreshBtn} onClick={(e) => { self.refreshAll(); }}>
            刷新
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingMask}>正在加载数据...</div>
      ) : (
        <div>
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard(THEME.accent)}>
              <div style={styles.kpiLabel}>销售总额 (¥)</div>
              <div style={styles.kpiValue}>{formatMoney(kpi.salesTotal)}</div>
              <div style={styles.kpiGrowth(kpi.salesGrowth >= 0)}>
                {(kpi.salesGrowth >= 0 ? '▲ ' : '▼ ') + Math.abs(kpi.salesGrowth) + '%'}
                <span style={{ color: THEME.textMuted, marginLeft: '4px' }}>环比</span>
              </div>
            </div>
            <div style={styles.kpiCard(THEME.accent2)}>
              <div style={styles.kpiLabel}>订单量</div>
              <div style={styles.kpiValue}>{formatNumber(kpi.orderCount)}</div>
              <div style={styles.kpiGrowth(kpi.orderGrowth >= 0)}>
                {(kpi.orderGrowth >= 0 ? '▲ ' : '▼ ') + Math.abs(kpi.orderGrowth) + '%'}
                <span style={{ color: THEME.textMuted, marginLeft: '4px' }}>环比</span>
              </div>
            </div>
            <div style={styles.kpiCard('#a855f7')}>
              <div style={styles.kpiLabel}>客单价 (¥)</div>
              <div style={styles.kpiValue}>{formatNumber(kpi.avgOrderValue)}</div>
              <div style={styles.kpiGrowth(kpi.avgGrowth >= 0)}>
                {(kpi.avgGrowth >= 0 ? '▲ ' : '▼ ') + Math.abs(kpi.avgGrowth) + '%'}
                <span style={{ color: THEME.textMuted, marginLeft: '4px' }}>环比</span>
              </div>
            </div>
            <div style={styles.kpiCard(THEME.warn)}>
              <div style={styles.kpiLabel}>活跃客户</div>
              <div style={styles.kpiValue}>{formatNumber(kpi.activeCustomers)}</div>
              <div style={styles.kpiGrowth(kpi.customerGrowth >= 0)}>
                {(kpi.customerGrowth >= 0 ? '▲ ' : '▼ ') + Math.abs(kpi.customerGrowth) + '%'}
                <span style={{ color: THEME.textMuted, marginLeft: '4px' }}>环比</span>
              </div>
            </div>
          </div>

          <div style={styles.chartRow}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>销售额 & 订单量趋势</span>
                <span style={styles.cardTag}>{_customState.range === '7d' ? '近 7 天' : _customState.range === '90d' ? '近 90 天' : '近 30 天'}</span>
              </div>
              <div id="chart-trend" style={styles.chartBox}></div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>渠道销售分布</span>
                <span style={styles.cardTag}>金额占比</span>
              </div>
              <div id="chart-channel" style={styles.chartBoxSm}></div>
            </div>
          </div>

          <div style={styles.bottomRow}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>Top 商品销售排行</span>
                <span style={styles.cardTag}>按销售额</span>
              </div>
              <div>
                {_customState.topProducts.map((p, idx) => {
                  var lastRow = idx === _customState.topProducts.length - 1;
                  return (
                    <div key={p.name} style={lastRow ? styles.listRowLast : styles.listRow}>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <span style={styles.rank(idx)}>{idx + 1}</span>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <div style={{ color: THEME.textPrimary }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: THEME.textMuted, marginTop: '2px' }}>销量 {formatNumber(p.qty)} 件</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: THEME.textPrimary, fontWeight: 600 }}>¥ {formatMoney(p.amount)}</div>
                        <div style={{ fontSize: '11px', color: p.growth >= 0 ? THEME.good : THEME.danger, marginTop: '2px' }}>
                          {(p.growth >= 0 ? '▲ ' : '▼ ') + Math.abs(p.growth) + '%'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>最近订单动态</span>
                <span style={styles.cardTag}>最新 8 笔</span>
              </div>
              <div>
                {_customState.recentOrders.map((o, idx) => {
                  var lastRow = idx === _customState.recentOrders.length - 1;
                  return (
                    <div key={o.id} style={lastRow ? styles.listRowLast : styles.listRow}>
                      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ color: THEME.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {o.customer} · {o.product}
                        </div>
                        <div style={{ fontSize: '11px', color: THEME.textMuted, marginTop: '2px' }}>
                          {o.id} · {o.time}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                        <div style={{ color: THEME.textPrimary, fontWeight: 600 }}>¥ {formatNumber(o.amount)}</div>
                        <div style={{ marginTop: '4px' }}>
                          <span style={styles.statusPill(o.statusColor)}>{o.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            数据每次刷新动态生成 · 当前展示为演示数据，可接入真实表单 / 报表数据源
          </div>
        </div>
      )}

      <div style={{ display: 'none' }}>{this.state && this.state.timestamp}</div>
    </div>
  );
}
