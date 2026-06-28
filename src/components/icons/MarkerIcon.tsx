interface MarkerIconProps {
  color?: string;
}

const MarkerIcon = ({ color = '#3F51B5' }: MarkerIconProps) => (
  <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill={color} />
    <circle cx="14" cy="14" r="5" fill="white" />
  </svg>
);

export default MarkerIcon;
