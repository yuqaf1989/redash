import { each, map } from 'lodash';
import React, { useMemo, useCallback } from 'react';
import Table from 'antd/lib/table';
import ColorPicker from '@/components/ColorPicker';
import { EditorPropTypes } from '@/visualizations';
import ColorPalette from '@/visualizations/ColorPalette';
import getChartData from '../getChartData';

function getUniqueValues(chartData) {
  const uniqueValuesNames = new Set();
  each(chartData, (series) => {
    each(series.data, (row) => {
      uniqueValuesNames.add(row.x);
    });
  });
  return [...uniqueValuesNames];
}

export default function PieColorsSettings({ options, data, onOptionsChange }) {
  const colors = useMemo(() => ({
    Automatic: null,
    ...ColorPalette,
  }), []);

  const series = useMemo(() => map(
    getUniqueValues(getChartData(data.rows, options)),
    value => ({ key: value, color: (options.valuesOptions[value] || {}).color || null }),
  ), [options, data]);

  const updateValuesOption = useCallback((key, prop, value) => {
    onOptionsChange({
      valuesOptions: {
        [key]: {
          [prop]: value,
        },
      },
    });
  }, [onOptionsChange]);

  const columns = [
    {
      title: 'Values',
      dataIndex: 'key',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      width: '1%',
      render: (unused, item) => (
        <ColorPicker
          interactive
          presetColors={colors}
          placement="topRight"
          color={item.color}
          onChange={value => updateValuesOption(item.key, 'color', value)}
        />
      ),
    },
  ];

  return (
    <Table
      showHeader={false}
      dataSource={series}
      columns={columns}
      pagination={false}
    />
  );
}

PieColorsSettings.propTypes = EditorPropTypes;