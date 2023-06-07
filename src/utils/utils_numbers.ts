export const UtilsNumber = {
  sumByVariable(arr: any, variable: string) {
    return arr.reduce(
      (previousValue: any, currentValue: any) =>
        previousValue + (parseFloat(currentValue[variable]) || 0),
      0
    );
  },
};
