import React, { useRef, useEffect } from "react";
import { animCount } from "../../utils/animations";

interface StatProps {
  val: number;
  suffix: string;
  label: string;
  sub: string;
  delay: string;
}

const Stat: React.FC<StatProps> = ({ val, suffix, label, sub, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.classList.contains("in") && numRef.current) {
      animCount(numRef.current, val, suffix);
    }
  }, [val, suffix]);

  return (
    <div className={`stat-block rv ${delay}`} ref={ref}>
      <div className="stat-num-wrap">
        <span className="stat-num" ref={numRef} data-val={val}>
          0{suffix}
        </span>
      </div>
      <div className="stat-lbl">{label}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
};

const StatsStrip: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-strip" ref={sectionRef}>
      <div className="stats-inner">
        <Stat
          val={57}
          suffix=""
          label="Councils"
          sub="20 LGAs &amp; 37 LCDAs"
          delay="d1"
        />
        <Stat
          val={200}
          suffix="k+"
          label="Audits Processed"
          sub="Annually"
          delay="d2"
        />
        <Stat
          val={12}
          suffix="h"
          label="Response Time"
          sub="Average Turnaround"
          delay="d3"
        />
        <Stat
          val={100}
          suffix="%"
          label="Digital Adoption"
          sub="Across State"
          delay="d4"
        />
      </div>
    </section>
  );
};

export default StatsStrip;
