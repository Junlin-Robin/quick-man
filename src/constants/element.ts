import { ElementPictureUrl } from './element-picture-url';

export enum ISOTOPE_TYPE {
    STABLE = 'Stable',
    RADIOACTIVE = 'Radioactive',
}
export const Elements = [
    {
        name: 'H（氢 / Hydrogen）',
        key: 'H',
        index: 1,
        overview: {
            picture_url: ElementPictureUrl.H,
            /**英文名字 */
            EN_name: 'Hydrogen',
            /**中文名字 */
            ZhCN_name: '氢',
            /**想对质量 */
            relative_mass: '1.00794',
            /**密度 */
            density: '',
        },
        /**特性 */
        properties: {
            /**同位素性质 */
            isotope: [{
                mass: '1.007825',
                abundance: '0.999844',
                type: ISOTOPE_TYPE.STABLE,
            }, {
                mass: '2.014102',
                abundance: '0.000156',
                type: ISOTOPE_TYPE.STABLE,
            }, {
                mass: '3.016049',
                abundance: '0.00004',
                type: ISOTOPE_TYPE.STABLE
            }],
        },
    },
    {
        name: 'He（氦 / Helium）',
        key: 'He',
        index: 2,
        overview: {
            picture_url: ElementPictureUrl.He,
            /**英文名字 */
            EN_name: 'Helium',
            /**中文名字 */
            ZhCN_name: '氦',
            relative_mass: '4.0026',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '3.016029',
                    abundance: '0.00000137',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '4.002606',
                    abundance: '0.99999863',
                    type: ISOTOPE_TYPE.STABLE,
                }
            ],
        },
    },
    {
        name: 'Li（锂 / Lithium）',
        key: 'Li',
        index: 3,
        overview: {
            picture_url: ElementPictureUrl.Li,
            /**英文名字 */
            EN_name: 'Lithium',
            /**中文名字 */
            ZhCN_name: '锂',
            relative_mass: '6.9675',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '6.015122',
                    abundance: '0.0759',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '7.016004',
                    abundance: '0.9241',
                    type: ISOTOPE_TYPE.STABLE,
                }
            ]
        },
    },
    {
        name: 'Be（铍 / Beryllium）',
        key: 'Be',
        index: 4,
        overview: {
            picture_url: ElementPictureUrl.Be,
            /**英文名字 */
            EN_name: 'Beryllium',
            /**中文名字 */
            ZhCN_name: '铍',
            relative_mass: '9.0122',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '7.016929',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '9.012182',
                    abundance: '1',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '10.013533',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'B（硼 / Boron）',
        key: 'B',
        index: 5,
        overview: {
            picture_url: ElementPictureUrl.B,
            /**英文名字 */
            EN_name: 'Boron',
            /**中文名字 */
            ZhCN_name: '硼',
            relative_mass: '10.8135',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '10.012937',
                    abundance: '0.199',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '11.009306',
                    abundance: '0.801',
                    type: ISOTOPE_TYPE.STABLE,
                }
            ],
        },
    },
    {
        name: 'C（碳 / Carbon）',
        key: 'C',
        index: 6,
        overview: {
            picture_url: ElementPictureUrl.C,
            /**英文名字 */
            EN_name: 'Carbon',
            /**中文名字 */
            ZhCN_name: '碳',
            relative_mass: '12.0106',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '11.011433',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '12.000000',
                    abundance: '0.989',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '13.00335483',
                    abundance: '0.011',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '14.003241',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'N（氮 / Nitrogen）',
        key: 'N',
        index: 7,
        overview: {
            picture_url: ElementPictureUrl.N,
            /**英文名字 */
            EN_name: 'Nitrogen',
            /**中文名字 */
            ZhCN_name: '氮',
            relative_mass: '14.0069',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '13.005738',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '14.003074005',
                    abundance: '0.9963',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '15.000108898',
                    abundance: '0.0037',
                    type: ISOTOPE_TYPE.STABLE,
                }
            ],
        },
    },
    {
        name: 'O（氧 / Oxygen）',
        key: 'O',
        index: 8,
        overview: {
            picture_url: ElementPictureUrl.O,
            /**英文名字 */
            EN_name: 'Oxygen',
            /**中文名字 */
            ZhCN_name: '氧',
            relative_mass: '15.9994',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '15.003065',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '15.99491462',
                    abundance: '0.99762',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '16.999131',
                    abundance: '0.00038',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '17.99916',
                    abundance: '0.002',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '19.003579',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'F（氟 / Fluorine）',
        key: 'F',
        index: 9,
        overview: {
            picture_url: ElementPictureUrl.F,
            /**英文名字 */
            EN_name: 'Fluorine',
            /**中文名字 */
            ZhCN_name: '氟',
            relative_mass: '18.9984',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '18.000937',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '18.9984032',
                    abundance: '1',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '19.999981',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ]
        },
    },
    {
        name: 'Ne（氖 / Neon）',
        key: 'Ne',
        index: 10,
        overview: {
            picture_url: ElementPictureUrl.Ne,
            /**英文名字 */
            EN_name: 'Neon',
            /**中文名字 */
            ZhCN_name: '氖',
            relative_mass: '20.1800',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '19.99244',
                    abundance: '0.9048',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '20.993847',
                    abundance: '0.0027',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '21.991386',
                    abundance: '0.0925',
                    type: ISOTOPE_TYPE.STABLE,
                }
            ],
        },
    },
    {
        name: 'Na（钠 / Sodium）',
        key: 'Na',
        index: 11,
        overview: {
            picture_url: ElementPictureUrl.Na,
            /**英文名字 */
            EN_name: 'Sodium',
            /**中文名字 */
            ZhCN_name: '钠',
            relative_mass: '22.9898',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '21.994436',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '22.98977',
                    abundance: '1',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '23.990963',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'Mg（镁 / Magnesium）',
        key: 'Mg',
        index: 12,
        overview: {
            picture_url: ElementPictureUrl.Mg,
            /**英文名字 */
            EN_name: 'Magnesium',
            /**中文名字 */
            ZhCN_name: '镁',
            relative_mass: '24.3051',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '23.985042',
                    abundance: '0.7899',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '24.985837',
                    abundance: '0.1',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '25.982593',
                    abundance: '0.1101',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '26.984341',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '27.983876',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'Al（铝 / Aluminum）',
        key: 'Al',
        index: 13,
        overview: {
            picture_url: ElementPictureUrl.Al,
            /**英文名字 */
            EN_name: 'Aluminum',
            /**中文名字 */
            ZhCN_name: '铝',
            relative_mass: '26.9815',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '25.986891',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '26.981538',
                    abundance: '1',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '27.98191',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '28.980445',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'Si（硅 / Silicon）',
        key: 'Si',
        index: 14,
        overview: {
            picture_url: ElementPictureUrl.Si,
            /**英文名字 */
            EN_name: 'Silicon',
            /**中文名字 */
            ZhCN_name: '硅',
            relative_mass: '28.0850',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '27.976926',
                    abundance: '0.9223',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '28.976497',
                    abundance: '0.0467',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '29.97377',
                    abundance: '0.031',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '30.975363',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '31.974148',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'P（磷 / Phosphorus）',
        key: 'P',
        index: 15,
        overview: {
            picture_url: ElementPictureUrl.P,
            /**英文名字 */
            EN_name: 'Phosphorus',
            /**中文名字 */
            ZhCN_name: '磷',
            relative_mass: '30.9738',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '30.973761',
                    abundance: '1',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '31.973907',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '32.971725',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'S（硫 / Sulfur）',
        key: 'S',
        index: 16,
        overview: {
            picture_url: ElementPictureUrl.S,
            /**英文名字 */
            EN_name: 'Sulfur',
            /**中文名字 */
            ZhCN_name: '硫',
            relative_mass: '32.0648',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '31.97207',
                    abundance: '0.9502',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '32.971458',
                    abundance: '0.0075',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '33.967866',
                    abundance: '0.0421',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '34.969032',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '35.96708',
                    abundance: '0.0002',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '36.971125',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '37.971163',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'Cl（氯 / Chlorine）',
        key: 'Cl',
        index: 17,
        overview: {
            picture_url: ElementPictureUrl.Cl,
            /**英文名字 */
            EN_name: 'Chlorine',
            /**中文名字 */
            ZhCN_name: '氯',
            relative_mass: '35.4521',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '34.9688527',
                    abundance: '0.7577',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '35.968306',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '36.9659026',
                    abundance: '0.2423',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '37.96801',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '38.968',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'Ar（氩 / Argon）',
        key: 'Ar',
        index: 18,
        overview: {
            picture_url: ElementPictureUrl.Ar,
            /**英文名字 */
            EN_name: 'Argon',
            /**中文名字 */
            ZhCN_name: '氩',
            relative_mass: '39.9478',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '35.967546',
                    abundance: '0.00337',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '36.966775',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '37.962732',
                    abundance: '0.00063',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '38.964313',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '39.962383',
                    abundance: '0.996',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '40.964501',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '41.96305',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'K（钾 / Potassium）',
        key: 'K',
        index: 19,
        overview: {
            picture_url: ElementPictureUrl.K,
            /**英文名字 */
            EN_name: 'Potassium',
            /**中文名字 */
            ZhCN_name: '钾',
            relative_mass: '39.0983',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '38.963707',
                    abundance: '0.932581',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '39.963999',
                    abundance: '0.000117',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '40.961826',
                    abundance: '0.067302',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '41.962403',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '42.960716',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
    {
        name: 'Ca（钙 / Calcium）',
        key: 'Ca',
        index: 20,
        overview: {
            picture_url: ElementPictureUrl.Ca,
            /**英文名字 */
            EN_name: 'Calcium',
            /**中文名字 */
            ZhCN_name: '钙',
            relative_mass: '40.0780',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '39.962591',
                    abundance: '0.96941',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '40.962278',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '41.958618',
                    abundance: '0.00647',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '42.958767',
                    abundance: '0.00135',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '43.955481',
                    abundance: '0.02086',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '44.956185',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '45.953693',
                    abundance: '0.00004',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '46.954546',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '47.952533',
                    abundance: '0.00187',
                    type: ISOTOPE_TYPE.STABLE,
                }
            ]
        },
    },
    {
        name: 'Ag（银 / Silver）',
        key: 'Ag',
        index: 47,
        overview: {
            picture_url: ElementPictureUrl.Ag,
            /**英文名字 */
            EN_name: 'Silver',
            /**中文名字 */
            ZhCN_name: '银',
            relative_mass: '107.8681',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '104.906528',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '105.906666',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '106.905093',
                    abundance: '0.51839',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '108.904756',
                    abundance: '0.48161',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '109.90611',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '10.905295',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ]
        },
    },
    {
        name: 'Ba（钡 / Barium）',
        key: 'Ba',
        index: 56,
        overview: {
            picture_url: ElementPictureUrl.Ba,
            /**英文名字 */
            EN_name: 'Barium',
            /**中文名字 */
            ZhCN_name: '钡',
            relative_mass: '137.3267',
            density: '',
        },
        properties: {
            isotope: [
                {
                    mass: '129.906311',
                    abundance: '0.00106',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '130.906931',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '131.905056',
                    abundance: '0.00101',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '132.906002',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }, {
                    mass: '133.904503',
                    abundance: '0.0242',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '134.905684',
                    abundance: '0.06593',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '135.904571',
                    abundance: '0.0785',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '136.905823',
                    abundance: '0.1123',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '137.905242',
                    abundance: '0.717',
                    type: ISOTOPE_TYPE.STABLE,
                }, {
                    mass: '139.910599',
                    abundance: '0',
                    type: ISOTOPE_TYPE.RADIOACTIVE,
                }
            ],
        },
    },
];