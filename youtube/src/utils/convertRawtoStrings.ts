export const convertRawtoString = ({
    labelValue,
    isSub = false,
}: {
    labelValue: string | number;
    isSub?: boolean;
}): string => {
    const value = Math.abs(Number(labelValue));

    if (value >= 1.0e9) {
        return (value / 1.0e9).toFixed(0) + "B";
    } else if (value >= 1.0e6) {
        return (value / 1.0e6).toFixed(0) + "M";
    } else if (value >= 1.0e3) {
        return (value / 1.0e3).toFixed(isSub ? 2 : 0) + "K";
    } else {
        return value.toString();
    }
};
