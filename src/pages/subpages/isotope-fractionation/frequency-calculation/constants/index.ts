export const CalculationServies = [
    {
        label: '同位素分馏',
        value: 'isotope-fractionation',
        children: [
            {
                label: '激化频率',
                value: 'E-field'
            },
            {
                label: '声子频率',
                value: 'phonon'
            },
        ],
    },
    {
        label: '力常数',
        value: 'force-constant',
    },
    {
        label: '红外光谱',
        value: 'ir',
        disabled: true
    },
    {
        label: '拉曼光谱',
        value: 'raman',
        disabled: true
    },
];