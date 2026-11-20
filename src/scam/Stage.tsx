import { C } from "./theme";

/** Visual area between the header and the on-screen text. */
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      top: 290,
      left: 0,
      right: 0,
      height: 800,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = C.text,
  size = 44,
  style,
}) => <div style={{ fontSize: size, fontWeight: 700, color, textAlign: "center", ...style }}>{children}</div>;
