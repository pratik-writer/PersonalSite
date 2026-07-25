import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import graphData from "../data/graph.json";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: string;
  description: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    node: GraphNode;
  } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 700 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const height = Math.max(Math.min(width * 0.85, 720), 500);
      setDimensions({ width, height });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const nodes: GraphNode[] = graphData.nodes.map((d) => ({ ...d }));
    const links: GraphLink[] = graphData.links.map((d) => ({ ...d }));

    const getRadius = (group: string) => {
      if (group === "center") return 24;
      if (group === "primary") return 14;
      return 8;
    };

    const getStrength = (group: string) => {
      if (group === "center") return -400;
      if (group === "primary") return -200;
      return -80;
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force(
        "charge",
        d3.forceManyBody<GraphNode>().strength((d) => getStrength(d.group))
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius((d) => getRadius(d.group) + 14));

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "var(--color-border)")
      .attr("stroke-width", 1)
      .attr("opacity", 0.6);

    const nodeGroup = g
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "grab")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    nodeGroup
      .append("circle")
      .attr("r", (d) => getRadius(d.group))
      .attr("fill", (d) =>
        d.group === "center"
          ? "var(--color-text)"
          : d.group === "primary"
            ? "#374151"
            : "#9ca3af"
      )
      .attr("stroke", "var(--color-bg)")
      .attr("stroke-width", 2)
      .attr("transition", "all 0.2s");

    nodeGroup
      .filter((d) => d.group !== "secondary")
      .append("text")
      .text((d) => d.label)
      .attr("dy", (d) => getRadius(d.group) + 16)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--color-muted)")
      .attr("font-size", (d) => (d.group === "center" ? "13px" : "11px"))
      .attr("font-weight", (d) => (d.group === "center" ? "600" : "400"))
      .attr("pointer-events", "none");

    nodeGroup
      .on("mouseenter", (event, d) => {
        const svgRect = svgRef.current!.getBoundingClientRect();
        const transform = d3.zoomTransform(svgRef.current!);
        const x = transform.applyX(d.x!) - svgRect.left + svgRect.x;
        const y = transform.applyY(d.y!) - svgRect.top + svgRect.y;
        setTooltip({ x, y: y - getRadius(d.group) - 12, node: d });

        nodeGroup.selectAll("circle").attr("opacity", 0.2);
        link.attr("opacity", 0.05);

        const connectedIds = new Set<string>();
        connectedIds.add(d.id);
        links.forEach((l) => {
          const sourceId = typeof l.source === "object" ? l.source.id : l.source;
          const targetId = typeof l.target === "object" ? l.target.id : l.target;
          if (sourceId === d.id) connectedIds.add(targetId);
          if (targetId === d.id) connectedIds.add(sourceId);
        });

        nodeGroup
          .filter((n) => connectedIds.has(n.id))
          .selectAll("circle")
          .attr("opacity", 1)
          .attr("stroke", (n: any) =>
            n.id === d.id ? "var(--color-accent)" : "var(--color-bg)"
          )
          .attr("stroke-width", (n: any) => (n.id === d.id ? 3 : 2));

        link
          .filter((l) => {
            const sourceId = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
            const targetId = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
            return sourceId === d.id || targetId === d.id;
          })
          .attr("opacity", 0.8)
          .attr("stroke", "var(--color-accent)")
          .attr("stroke-width", 1.5);
      })
      .on("mouseleave", () => {
        setTooltip(null);
        nodeGroup.selectAll("circle")
          .attr("opacity", 1)
          .attr("stroke", "var(--color-bg)")
          .attr("stroke-width", 2);
        link
          .attr("opacity", 0.6)
          .attr("stroke", "var(--color-border)")
          .attr("stroke-width", 1);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [dimensions]);

  return (
    <section id="graph" className="px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          How I think
        </h2>
        <p className="mt-3 text-[var(--color-muted)]">
          An interactive map of my interests and how they connect. Drag nodes to explore. Hover for details.
        </p>
        <div ref={containerRef} className="relative mt-10 w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full"
            role="img"
            aria-label="Interactive knowledge graph showing interconnected areas of interest"
          />
          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 max-w-[200px] rounded-md bg-[var(--color-text)] px-3 py-2 text-xs text-white shadow-lg"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="font-medium">{tooltip.node.label}</div>
              <div className="mt-0.5 opacity-80">{tooltip.node.description}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
