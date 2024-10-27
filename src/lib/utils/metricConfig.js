// lib/utils/metricsConfig.js

const generateRange = (start, end) => {
    const range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
};

export const selectedMetricIds = [
    ...generateRange(399, 428),
    295, 296, 297, 298,
    173, 174, 175, 176,
    153, 154, 155, 156,
    3, 4, 5, 18, 31, 36, 50, 63
];
