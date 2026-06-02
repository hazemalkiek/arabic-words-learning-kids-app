import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 900;
  const contentMaxWidth = isLargeTablet ? 800 : isTablet ? Math.min(width - 48, 720) : width;
  const hPad = isTablet ? Math.max(24, (width - contentMaxWidth) / 2) : 20;
  const numCols = (phone: number, tablet: number, large?: number): number => {
    if (isLargeTablet && large != null) return large;
    return isTablet ? tablet : phone;
  };
  return { isTablet, isLargeTablet, contentMaxWidth, hPad, screenWidth: width, numCols };
}
