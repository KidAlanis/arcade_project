import { defaultLook, items, type Item, type Look } from "@/lib/dreamio";

export function PixelIcon({
  name,
  size = 24,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, string> = {
    star: "M11 1h2v6h3v3h6v3h-6v3h-3v6h-2v-6H8v-3H2v-3h6V7h3Z",
    heart: "M3 5h6v3h6V5h6v3h3v7h-3v3h-3v3h-3v3H9v-3H6v-3H3v-3H0V8h3Z",
    game: "M5 5h14v2h3v3h2v10h-7v-3H7v3H0V10h2V7h3Zm0 5v2H3v3h2v2h3v-2h2v-3H8v-2Zm12 0v3h3v-3Zm-3 4v3h3v-3Z",
    shirt: "M7 2h3v3h4V2h3v2h3v2h3v7h-5v9H6v-9H1V6h3V4h3Z",
    pants: "M4 2h16v20h-6V11h-4v11H4Z",
    shoe: "M5 3h9v11h3v2h5v6H2V12h3Z",
    bow: "M2 3h5v3h3v3h4V6h3V3h5v18h-5v-3h-3v-3h-4v3H7v3H2Z",
    coin: "M7 1h10v2h4v4h2v10h-2v4h-4v2H7v-2H3v-4H1V7h2V3h4Zm3 5v3H7v6h3v3h4v-3h3V9h-3V6Z",
    bag: "M8 1h8v2h3v5h4v15H1V8h4V3h3Zm0 3v4h8V4Z",
    person: "M8 1h8v2h3v9h-3v3H8v-3H5V3h3ZM5 17h14v3h3v4H2v-4h3Z",
    check: "M2 10h4v4h3v3h3v-3h3v-3h3V8h3V5h3v8h-3v3h-3v3h-3v3H8v-3H5v-3H2Z",
    arrow: "M12 2h4v4h4v4h4v4h-4v4h-4v4h-4v-6H0V8h12Z",
    moon: "M9 1h5v3h-3v3H8v7h3v3h7v-3h3v-3h3v6h-3v4h-4v2H7v-2H3v-4H1V7h2V3h6Z",
    upload: "M10 1h4v3h3v3h3v4h-6v7h-4v-7H4V7h3V4h3ZM1 17h4v4h14v-4h4v7H1Z",
    flower: "M9 1h6v5h3v3h5v6h-5v3h-3v5H9v-5H6v-3H1V9h5V6h3Z",
    sound: "M2 9h5V6h3V3h4v18h-4v-3H7v-3H2Zm16-4h3v3h3v8h-3v3h-3v-3h3V8h-3Z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`pixel-icon ${className}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d={paths[name] || paths.star}
      />
    </svg>
  );
}

export function PixelAvatar({
  look = defaultLook,
  hair = 0,
  skin = 0,
  className = "",
}: {
  look?: Look;
  hair?: number;
  skin?: number;
  className?: string;
}) {
  const top = items.find((i) => i.id === look.top)!;
  const bottom = items.find((i) => i.id === look.bottom)!;
  const shoes = items.find((i) => i.id === look.shoes)!;
  const accessory = items.find((i) => i.id === look.accessory);
  const hairColors = [
    ["#72517b", "#a47eac", "#caa1cc"],
    ["#6d514d", "#a37b68", "#c3a08a"],
    ["#3d435d", "#69728f", "#939bb5"],
  ][hair];
  const skinColors = [
    ["#fbdac5", "#eab49d"],
    ["#dfad89", "#bf8869"],
    ["#ae775d", "#8a594b"],
  ][skin];
  return (
    <svg
      className={`pixel-avatar ${className}`}
      viewBox="0 0 48 66"
      role="img"
      aria-label="Your pixel avatar"
      shapeRendering="crispEdges"
    >
      <path fill="#65507b" opacity=".18" d="M8 62h32v3H8z" />
      <path
        fill={hairColors[0]}
        d={
          hair === 2
            ? "M12 5h24v3h4v22H8V8h4Z"
            : "M14 3h20v2h5v4h3v37h-6v4H9v-4H6V13h3V8h5Z"
        }
      />
      <path
        fill={hairColors[1]}
        d={
          hair === 2
            ? "M13 7h22v3h3v17H10V10h3Z"
            : "M15 6h18v2h5v36h-5V21H14v24H9V15h3v-5h3Z"
        }
      />
      <path
        fill={hairColors[2]}
        d="M15 8h3v6h-3zM12 15h2v19h-2zM34 13h2v27h-2z"
      />
      <path fill={skinColors[1]} d="M11 17h26v10h-3v5H14v-5h-3Z" />
      <path fill={skinColors[0]} d="M13 14h22v12h-3v4H16v-4h-3Z" />
      <path
        fill={hairColors[0]}
        d="M12 11h24v8h-4v-5h-3v6h-4v-7h-3v5h-4v-4h-3v6h-3Z"
      />
      <path fill={hairColors[1]} d="M14 10h20v4h-3v-2h-5v4h-3v-4h-5v3h-4Z" />
      <path fill="#52405e" d="M16 21h5v6h-5zM27 21h5v6h-5z" />
      <path fill="#fff8f3" d="M17 21h2v2h-2zM28 21h2v2h-2z" />
      <path fill="#b893c0" d="M18 25h2v1h-2zM29 25h2v1h-2z" />
      <path fill="#ef9eac" d="M13 26h4v2h-4zM31 26h4v2h-4z" />
      <path fill="#bc7b83" d="M23 28h3v1h-3z" />
      <path
        fill={skinColors[1]}
        d="M21 31h6v5h-6zM11 41h4v8h-4zM33 41h4v8h-4zM17 51h5v10h-5zM27 51h5v10h-5z"
      />
      <path
        fill={skinColors[0]}
        d="M11 42h3v5h-3zM34 42h3v5h-3zM18 52h3v8h-3zM28 52h3v8h-3z"
      />
      <path fill={top.dark} d="M18 33h12v2h5v3h3v7h-6v6H16v-6h-6v-7h3v-3h5Z" />
      <path fill={top.color} d="M18 35h4v2h4v-2h4v2h4v6h-4v6H18v-6h-4v-6h4Z" />
      <path fill="#fff" opacity=".5" d="M16 37h2v5h-2zM19 39h2v8h-2z" />
      {top.style === "heart" && (
        <path fill="#fff3f6" d="M21 40h2v2h2v-2h2v4h-2v2h-2v-2h-2Z" />
      )}
      {top.style === "star" && (
        <path fill="#fff0b7" d="M23 39h2v3h3v2h-3v3h-2v-3h-3v-2h3Z" />
      )}
      <path
        fill={bottom.dark}
        d={
          bottom.style === "skirt"
            ? "M16 48h16v3h2v5H14v-5h2Z"
            : "M16 48h16v12h-7v-6h-2v6h-7Z"
        }
      />
      <path
        fill={bottom.color}
        d={
          bottom.style === "skirt"
            ? "M17 49h14v3h2v2H15v-2h2Z"
            : "M17 49h14v3h-2v6h-3v-6h-4v6h-5Z"
        }
      />
      <path fill={shoes.dark} d="M15 59h8v5H13v-3h2ZM25 59h8v2h2v3H25Z" />
      <path fill={shoes.color} d="M16 59h6v3h-8v-1h2ZM26 59h6v2h2v1h-8Z" />
      {accessory?.style === "bow" && (
        <g>
          <path fill={accessory.dark} d="M29 5h5v3h3V5h5v10h-5v-3h-3v3h-5Z" />
          <path fill={accessory.color} d="M30 6h3v3h5V6h3v7h-3v-3h-5v3h-3Z" />
        </g>
      )}
      {accessory?.style === "star" && (
        <path fill={accessory.color} d="M35 8h3v3h3v3h-3v3h-3v-3h-3v-3h3Z" />
      )}
      {accessory?.style === "bunny" && (
        <g>
          <path fill={accessory.dark} d="M11 0h7v7h12V0h7v13h-4V8H15v5h-4Z" />
          <path fill={accessory.color} d="M12 0h5v9h-5ZM31 0h5v9h-5Z" />
          <path fill="#efa8c4" d="M14 1h2v6h-2ZM32 1h2v6h-2Z" />
        </g>
      )}
    </svg>
  );
}

export function ItemArt({ item }: { item: Item }) {
  return (
    <svg
      className="item-art"
      viewBox="0 0 40 40"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <g fill={item.dark}>
        {item.category === "top" && (
          <path d="M11 6h6v3h6V6h6v3h4v3h4v12h-8v12H11V24H3V12h4V9h4Z" />
        )}
        {item.category === "bottom" && (
          <path
            d={
              item.style === "skirt"
                ? "M11 5h18v6h3v6h3v17H5V17h3v-6h3Z"
                : "M9 5h22v31H21V20h-2v16H9Z"
            }
          />
        )}
        {item.category === "shoes" && (
          <path d="M5 7h10v17h4v11H1V21h4ZM24 7h10v17h5v11H21V21h3Z" />
        )}
        {item.category === "accessory" && item.style === "bow" && (
          <path d="M4 9h8v4h5v3h6v-3h5V9h8v23h-8v-4h-5v-3h-6v3h-5v4H4Z" />
        )}
        {item.style === "star" && item.category === "accessory" && (
          <path d="M17 3h6v10h4v4h10v6H27v4h-4v10h-6V27h-4v-4H3v-6h10v-4h4Z" />
        )}
        {item.style === "bunny" && (
          <path d="M7 1h9v17h8V1h9v26h-4V22H11v5H7Z" />
        )}
      </g>
      <g fill={item.color}>
        {item.category === "top" && (
          <path d="M12 9h4v3h8V9h4v3h4v3h2v6h-8v12H14V21H6v-6h2v-3h4Z" />
        )}
        {item.category === "bottom" && (
          <path
            d={
              item.style === "skirt"
                ? "M13 8h14v6h3v6h2v11H8V20h3v-6h2Z"
                : "M12 8h16v25h-4V17h-8v16h-4Z"
            }
          />
        )}
        {item.category === "shoes" && (
          <path d="M7 10h6v17h4v5H4V24h3ZM26 10h6v17h5v5H24V24h2Z" />
        )}
        {item.style === "bow" && (
          <path d="M6 12h5v4h5v3h8v-3h5v-4h5v17h-5v-4h-5v-3h-8v3h-5v4H6Z" />
        )}
        {item.style === "star" && item.category === "accessory" && (
          <path d="M18 6h4v10h4v3h8v3H24v4h-3v8h-3V24h-4v-3H6v-3h10v-4h2Z" />
        )}
        {item.style === "bunny" && (
          <path d="M9 3h5v17h12V3h5v21h-2v-4H11v4H9Z" />
        )}
      </g>
      {item.category === "top" && (
        <path
          fill={item.style === "heart" ? "#fff3f7" : "#d0c1de"}
          d="M16 18h3v3h2v-3h3v6h-3v3h-2v-3h-3Z"
        />
      )}
      {item.style === "bunny" && (
        <path fill="#efb3cf" d="M10 4h2v11h-2ZM28 4h2v11h-2Z" />
      )}
    </svg>
  );
}

export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 82 34"
      className={`pixel-cloud ${className}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path
        fill="#c2abd9"
        d="M14 12V6h8V0h22v6h10v6h14v6h8v10h-8v6H10v-6H0V18h6v-6Z"
      />
      <path
        fill="#fff9fd"
        d="M16 12V6h8V2h18v6h10v6h14v6h8v6h-8v4H12v-4H3v-6h5v-8Z"
      />
      <path fill="#f3d9ed" d="M3 23h9v4h53v-4h9v3h-8v4H12v-4H3Z" />
    </svg>
  );
}
