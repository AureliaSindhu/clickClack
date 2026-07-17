import { collageConfigs } from './collageConfigs';

export const mapCollageType = (type: string): keyof typeof collageConfigs => {
    switch (type.toLowerCase()) {
        case 'special-ed':
        case 'specialed':
        return 'specialEd';
        case 'onebyfour':
        case 'one-by-four':
        return 'oneByFour';
        case 'twobytwo':
        case 'two-by-two':
        case '2by2':
        return 'twoByTwo';
        default:
        return type as keyof typeof collageConfigs;
    }
};
