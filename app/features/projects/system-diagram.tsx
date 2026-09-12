import type { ProjectArchitecture } from "./projects-data";

const NODE_WIDTH = 150;
const NODE_HEIGHT = 56;
const PADDING = 20;

const kindStroke: Record<string, string> = {
  client: "var(--primary)",
  service: "var(--border)",
  data: "var(--border)",
  external: "var(--border)",
};

export function SystemDiagram({ architecture }: { architecture: ProjectArchitecture }) {
  const { nodes, edges } = architecture;
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const maxX = Math.max(...nodes.map((n) => n.x)) + NODE_WIDTH + PADDING;
  const maxY = Math.max(...nodes.map((n) => n.y)) + NODE_HEIGHT + PADDING;

  const center = (id: string) => {
    const node = nodeMap.get(id);
    if (!node) return { x: 0, y: 0 };
    return { x: node.x + NODE_WIDTH / 2, y: node.y + NODE_HEIGHT / 2 };
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface p-4">
      <svg
        viewBox={`0 0 ${maxX} ${maxY}`}
        className="h-auto min-w-140"
        role="img"
        aria-label="System architecture diagram"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--muted-foreground)" />
          </marker>
        </defs>

        {edges.map((edge, index) => {
          const from = center(edge.from);
          const to = center(edge.to);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <g key={index}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--muted-foreground)"
                strokeOpacity={0.5}
                strokeWidth={1.25}
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <g>
                  <rect
                    x={midX - (edge.label.length * 5.5 + 8) / 2}
                    y={midY - 17}
                    width={edge.label.length * 5.5 + 8}
                    height={14}
                    rx={4}
                    fill="var(--surface)"
                  />
                  <text
                    x={midX}
                    y={midY - 7}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono"
                    fontSize={10}
                  >
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={10}
              fill="var(--card)"
              stroke={kindStroke[node.kind ?? "service"]}
              strokeWidth={1.5}
            />
            <text
              x={NODE_WIDTH / 2}
              y={node.sublabel ? 24 : NODE_HEIGHT / 2 + 4}
              textAnchor="middle"
              className="fill-foreground font-heading"
              fontSize={13}
              fontWeight={600}
            >
              {node.label}
            </text>
            {node.sublabel && (
              <text
                x={NODE_WIDTH / 2}
                y={40}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                fontSize={10}
              >
                {node.sublabel}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
